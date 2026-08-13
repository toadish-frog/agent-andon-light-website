/**
 * Blueprint-style vector illustration of the board — MCU, USB-C connector,
 * and the 10-pixel LED row grouped exactly like the real pixel layout
 * (device/docs/USER-GUIDE.md). Drawn as SVG rather than generated/edited
 * from the source CAD renders: no image-generation tool is available in
 * this environment, and hand-drawn line art scales crisply, themes for
 * free via currentColor, and costs near-nothing on the performance budget
 * compared to the original ~250KB of PNGs.
 */

const LED_START_X = 260;
const LED_STEP_X = 67;
const LED_CY = 160;
const LED_R = 11;

const LED_INDICES = Array.from({ length: 10 }, (_, i) => i);

function ledCx(index: number) {
  return LED_START_X + index * LED_STEP_X;
}

// Literal Tailwind-esque fill values via CSS vars defined in global.css — kept
// as plain SVG attributes since this is markup, not className-driven.
function ledFill(index: number): string {
  if (index === 0) return "var(--color-neutral-400, #a3a3a3)";
  if (index <= 3) return "var(--color-status-working)";
  if (index <= 6) return "var(--color-status-waiting)";
  return "var(--color-status-idle)";
}

function GroupBracket({
  fromIndex,
  toIndex,
  label,
}: {
  fromIndex: number;
  toIndex: number;
  label: string;
}) {
  const x1 = ledCx(fromIndex) - LED_R;
  const x2 = ledCx(toIndex) + LED_R;
  const y = 222;
  const labelX = (x1 + x2) / 2;

  return (
    <g stroke="currentColor" strokeWidth={1} opacity={0.6}>
      <line x1={x1} y1={214} x2={x1} y2={y} />
      <line x1={x1} y1={y} x2={x2} y2={y} />
      <line x1={x2} y1={214} x2={x2} y2={y} />
      <text
        x={labelX}
        y={238}
        textAnchor="middle"
        fontSize={11}
        letterSpacing={1}
        stroke="none"
        fill="currentColor"
        className="font-mono uppercase"
      >
        {label}
      </text>
    </g>
  );
}

export function BoardDiagram({
  labels,
  ariaLabel,
  className,
}: {
  labels: { working: string; waiting: string; idle: string };
  ariaLabel: string;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 960 300" role="img" aria-label={ariaLabel} className={className}>
      <defs>
        <pattern id="board-grid" width={20} height={20} patternUnits="userSpaceOnUse">
          <circle cx={1} cy={1} r={1} fill="currentColor" opacity={0.15} />
        </pattern>
      </defs>

      <rect
        width={960}
        height={300}
        fill="url(#board-grid)"
        className="text-neutral-400"
      />

      <g className="text-neutral-500 dark:text-neutral-400">
        {/* Top dimension line: LED count */}
        <g stroke="currentColor" strokeWidth={1} opacity={0.6}>
          <line x1={LED_START_X} y1={95} x2={ledCx(9)} y2={95} />
          <line x1={LED_START_X} y1={88} x2={LED_START_X} y2={95} />
          <line x1={ledCx(9)} y1={88} x2={ledCx(9)} y2={95} />
        </g>
        <text
          x={(LED_START_X + ledCx(9)) / 2}
          y={78}
          textAnchor="middle"
          fontSize={12}
          fill="currentColor"
          className="font-mono"
        >
          10× WS2812B-2020
        </text>

        {/* Board outline */}
        <rect
          x={50}
          y={110}
          width={860}
          height={100}
          rx={18}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          opacity={0.5}
        />

        {/* USB-C connector */}
        <rect
          x={20}
          y={148}
          width={30}
          height={24}
          rx={4}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
        />
        <text x={8} y={196} fontSize={11} fill="currentColor" className="font-mono">
          USB-C
        </text>

        {/* MCU */}
        <rect
          x={80}
          y={135}
          width={120}
          height={50}
          rx={6}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
        />
        <rect
          x={125}
          y={150}
          width={20}
          height={20}
          rx={3}
          fill="currentColor"
          opacity={0.15}
        />
        <text
          x={140}
          y={238}
          textAnchor="middle"
          fontSize={11}
          letterSpacing={1}
          fill="currentColor"
          className="font-mono uppercase"
        >
          RP2040-Zero
        </text>

        {/* Group brackets */}
        <GroupBracket fromIndex={1} toIndex={3} label={labels.working} />
        <GroupBracket fromIndex={4} toIndex={6} label={labels.waiting} />
        <GroupBracket fromIndex={7} toIndex={9} label={labels.idle} />
      </g>

      {/* LEDs */}
      {LED_INDICES.map((index) => (
        <g key={index}>
          <circle
            cx={ledCx(index)}
            cy={LED_CY}
            r={LED_R}
            fill={ledFill(index)}
            stroke="currentColor"
            strokeOpacity={0.3}
            className="text-neutral-900 dark:text-neutral-100"
          />
          <text
            x={ledCx(index)}
            y={LED_CY - LED_R - 8}
            textAnchor="middle"
            fontSize={10}
            fill="currentColor"
            className="font-mono text-neutral-400 dark:text-neutral-500"
          >
            {index + 1}
          </text>
        </g>
      ))}
    </svg>
  );
}
