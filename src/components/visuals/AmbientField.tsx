import { usePointerField } from "../../hooks/usePointerField";

/**
 * Two barely-there lime light fields behind the page that drift a few pixels
 * with the cursor. Pure CSS transforms driven by custom properties, so it costs
 * one composited layer each and no animation loop.
 */
export function AmbientField() {
  usePointerField();

  return (
    <div aria-hidden className="ambient-field">
      <span className="ambient-field__glow" />
      <span className="ambient-field__glow ambient-field__glow--alt" />
    </div>
  );
}
