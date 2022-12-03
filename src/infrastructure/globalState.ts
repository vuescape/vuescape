/**
 * Registers a global variable. For the web this would be attaching the variable to window.
 * @param name The name of the variable.
 * @param value The value.
 * @param shouldAlwaysRegister Whether to only always register or only register when variable name is undefined
 * @returns void
 */
export function registerGlobal(name: string, value: any, shouldAlwaysRegister = false) {
  const win = window as any
  if (shouldAlwaysRegister) {
    win[name] = value
    return
  }

  if (win[name] === undefined) {
    win[name] = value
  }
}
