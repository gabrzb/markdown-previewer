import type { ReactElement } from "react";

const baseProps = {
  width: 14,
  height: 14,
  viewBox: "0 0 16 16",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.4,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const CopyIcon = (): ReactElement => (
  <svg {...baseProps}>
    <rect x="3.5" y="3.5" width="8" height="9" rx="1.5" />
    <path d="M6 3.5V2.5A1 1 0 0 1 7 1.5h5.5A1 1 0 0 1 13.5 2.5V11" />
  </svg>
);

export const PdfIcon = (): ReactElement => (
  <svg {...baseProps}>
    <path d="M9 1.5H4.5a1 1 0 0 0-1 1V13.5a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V5L9 1.5z" />
    <path d="M9 1.5V5h3.5" />
    <path d="M8 7.5v4M6 9.5l2 2 2-2" />
  </svg>
);

export const ResetIcon = (): ReactElement => (
  <svg {...baseProps}>
    <path d="M3.5 8a4.5 4.5 0 1 0 1.4-3.3" />
    <path d="M3 2.5V5.5H6" />
  </svg>
);

export const MoonIcon = (): ReactElement => (
  <svg {...baseProps}>
    <path d="M12.5 9.3A5 5 0 1 1 6.7 3.5a4 4 0 0 0 5.8 5.8z" />
  </svg>
);

export const SunIcon = (): ReactElement => (
  <svg {...baseProps}>
    <circle cx="8" cy="8" r="3" />
    <path d="M8 1v1.5M8 13.5V15M1 8h1.5M13.5 8H15M3 3l1.1 1.1M11.9 11.9 13 13M3 13l1.1-1.1M11.9 4.1 13 3" />
  </svg>
);

export const CheckIcon = (): ReactElement => (
  <svg {...baseProps} strokeWidth={1.6}>
    <path d="M3 8.5 6.5 12 13 4.5" />
  </svg>
);
