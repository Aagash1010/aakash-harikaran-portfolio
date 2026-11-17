import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { projects, type Project } from "../../../data/profile";
import { FOCUS_DISTANCE, PLANETS } from "./planetConfig";

export interface UniverseCanvasProps {
  hovered: number | null;
  selected: number | null;
  onHover: (index: number | null) => void;
  onSelect: (index: number) => void;
  reduced: boolean;
  zoom: number;
  active: boolean;
  labelRefs: React.RefObject<(HTMLDivElement | null)[]>;
  pointerRef: React.RefObject<{ x: number; y: number }>;
  viewRef: React.RefObject<{ yaw: number; pitch: number }>;
}

/* -------------------------------------------------------------------------- */
/* Shared texture                                                             */
/* -------------------------------------------------------------------------- */

function useGlowTexture() {
  const texture = useMemo(() => {
    const size = 128;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext("2d");
    if (context) {
      const gradient = context.createRadialGradient(
        size / 2,
        size / 2,
        0,
        size / 2,
        size / 2,
        size / 2,
      );
      gradient.addColorStop(0, "rgba(255,255,255,0.95)");
      gradient.addColorStop(0.22, "rgba(255,255,255,0.5)");
      gradient.addColorStop(0.55, "rgba(255,255,255,0.14)");
      gradient.addColorStop(1, "rgba(255,255,255,0)");
      context.fillStyle = gradient;
      context.fillRect(0, 0, size, size);
    }
    const map = new THREE.CanvasTexture(canvas);
    map.colorSpace = THREE.SRGBColorSpace;
    return map;
  }, []);

  useEffect(() => () => texture.dispose(), [texture]);

  return texture;
}

/* -------------------------------------------------------------------------- */
/* Stars and atmosphere                                                       */
/* -------------------------------------------------------------------------- */

function mulberry32(seed: number) {
  return function random() {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function Stars({ reduced }: { reduced: boolean }) {
  const points = useRef<THREE.Points>(null);

  const { positions, colors } = useMemo(() => {
    const count = 820;
    const random = mulberry32(20261);
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const white = new THREE.Color("#e9eef4");
    const lime = new THREE.Color("#c6ff4d");
    const cool = new THREE.Color("#9db8d8");

    for (let i = 0; i < count; i += 1) {
      const radius = 9 + random() * 17;
      const theta = random() * Math.PI * 2;
      const phi = Math.acos(2 * random() - 1);
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.cos(phi) * 0.7;
      positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta) - 4;

      const roll = random();
      const color = roll > 0.94 ? lime : roll > 0.72 ? cool : white;
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    return { positions, colors };
  }, []);

  useFrame((_, delta) => {
    if (!reduced && points.current) {
      points.current.rotation.y += Math.min(delta, 0.05) * 0.006;
    }
  });

  return (
    <points ref={points} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.032}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.82}
        depthWrite={false}
        fog={false}
      />
    </points>
  );
}

function Nebula({
  position,
  scale,
  color,
  opacity,
  texture,
}: {
  position: [number, number, number];
  scale: number;
  color: string;
  opacity: number;
  texture: THREE.Texture;
}) {
  return (
    <sprite position={position} scale={[scale, scale, 1]}>
      <spriteMaterial
        map={texture}
        color={color}
        transparent
        opacity={opacity}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        fog={false}
      />
    </sprite>
  );
}

/* -------------------------------------------------------------------------- */
/* Orbits, links and signals                                                  */
/* -------------------------------------------------------------------------- */

