// A blank input means "not provided" rather than 0/NaN, so it must bypass
// required/min/max checks entirely instead of being coerced into a failing number.
export const emptyToUndefined = (value: number, originalValue: unknown) =>
  typeof originalValue === 'string' && originalValue.trim() === ''
    ? undefined
    : value
