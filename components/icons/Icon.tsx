import type { LucideIcon, LucideProps } from "lucide-react";

export const ICON_SIZES = {
  xs: 14,
  sm: 16,
  md: 18,
  lg: 20,
  xl: 24,
} as const;

export type IconSize = keyof typeof ICON_SIZES;

type AppIconProps = Omit<LucideProps, "size"> & {
  icon: LucideIcon;
  size?: IconSize | number;
};

export function AppIcon({
  icon: IconComponent,
  size = "md",
  strokeWidth = 2,
  ...props
}: AppIconProps) {
  const dimension = typeof size === "number" ? size : ICON_SIZES[size];

  return (
    <IconComponent
      size={dimension}
      strokeWidth={strokeWidth}
      aria-hidden={props["aria-label"] ? undefined : true}
      {...props}
    />
  );
}