function OrbitRings() {
  return (
    <group>
      {projects.map((project) => {
        const spec = PLANETS[project.visual];
        return (
          <mesh
            key={project.id}
            position={[0, spec.y, 0]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <torusGeometry args={[spec.orbit, 0.0035, 4, 180]} />
            <meshBasicMaterial
              color={spec.color}
              transparent
              opacity={0.13}
              depthWrite={false}
              toneMapped={false}
            />
          </mesh>
        );
      })}
    </group>
  );
}

function Connections({
  nodes,
  reduced,
  paused,
}: {
  nodes: React.RefObject<(THREE.Group | null)[]>;
  reduced: boolean;
  paused: boolean;
}) {
  const geometry = useMemo(() => {
    const buffer = new THREE.BufferGeometry();
    buffer.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(projects.length * 6), 3),
    );
    return buffer;
  }, []);

  const pulses = useRef<(THREE.Mesh | null)[]>([]);
  const pulseGeometry = useMemo(
    () => new THREE.SphereGeometry(0.035, 8, 8),
    [],
  );
  const phase = useRef(0);
  const world = useMemo(() => new THREE.Vector3(), []);

  useEffect(
    () => () => {
      geometry.dispose();
      pulseGeometry.dispose();
    },
    [geometry, pulseGeometry],
  );

  useFrame((_, delta) => {
    const d = Math.min(delta, 0.05);
    if (!paused && !reduced) phase.current = (phase.current + d * 0.17) % 1;

    nodes.current.forEach((node, index) => {
      if (!node) return;
      const spec = PLANETS[projects[index].visual];
      node.getWorldPosition(world);

      const array = geometry.attributes.position.array as Float32Array;
      array[index * 6] = 0;
      array[index * 6 + 1] = spec.y;
      array[index * 6 + 2] = 0;
      array[index * 6 + 3] = world.x;
      array[index * 6 + 4] = world.y;
      array[index * 6 + 5] = world.z;

      const pulse = pulses.current[index];
      if (pulse) {
        const t = (phase.current + index * 0.25) % 1;
        pulse.position.set(
          world.x * t,
          spec.y + (world.y - spec.y) * t,
          world.z * t,
        );
        pulse.scale.setScalar(0.6 + Math.sin(t * Math.PI) * 0.9);
      }
    });

    geometry.attributes.position.needsUpdate = true;
  });

  return (
    <group>
      <lineSegments geometry={geometry}>
        <lineBasicMaterial
          color="#c6ff4d"
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </lineSegments>

      {projects.map((project, index) => (
        <mesh
          key={project.id}
          ref={(element) => {
            pulses.current[index] = element;
          }}
          geometry={pulseGeometry}
          visible={!reduced && !paused}
        >
          <meshBasicMaterial
            color={PLANETS[project.visual].color}
            transparent
            opacity={0.85}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

/* -------------------------------------------------------------------------- */
/* Planets                                                                    */
/* -------------------------------------------------------------------------- */

function PlanetBody({
  project,
  spec,
  hot,
}: {
  project: Project;
  spec: (typeof PLANETS)[Project["visual"]];
  hot: boolean;
}) {
  const common = {
    emissive: spec.color,
    emissiveIntensity: hot ? 0.55 : 0.22,
    metalness: 0.42,
    roughness: 0.36,
  } as const;

  switch (project.visual) {
    case "tourism":
      return (
        <>
          <mesh>
            <sphereGeometry args={[spec.size, 28, 20]} />
            <meshStandardMaterial color="#10150c" {...common} />
          </mesh>
          <mesh scale={1.025}>
            <sphereGeometry args={[spec.size, 14, 10]} />
            <meshBasicMaterial
              color={spec.color}
              wireframe
              transparent
              opacity={0.2}
              toneMapped={false}
            />
          </mesh>
          <mesh rotation={[Math.PI / 2.4, 0.2, 0]}>
            <torusGeometry args={[spec.size * 1.66, 0.007, 6, 96]} />
            <meshBasicMaterial
              color={spec.color}
              transparent
              opacity={0.6}
              toneMapped={false}
            />
          </mesh>
          <mesh rotation={[Math.PI / 2.05, -0.5, 0.3]}>
            <torusGeometry args={[spec.size * 1.9, 0.004, 6, 96]} />
            <meshBasicMaterial
              color="#f5f5f5"
              transparent
              opacity={0.22}
              toneMapped={false}
            />
          </mesh>
        </>
      );

    case "billing":
      return (
        <>
          <group rotation={[Math.PI / 2.7, 0.15, 0.3]}>
            <mesh>
              <cylinderGeometry
                args={[spec.size, spec.size, spec.size * 0.26, 6]}
              />
              <meshStandardMaterial color="#101418" {...common} />
            </mesh>
            <mesh position={[0, spec.size * 0.32, 0]} scale={0.82}>
              <cylinderGeometry
                args={[spec.size, spec.size, spec.size * 0.22, 6]}
              />
              <meshStandardMaterial color="#0c1014" {...common} />
            </mesh>
          </group>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[spec.size * 1.55, 0.007, 6, 96]} />
            <meshBasicMaterial
              color={spec.color}
              transparent
              opacity={0.6}
              toneMapped={false}
            />
          </mesh>
          <mesh rotation={[Math.PI / 2.5, 0.45, 0]}>
            <torusGeometry args={[spec.size * 1.82, 0.004, 6, 96]} />
            <meshBasicMaterial
              color="#f5f5f5"
              transparent
              opacity={0.2}
              toneMapped={false}
            />
          </mesh>
        </>
      );

    case "weather":
      return (
        <>
          <mesh>
            <icosahedronGeometry args={[spec.size, 1]} />
            <meshStandardMaterial
              color="#161208"
              {...common}
              flatShading
            />
          </mesh>
          <mesh scale={1.04}>
            <icosahedronGeometry args={[spec.size, 1]} />
            <meshBasicMaterial
              color={spec.color}
              wireframe
              transparent
              opacity={0.24}
              toneMapped={false}
            />
          </mesh>
          <mesh rotation={[Math.PI / 2.2, 0.3, 0]}>
            <torusGeometry args={[spec.size * 1.7, 0.006, 6, 96]} />
            <meshBasicMaterial
              color={spec.color}
              transparent
              opacity={0.55}
              toneMapped={false}
            />
          </mesh>
          <mesh rotation={[0.35, 0, Math.PI / 2.4]}>
            <torusGeometry args={[spec.size * 1.9, 0.004, 6, 96]} />
            <meshBasicMaterial
              color="#f5f5f5"
              transparent
              opacity={0.18}
              toneMapped={false}
            />
          </mesh>
        </>
      );

    default:
      return (
        <>
          <group rotation={[0.4, 0.25, 0.15]}>
            <mesh>
              <boxGeometry
                args={[spec.size * 1.3, spec.size * 0.82, spec.size * 0.36]}
              />
              <meshStandardMaterial color="#17100e" {...common} />
            </mesh>
            <mesh scale={1.045}>
              <boxGeometry
                args={[spec.size * 1.3, spec.size * 0.82, spec.size * 0.36]}
              />
              <meshBasicMaterial
                color={spec.color}
                wireframe
                transparent
                opacity={0.26}
                toneMapped={false}
              />
            </mesh>
            <mesh position={[0, 0, spec.size * 0.19]}>
              <planeGeometry args={[spec.size * 0.58, spec.size * 0.3]} />
              <meshBasicMaterial
                color={spec.color}
                transparent
                opacity={0.32}
                toneMapped={false}
              />
            </mesh>
          </group>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[spec.size * 1.55, 0.007, 6, 96]} />
            <meshBasicMaterial
              color={spec.color}
              transparent
              opacity={0.55}
              toneMapped={false}
            />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[spec.size * 1.92, 0.004, 6, 96]} />
            <meshBasicMaterial
              color={spec.color}
              transparent
              opacity={0.2}
              toneMapped={false}
            />
          </mesh>
        </>
      );
  }
}

function PlanetNode({
  project,
  index,
  hovered,
  selected,
  reduced,
  paused,
  nodes,
  glowTexture,
  onHover,
  onSelect,
}: {
  project: Project;
  index: number;
  hovered: number | null;
  selected: number | null;
  reduced: boolean;
  paused: boolean;
  nodes: React.RefObject<(THREE.Group | null)[]>;
  glowTexture: THREE.Texture;
  onHover: (index: number | null) => void;
  onSelect: (index: number) => void;
}) {
  const spec = PLANETS[project.visual];
  const orbit = useRef<THREE.Group>(null);
  const body = useRef<THREE.Group>(null);
  const angle = useRef(spec.phase);

  const isHovered = hovered === index;
  const isSelected = selected === index;
  const hot = isHovered || isSelected;

  useFrame((_, delta) => {
    const d = Math.min(delta, 0.05);
    if (!paused && !reduced) angle.current += d * spec.speed;

    if (orbit.current) {
      orbit.current.position.set(
        Math.cos(angle.current) * spec.orbit,
        spec.y,
        Math.sin(angle.current) * spec.orbit,
      );
    }

    if (body.current) {
      const target = isSelected ? 1.26 : isHovered ? 1.13 : 1;
      if (reduced) {
        body.current.scale.setScalar(target);
      } else {
        const next = THREE.MathUtils.damp(
          body.current.scale.x,
          target,
          7,
          d,
        );
        body.current.scale.setScalar(next);
        body.current.rotation.y += d * (isSelected ? 0.42 : 0.2);
      }
    }
  });

  return (
    <group
      ref={(element) => {
        nodes.current[index] = element;
        orbit.current = element;
      }}
      position={[
        Math.cos(spec.phase) * spec.orbit,
        spec.y,
        Math.sin(spec.phase) * spec.orbit,
      ]}
      onPointerOver={(event) => {
        event.stopPropagation();
        onHover(index);
      }}
      onPointerOut={(event) => {
        event.stopPropagation();
        onHover(null);
      }}
      onClick={(event) => {
        event.stopPropagation();
        onSelect(index);
      }}
    >
      <group ref={body}>
        <sprite scale={spec.size * 7}>
          <spriteMaterial
            map={glowTexture}
            color={spec.color}
            transparent
            opacity={isSelected ? 0.5 : isHovered ? 0.4 : 0.22}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            fog={false}
          />
        </sprite>

        <PlanetBody project={project} spec={spec} hot={hot} />

        <mesh
          rotation={[Math.PI / 2.35, 0.35, 0]}
          visible={hot}
        >
          <torusGeometry args={[spec.size * 2.1, 0.006, 6, 96]} />
          <meshBasicMaterial
            color={spec.color}
            transparent
            opacity={0.85}
            toneMapped={false}
          />
        </mesh>

        {/* Generous invisible hit area for precise pointers. */}
        <mesh>
          <sphereGeometry args={[Math.max(spec.size * 1.55, 0.78), 10, 8]} />
          <meshBasicMaterial
            transparent
            opacity={0}
            depthWrite={false}
            colorWrite={false}
          />
        </mesh>
      </group>
    </group>
  );
}

function SystemCore({ reduced }: { reduced: boolean }) {
  const group = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!reduced && group.current) {
      group.current.rotation.y += Math.min(delta, 0.05) * 0.08;
    }
  });

  return (
    <group ref={group}>
      <mesh>
        <sphereGeometry args={[0.24, 20, 16]} />
        <meshStandardMaterial
          color="#0c110b"
          emissive="#c6ff4d"
          emissiveIntensity={0.35}
          metalness={0.5}
          roughness={0.4}
        />
      </mesh>
      <mesh scale={1.85}>
        <icosahedronGeometry args={[0.24, 1]} />
        <meshBasicMaterial
          color="#c6ff4d"
          wireframe
          transparent
          opacity={0.16}
          toneMapped={false}
        />
      </mesh>
      <mesh rotation={[Math.PI / 2.1, 0.35, 0]}>
        <torusGeometry args={[0.72, 0.004, 6, 96]} />
        <meshBasicMaterial
          color="#c6ff4d"
          transparent
          opacity={0.35}
          toneMapped={false}
        />
      </mesh>
      <mesh rotation={[Math.PI / 1.8, -0.5, 0]}>
        <torusGeometry args={[0.9, 0.003, 6, 96]} />
        <meshBasicMaterial
          color="#f5f5f5"
          transparent
          opacity={0.14}
          toneMapped={false}
        />
      </mesh>
      <pointLight
        position={[0, 0, 0]}
        intensity={3.5}
        distance={4.5}
        color="#c6ff4d"
      />
    </group>
  );
}

