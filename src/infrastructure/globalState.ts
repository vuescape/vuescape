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
