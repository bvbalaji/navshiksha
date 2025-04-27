export function combineClasses(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ")
}

/**
 * Converts a pixel value to a rem value
 */
export function pxToRem(px: number): string {
  return `${px / 16}rem`
}

/**
 * Creates a CSS variable value string
 */
export function cssVar(name: string): string {
  return `var(--${name})`
}

/**
 * Creates a responsive style object for different breakpoints
 */
export function responsive<T>(base: T, sm?: T, md?: T, lg?: T, xl?: T, xxl?: T): Record<string, T> {
  const styles: Record<string, T> = { base }

  if (sm) styles.sm = sm
  if (md) styles.md = md
  if (lg) styles.lg = lg
  if (xl) styles.xl = xl
  if (xxl) styles.xxl = xxl

  return styles
}