/* -------------------------------------------------------------------------- */
/* Camera + projected labels                                                  */
/* -------------------------------------------------------------------------- */

function CameraRig({
  nodes,
  selected,
  zoom,
  reduced,
  pointerRef,
  viewRef,
}: {
  nodes: React.RefObject<(THREE.Group | null)[]>;
  selected: number | null;
  zoom: number;
  reduced: boolean;
  pointerRef: React.RefObject<{ x: number; y: number }>;
  viewRef: React.RefObject<{ yaw: number; pitch: number }>;
}) {
  const { camera, size } = useThree();
  const desiredPosition = useMemo(() => new THREE.Vector3(), []);
  const desiredLook = useMemo(() => new THREE.Vector3(), []);
  const currentLook = useRef(new THREE.Vector3(0, 0, 0));
  const focus = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, delta) => {
    const d = Math.min(delta, 0.05);
    const node = selected !== null ? nodes.current[selected] : null;

    if (node) {
      node.getWorldPosition(focus);
      const shift = Math.min(1, Math.max(0.55, size.width * 0.0008));
      desiredPosition.set(
        focus.x + 0.08,
        focus.y + 0.16,
        focus.z + FOCUS_DISTANCE,
      );
      desiredLook.set(focus.x + shift, focus.y, focus.z);
    } else {
      const yaw = viewRef.current?.yaw ?? 0;
      const pitch = viewRef.current?.pitch ?? 0;
      const px = reduced ? 0 : pointerRef.current?.x ?? 0;
      const py = reduced ? 0 : pointerRef.current?.y ?? 0;
      const radius = 8.55 / zoom;

      desiredPosition.set(
        Math.sin(yaw) * radius + px * 0.6,
        THREE.MathUtils.clamp(1.55 - py * 0.4 + pitch * 3.4, 0.7, 4.3),
        Math.cos(yaw) * radius,
      );
      desiredLook.set(px * 0.18, -0.04, 0);
    }

    const lambda = reduced ? 30 : selected !== null ? 3.4 : 2.7;
    const blend = reduced ? 1 : 1 - Math.exp(-lambda * d);

    camera.position.lerp(desiredPosition, blend);
    currentLook.current.lerp(desiredLook, blend);
    camera.lookAt(currentLook.current);
  });

  return null;
}

