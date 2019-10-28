export function ns(...args: Array<string>) {
  if (!args || args.length === 0) {
    return ''
  }

  const namespace = args.join('/')
  if (namespace[namespace.length - 1] === '/') {
    return namespace.slice(0, -1)
  }

  return namespace
}
