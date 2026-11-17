import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface Palette {
  accent: string;
  ink: string;
  panel: string;
}

function useThemePalette(): Palette {
  const [palette, setPalette] = useState<Palette>({
    accent: "#c6ff4d",
    ink: "#f5f5f5",
    panel: "#111111",
  });

  useEffect(() => {
    const read = () => {
      const styles = getComputedStyle(document.documentElement);
      setPalette({
        accent: styles.getPropertyValue("--c-accent").trim() || "#c6ff4d",
        ink: styles.getPropertyValue("--c-ink").trim() || "#f5f5f5",
        panel: styles.getPropertyValue("--c-panel").trim() || "#111111",
      });
    };
    read();
    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);

  return palette;
}

/** Normalised pointer position across the whole viewport, not just the canvas,
 *  so the object keeps responding while the pointer is over the portrait. */
function usePointerRef() {
  const pointer = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      pointer.current.x = (event.clientX / window.innerWidth - 0.5) * 2;
      pointer.current.y = (event.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);
  return pointer;
}

function EnergyCore({
  palette,
  pointer,
}: {
  palette: Palette;
  pointer: React.RefObject<{ x: number; y: number }>;
}) {
  const group = useRef<THREE.Group>(null);
  const shell = useRef<THREE.Mesh>(null);
  const inner = useRef<THREE.Mesh>(null);
  const ringA = useRef<THREE.Mesh>(null);
  const ringB = useRef<THREE.Mesh>(null);
  const satellites = useRef<THREE.Group>(null);
  const intro = useRef(0);

  useFrame((_, delta) => {
    const d = Math.min(delta, 0.05);
    intro.current = Math.min(1, intro.current + d * 0.45);
    const eased = 1 - Math.pow(1 - intro.current, 3);

    if (group.current) {
      group.current.rotation.y += d * 0.14;
      const px = pointer.current?.x ?? 0;
      const py = pointer.current?.y ?? 0;
      group.current.rotation.x = THREE.MathUtils.damp(
        group.current.rotation.x,
        py * 0.26,
        2.4,
        d,
      );
      group.current.rotation.z = THREE.MathUtils.damp(
        group.current.rotation.z,
        -px * 0.1,
        2,
        d,
      );
      group.current.position.x = THREE.MathUtils.damp(
        group.current.position.x,
        px * 0.16,
        2.6,
        d,
      );
      group.current.position.y = THREE.MathUtils.damp(
        group.current.position.y,
        -py * 0.12,
        2.6,
        d,
      );
      group.current.scale.setScalar(0.88 + eased * 0.12);
    }

    if (shell.current) shell.current.rotation.y -= d * 0.22;
    if (inner.current) inner.current.rotation.y += d * 0.3;
    if (ringA.current) ringA.current.rotation.z += d * 0.16;
    if (ringB.current) ringB.current.rotation.z -= d * 0.1;
    if (satellites.current) satellites.current.rotation.y += d * 0.34;
  });

  return (
    <group ref={group} rotation={[0.22, -0.4, 0.12]}>
      {/* Faceted metal body. Flat shading keeps the silhouette architectural. */}
      <mesh>
        <icosahedronGeometry args={[1.02, 2]} />
        <meshStandardMaterial
          color={palette.panel}
          metalness={0.35}
          roughness={0.42}
          flatShading
          envMapIntensity={0.7}
        />
      </mesh>

      {/* Inner lattice, faintly luminous. */}
      <mesh ref={inner} scale={0.98}>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial
          color={palette.accent}
          wireframe
          transparent
          opacity={0.26}
        />
      </mesh>

      {/* Outer orbital shell. */}
      <mesh ref={shell} scale={1.48}>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial
          color={palette.ink}
          wireframe
          transparent
          opacity={0.16}
        />
      </mesh>

      <mesh ref={ringA} rotation={[Math.PI / 2.15, 0, 0]}>
        <torusGeometry args={[1.66, 0.004, 8, 220]} />
        <meshBasicMaterial color={palette.ink} transparent opacity={0.42} />
      </mesh>

      <mesh ref={ringB} rotation={[Math.PI / 1.6, 0.55, 0]}>
        <torusGeometry args={[1.92, 0.003, 8, 220]} />
        <meshBasicMaterial color={palette.accent} transparent opacity={0.62} />
      </mesh>

      <group ref={satellites} rotation={[0.6, 0, 0.2]}>
        {[
          [1.66, 0, 0],
          [-1.66, 0, 0],
          [0, 1.66, 0.3],
          [0, -1.66, -0.2],
        ].map((position, index) => (
          <mesh
            key={index}
            position={position as [number, number, number]}
            scale={index % 2 === 0 ? 0.045 : 0.03}
          >
            <sphereGeometry args={[1, 12, 12]} />
            <meshBasicMaterial color={palette.accent} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

export default function HeroScene({ className }: { className?: string }) {
  const palette = useThemePalette();
  const pointer = usePointerRef();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(true);

  useEffect(() => {
    const element = wrapperRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { threshold: 0.01 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={wrapperRef} className={className} aria-hidden="true">
      <Canvas
        frameloop={active ? "always" : "never"}
        dpr={[1, 1.65]}
        camera={{ position: [0, 0, 5.2], fov: 42 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[3.5, 4.5, 5]} intensity={3.4} color="#ffffff" />
        <directionalLight position={[-4, 2, 3]} intensity={1.15} color="#dbe6ff" />
        <directionalLight position={[-4, -2, 2]} intensity={0.9} color={palette.ink} />
        <pointLight position={[-2.6, -2.2, 2.4]} intensity={18} color={palette.accent} distance={9} />
        <pointLight position={[2.4, 2.8, -2.6]} intensity={10} color={palette.panel} distance={8} />
        <EnergyCore palette={palette} pointer={pointer} />
      </Canvas>
    </div>
  );
}
