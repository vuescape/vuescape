import { Dictionary } from '@vuescape/types'

export const DEFAULT_EMPTY_DISPLAY = '-'

/**
 * @callback formatResult
 * @param {number} value - The value to format for display.
 * @returns {string} - The formatted result value.
 */

/**
 * Validates data and converts it into a number, then calls formatResult with the number to get the formated result.
 * @param value - The value to attempt to convert into a number.
 * @param {formatResult} formatResult - The function that will format the result for valid numbers.
 * @param emptyDisplay - The value to return if the input value is empty.
 * @returns {string} - The formatted result value from formatResult or an empty result.
 */
const formatWithNumber = (value: string, formatResult: (value: number) => string, emptyDisplay: string): string => {
  if (value == null || value === '') {
    return emptyDisplay
  }

  const numberValue = Number(value)

  return isFinite(numberValue) ? formatResult(numberValue) : emptyDisplay
}

const toNumber = (value: any, places: number) => {
  let p = places || 0
  p = p < 0 ? 0 : p

  const factor = Math.pow(10, p)
  const rounded = Math.round(Math.abs(value * factor)) / factor
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

const toAccountingDisplay = (value: string, places: number, emptyDisplay: string) => {
  const p = places || 1
  const formatter = (numberValue: number) =>
    round(numberValue, p) >= 0.0 ? toNumber(numberValue, p) : '(' + toNumber(numberValue, p) + ')'
  return formatWithNumber(value, formatter, emptyDisplay)
}

const toCurrencyDisplay = (value: string, places: number, emptyDisplay: string) => {
  const formatter = (numberValue: number) =>
    round(numberValue, places) >= 0.0 ? '$' + toNumber(numberValue, places) : '-$' + toNumber(numberValue, places)

  return formatWithNumber(value, formatter, emptyDisplay)
}

const toMMCurrencyDisplay = (value: string, places: number, emptyDisplay: string) => {
  const formatter = (numberValue: number) => {
    const p = places || 1
    return round(numberValue, p) >= 0.0 ? '$' + toNumber(numberValue, p) + 'mm' : '-$' + toNumber(numberValue, p) + 'mm'
  }

  return formatWithNumber(value, formatter, emptyDisplay)
}

const toPercentageDisplay = (value: string, places: number, emptyDisplay: string) => {
  const formatter = (numberValue: number) => {
    return round(numberValue, places) >= 0.0
      ? toNumber(numberValue, places) + '%'
      : '-' + toNumber(numberValue, places) + '%'
  }

  return formatWithNumber(value, formatter, emptyDisplay)
}

const toNumberDisplay = (value: string, places: number, emptyDisplay: string) => {
  const formatter = (numberValue: number) =>
    round(numberValue, places) >= 0.0 ? toNumber(numberValue, places) : '-' + toNumber(numberValue, places)

  return formatWithNumber(value, formatter, emptyDisplay)
}

export const toDateDisplay = (value: any, emptyValue = '-') => {
  if (value == null) {
    return emptyValue
  }

  let dateValue = new Date(value)
  // This is to fix a Safari problem in its handling of UTC dates
  if (isNaN(dateValue.getTime())) {
    dateValue = new Date(value + 'Z')
  }
  value = dateValue

  const result = isNaN(dateValue.getTime())
    ? emptyValue
    : value.getMonth() + 1 + '/' + value.getDate() + '/' + value.getFullYear()

  return result
}

export const toDateTimeDisplay = (value: any, emptyValue = '-') => {
  if (value == null) {
    return emptyValue
  }

  let dateValue = new Date(value)
  // This is to fix a Safari problem in its handling of UTC dates
  dateValue = isNaN(dateValue.getTime()) ? new Date(dateValue + 'Z') : dateValue

  let hours = dateValue.getHours()
  const amPm = hours < 12 ? 'am' : 'pm'
  hours = hours < 12 ? hours : hours - 12
  hours = hours === 0 ? 12 : hours
  let minutes = '' + dateValue.getMinutes()
  minutes = minutes.length === 1 ? '0' + minutes : minutes
  // let seconds = '' + value.getSeconds();
  // seconds = seconds.length === 1 ? '0' + seconds : seconds;

  return isNaN(dateValue.getTime())
    ? emptyValue
    : dateValue.getMonth() +
        1 +
        '/' +
        dateValue.getDate() +
        '/' +
        dateValue.getFullYear() +
        ' ' +
        hours +
        ':' +
        minutes +
        // + ":" + seconds
        ' ' +
        amPm
}

export const toTextDisplay = (value: any, emptyDisplay = '-') => {
  if (typeof value === 'string' && value.length > 0) {
    return value
  }

  return emptyDisplay
}

export type presentationFormatKind = 'currency' | 'percentage' | 'number' | 'ratio' | 'accounting' | 'mmcurrency'

export const presentationFormatMap: Dictionary<(value: any, places: number, emptyDisplay: string) => string> = {
  currency: toCurrencyDisplay,
  percentage: toPercentageDisplay,
  number: toNumberDisplay,
  ratio: toNumberDisplay,
  accounting: toAccountingDisplay,
  mmcurrency: toMMCurrencyDisplay,
}

export function round(value: number, places: number = 0) {
  let p = places || 0
  p = p < 0 ? 0 : p

  const factor = Math.pow(10, p)
  const rounded = (Math.sign(value) * Math.round(Math.abs(value * factor))) / factor

  return rounded
}

export function formatValue(
  presentationFormat: presentationFormatKind,
  value: string,
  numberOfDecimalPlaces: number,
  emptyDisplay = DEFAULT_EMPTY_DISPLAY,
) {
  const formatter = presentationFormatMap[presentationFormat]
  if (!formatter) {
    console.warn(
      `Could not find formatter for presentationFormat: ${presentationFormat}. Using original value of ${value}.`,
    )
    return value
  }

  return formatter(value, numberOfDecimalPlaces, emptyDisplay)
}