function LabelProjector({
  nodes,
  labelRefs,
  selected,
}: {
  nodes: React.RefObject<(THREE.Group | null)[]>;
  labelRefs: React.RefObject<(HTMLDivElement | null)[]>;
  selected: number | null;
}) {
  const { camera, size } = useThree();
  const world = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    nodes.current.forEach((node, index) => {
      const element = labelRefs.current?.[index];
      if (!node || !element) return;

      node.getWorldPosition(world);
      world.y -= PLANETS[projects[index].visual].size * 2.05;
      world.project(camera);

      const x = (world.x * 0.5 + 0.5) * size.width;
      const y = (-world.y * 0.5 + 0.5) * size.height;
      const visible =
        world.z < 1 &&
        x > -90 &&
        x < size.width + 90 &&
        y > 4 &&
        y < size.height + 24;

      element.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      element.style.opacity = visible
        ? selected === null || selected === index
          ? "1"
          : "0.28"
        : "0";
      element.style.visibility = visible ? "visible" : "hidden";
    });
  });

  return null;
}

/* -------------------------------------------------------------------------- */
/* Scene                                                                      */
/* -------------------------------------------------------------------------- */

function UniverseScene({
  hovered,
  selected,
  onHover,
  onSelect,
  reduced,
  zoom,
  labelRefs,
  pointerRef,
  viewRef,
}: Omit<UniverseCanvasProps, "active">) {
  const nodes = useRef<(THREE.Group | null)[]>([]);
  const glowTexture = useGlowTexture();
  const paused = selected !== null;

  return (
    <>
      <fog attach="fog" args={["#060806", 15, 38]} />

      <ambientLight intensity={0.55} />
      <directionalLight
        position={[4, 6, 6]}
        intensity={2.4}
        color="#f2f6ee"
      />
      <directionalLight
        position={[-5, 2, 3]}
        intensity={1}
        color="#c9d6e8"
      />
      <pointLight
        position={[-3.4, 1.4, 4.2]}
        intensity={14}
        distance={11}
        color="#c6ff4d"
      />
      <pointLight
        position={[3.2, -2.4, -2.5]}
        intensity={8}
        distance={10}
        color="#8fc4ff"
      />

      <Stars reduced={reduced} />
      <Nebula
        position={[-9, 4.5, -14]}
        scale={22}
        color="#c6ff4d"
        opacity={0.045}
        texture={glowTexture}
      />
      <Nebula
        position={[9, -4, -16]}
        scale={26}
        color="#8fc4ff"
        opacity={0.05}
        texture={glowTexture}
      />
      <Nebula
        position={[1, 8, -19]}
        scale={30}
        color="#f5f5f5"
        opacity={0.028}
        texture={glowTexture}
      />

      <OrbitRings />

      {projects.map((project, index) => (
        <PlanetNode
          key={project.id}
          project={project}
          index={index}
          hovered={hovered}
          selected={selected}
          reduced={reduced}
          paused={paused}
          nodes={nodes}
          glowTexture={glowTexture}
          onHover={onHover}
          onSelect={onSelect}
        />
      ))}

      <SystemCore reduced={reduced} />
      <Connections nodes={nodes} reduced={reduced} paused={paused} />

      <CameraRig
        nodes={nodes}
        selected={selected}
        zoom={zoom}
        reduced={reduced}
        pointerRef={pointerRef}
        viewRef={viewRef}
      />
      <LabelProjector
        nodes={nodes}
        labelRefs={labelRefs}
        selected={selected}
      />
    </>
  );
}

export default function UniverseCanvas({
  active,
  ...props
}: UniverseCanvasProps) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.6]}
      camera={{ position: [0, 1.55, 8.55], fov: 38, near: 0.1, far: 70 }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.12;
        gl.setClearColor(0x000000, 0);
      }}
    >
      <UniverseScene {...props} />
    </Canvas>
  );
}
