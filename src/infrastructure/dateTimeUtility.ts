export function formatUtcDateTimeString(utcDateTimeString: string) {
  if (!utcDateTimeString) {
    return ''
  }
  if (utcDateTimeString.slice(-1) !== 'Z') {
    utcDateTimeString += 'Z'
  }

  const dateTime = new Date(utcDateTimeString)
  const result = `${dateTime.toLocaleDateString()} ${dateTime.toLocaleTimeString()}`
  return result
}
