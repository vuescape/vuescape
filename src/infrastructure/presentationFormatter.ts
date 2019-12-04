import { Dictionary } from '@vuescape/types'

export function round(value: any, places: number = 0) {
  let p = places || 0
  p = p < 0 ? 0 : p

  const factor = Math.pow(10, p)
  const rounded = Math.round(value * factor) / factor

  return rounded
}

const toNumber = (value: any, places: number) => {
  let p = places || 0
  p = p < 0 ? 0 : p

  const factor = Math.pow(10, p)
  const rounded = Math.abs(Math.round(value * factor)) / factor
  const parts = (rounded + '').split('.')

  let result = parts[0]
    .split('')
    .reverse()
    .reduce((acc, num, i) => {
      return num + (i && !(i % 3) ? ',' : '') + acc
    }, '')

  if (p > 0) {
    let digitsAfterDecimal = parts.length > 1 && parseInt(parts[1], undefined) ? parts[1] : ('' + factor).substring(1)
    digitsAfterDecimal = digitsAfterDecimal + ('' + factor).substring(1 + digitsAfterDecimal.length)
    result += '.' + digitsAfterDecimal
  }

  return result
}

const toAccountingDisplay = (value: any, places: number) => {
  const p = places || 1
  return round(value, p) >= 0.0 ? toNumber(value, p) : '(' + toNumber(value, p) + ')'
}

const toCurrencyDisplay = (value: any, places: number) => {
  return round(value) >= 0.0 ? '$' + toNumber(value, places) : '-$' + toNumber(value, places)
}

const toPercentageDisplay = (value: any, places: number) => {
  // TODO: do this better
  value *= 100
  return round(value, places) >= 0.0 ? toNumber(value, places) + '%' : '-' + toNumber(value, places) + '%'
}

const toNumberDisplay = (value: any, places: number) => {
  return round(value, places) >= 0.0 ? toNumber(value, places) : '-' + toNumber(value, places)
}

const presentationFormatMap: Dictionary<(value: any, places: number) => string> = {
  currency: toCurrencyDisplay,
  percentage: toPercentageDisplay,
  number: toNumberDisplay,
}

export function formatValue(presentationFormat: string, value: string, numberOfDecimalPlaces: number) {
  const formatter = presentationFormatMap[presentationFormat]
  if (!formatter) {
    console.warn(
      `Could not find formatter for presentationFormat: ${presentationFormat}. Using original value of ${value}.`,
    )
    return value
  }

  return formatter(value, numberOfDecimalPlaces)
}
