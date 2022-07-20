import expect from 'expect'
import {
  DEFAULT_EMPTY_DISPLAY,
  formatValue,
  round,
  toDateDisplay,
  toDateTimeDisplay,
  toTextDisplay,
} from './presentationFormatter'

describe('presentationFormatter --', () => {
  describe('toTextDisplay --', () => {
    it('should return default emptyDisplay when value is not a string', () => {
      // Arrange
      const inputValue = {}

      // Act
      const displayValue = toTextDisplay(inputValue)

      // Assert
      expect(displayValue).toBe(DEFAULT_EMPTY_DISPLAY)
    })

    it('should return emptyDisplay when value is not a string', () => {
      // Arrange
      const inputValue = {}
      const emptyDisplay = 'not a string'

      // Act
      const displayValue = toTextDisplay(inputValue, emptyDisplay)

      // Assert
      expect(displayValue).toBe(emptyDisplay)
    })

    it('should return emptyDisplay when value is a zero length string', () => {
      // Arrange
      const inputValue = ''

      // Act
      const displayValue = toTextDisplay(inputValue)

      // Assert
      expect(displayValue).toBe(DEFAULT_EMPTY_DISPLAY)
    })

    it('should return original value when value is a non-zero length string', () => {
      // Arrange
      const inputValue = 'String to Display'

      // Act
      const displayValue = toTextDisplay(inputValue)

      // Assert
      expect(displayValue).toBe(inputValue)
    })
  })

  describe('toDateTimeDisplay --', () => {
    it('should return default emptyDisplay when value is not a string', () => {
      // Arrange
      const inputValue = {}

      // Act
      const displayValue = toDateTimeDisplay(inputValue)

      // Assert
      expect(displayValue).toBe(DEFAULT_EMPTY_DISPLAY)
    })

    it('should return emptyDisplay when value is not a string', () => {
      // Arrange
      const inputValue = {}
      const emptyDisplay = 'not a string'

      // Act
      const displayValue = toDateTimeDisplay(inputValue, emptyDisplay)

      // Assert
      expect(displayValue).toBe(emptyDisplay)
    })

    it('should return emptyDisplay when value is a zero length string', () => {
      // Arrange
      const inputValue = ''

      // Act
      const displayValue = toDateTimeDisplay(inputValue)

      // Assert
      expect(displayValue).toBe(DEFAULT_EMPTY_DISPLAY)
    })

    it('should return emptyDisplay value when value is a not a valid datetime', () => {
      // Arrange
      const inputValue = 'Invalid/date/time'

      // Act
      const displayValue = toDateTimeDisplay(inputValue)

      // Assert
      expect(displayValue).toBe(DEFAULT_EMPTY_DISPLAY)
    })

    it('should return formatted datetime when value is a valid datetime in the pm', () => {
      // Arrange
      const inputValue = '2019/01/31 22:00:00'

      // Act
      const displayValue = toDateTimeDisplay(inputValue)

      // Assert
      expect(displayValue).toBe('1/31/2019 10:00 pm')
    })

    it('should return formatted datetime when value is a valid datetime in the am', () => {
      // Arrange
      const inputValue = '2019/01/31 10:00:00'

      // Act
      const displayValue = toDateTimeDisplay(inputValue)

      // Assert
      expect(displayValue).toBe('1/31/2019 10:00 am')
    })
  })

  describe('toDateDisplay --', () => {
    it('should return default emptyDisplay when value is not a string', () => {
      // Arrange
      const inputValue = {}

      // Act
      const displayValue = toDateDisplay(inputValue)

      // Assert
      expect(displayValue).toBe(DEFAULT_EMPTY_DISPLAY)
    })

    it('should return emptyDisplay when value is not a string', () => {
      // Arrange
      const inputValue = {}
      const emptyDisplay = 'not a string'

      // Act
      const displayValue = toDateDisplay(inputValue, emptyDisplay)

      // Assert
      expect(displayValue).toBe(emptyDisplay)
    })

    it('should return emptyDisplay when value is a zero length string', () => {
      // Arrange
      const inputValue = ''

      // Act
      const displayValue = toDateDisplay(inputValue)

      // Assert
      expect(displayValue).toBe(DEFAULT_EMPTY_DISPLAY)
    })

    it('should return emptyDisplay value when value is a not a valid date', () => {
      // Arrange
      const inputValue = 'Invalid/date'

      // Act
      const displayValue = toDateDisplay(inputValue)

      // Assert
      expect(displayValue).toBe(DEFAULT_EMPTY_DISPLAY)
    })

    it('should return formatted date when value is a valid date', () => {
      // Arrange
      const inputValue = '2019/01/31'

      // Act
      const displayValue = toDateDisplay(inputValue)

      // Assert
      expect(displayValue).toBe('1/31/2019')
    })
  })

  describe('round --', () => {
    it('should use 0 decimal places as default', () => {
      // Arrange
      const inputValue = 22.1

      // Act
      const roundedValue = round(inputValue)

      // Assert
      expect(roundedValue).toEqual(22)
    })

    it('should round to 1 decimal place when specified', () => {
      // Arrange
      const inputValue = 22.123

      // Act
      const roundedValue = round(inputValue, 1)

      // Assert
      expect(roundedValue).toEqual(22.1)
    })

    it('should round up to the nearest number and respect number of decimal places', () => {
      // Arrange
      const inputValue = 22.555

      // Act
      const roundedValue = round(inputValue, 0)

      // Assert
      expect(roundedValue).toEqual(23)
    })

    // Ensures not using "Bankers Rounding"
    it('should round up when nearest integer is even', () => {
      // Arrange
      const inputValue = 2.05

      // Act
      const roundedValue = round(inputValue, 1)

      // Assert
      expect(roundedValue).toEqual(2.1)
    })

    it('should round up away from zero when input is negative', () => {
      // Arrange
      const inputValue = -22.555

      // Act
      const roundedValue = round(inputValue, 1)

      // Assert
      expect(roundedValue).toEqual(-22.6)
    })
  })

  describe('formatValue --', () => {
    describe('currency --', () => {
      it('should format correctly for positive value', () => {
        // Arrange
        const presentationFormatKind = 'currency'
        const inputValue = '22.55'
        const numberOfDecimalPlaces = 1

        // Act
        const formattedValue = formatValue(presentationFormatKind, inputValue, numberOfDecimalPlaces)

        // Assert
        expect(formattedValue).toEqual('$22.6')
      })

      it('should format correctly for negative value', () => {
        // Arrange
        const presentationFormatKind = 'currency'
        const inputValue = '-22.55'
        const numberOfDecimalPlaces = 1

        // Act
        const formattedValue = formatValue(presentationFormatKind, inputValue, numberOfDecimalPlaces)

        // Assert
        expect(formattedValue).toEqual('-$22.6')
      })

      it('should format correctly for a small negative value', () => {
        // Arrange
        const presentationFormatKind = 'currency'
        const inputValue = '-0.055'
        const numberOfDecimalPlaces = 1

        // Act
        const formattedValue = formatValue(presentationFormatKind, inputValue, numberOfDecimalPlaces)

        // Assert
        expect(formattedValue).toEqual('-$0.1')
      })

      it('should format correctly for zero', () => {
        // Arrange
        const presentationFormatKind = 'currency'
        const inputValue = '-0.00009'
        const numberOfDecimalPlaces = 2

        // Act
        const formattedValue = formatValue(presentationFormatKind, inputValue, numberOfDecimalPlaces)

        // Assert
        expect(formattedValue).toEqual('$0.00')
      })
    })

    describe('percentage --', () => {
      it('should format correctly for positive value', () => {
        // Arrange
        const presentationFormatKind = 'percentage'
        const inputValue = '22.555'
        const numberOfDecimalPlaces = 2

        // Act
        const formattedValue = formatValue(presentationFormatKind, inputValue, numberOfDecimalPlaces)

        // Assert
        expect(formattedValue).toEqual('22.56%')
      })

      it('should format correctly for negative value', () => {
        // Arrange
        const presentationFormatKind = 'percentage'
        const inputValue = '-22.555'
        const numberOfDecimalPlaces = 2

        // Act
        const formattedValue = formatValue(presentationFormatKind, inputValue, numberOfDecimalPlaces)

        // Assert
        expect(formattedValue).toEqual('-22.56%')
      })
    })

    describe('number --', () => {
      it('should format correctly for positive value', () => {
        // Arrange
        const presentationFormatKind = 'number'
        const inputValue = '22.555'
        const numberOfDecimalPlaces = 2

        // Act
        const formattedValue = formatValue(presentationFormatKind, inputValue, numberOfDecimalPlaces)

        // Assert
        expect(formattedValue).toEqual('22.56')
      })

      it('should format correctly for negative value', () => {
        // Arrange
        const presentationFormatKind = 'number'
        const inputValue = '-22.555'
        const numberOfDecimalPlaces = 2

        // Act
        const formattedValue = formatValue(presentationFormatKind, inputValue, numberOfDecimalPlaces)

        // Assert
        expect(formattedValue).toEqual('-22.56')
      })
    })

    describe('ratio --', () => {
      it('should format correctly for positive value', () => {
        // Arrange
        const presentationFormatKind = 'number'
        const inputValue = '22.555'
        const numberOfDecimalPlaces = 2

        // Act
        const formattedValue = formatValue(presentationFormatKind, inputValue, numberOfDecimalPlaces)

        // Assert
        expect(formattedValue).toEqual('22.56')
      })

      it('should format correctly for negative value', () => {
        // Arrange
        const presentationFormatKind = 'number'
        const inputValue = '-22.555'
        const numberOfDecimalPlaces = 2

        // Act
        const formattedValue = formatValue(presentationFormatKind, inputValue, numberOfDecimalPlaces)

        // Assert
        expect(formattedValue).toEqual('-22.56')
      })
    })

    describe('accounting --', () => {
      it('should format correctly for positive value', () => {
        // Arrange
        const presentationFormatKind = 'accounting'
        const inputValue = '22.555'
        const numberOfDecimalPlaces = 2

        // Act
        const formattedValue = formatValue(presentationFormatKind, inputValue, numberOfDecimalPlaces)

        // Assert
        expect(formattedValue).toEqual('22.56')
      })

      it('should format correctly for large value', () => {
        // Arrange
        const presentationFormatKind = 'accounting'
        const inputValue = '999999999.555'
        const numberOfDecimalPlaces = 2

        // Act
        const formattedValue = formatValue(presentationFormatKind, inputValue, numberOfDecimalPlaces)

        // Assert
        expect(formattedValue).toEqual('999,999,999.56')
      })

      it('should format correctly for negative value', () => {
        // Arrange
        const presentationFormatKind = 'accounting'
        const inputValue = '-22.555'
        const numberOfDecimalPlaces = 2

        // Act
        const formattedValue = formatValue(presentationFormatKind, inputValue, numberOfDecimalPlaces)

        // Assert
        expect(formattedValue).toEqual('(22.56)')
      })
    })

    describe('mmcurrency --', () => {
      it('should format correctly for positive value', () => {
        // Arrange
        const presentationFormatKind = 'mmcurrency'
        const inputValue = '151651622.555'
        const numberOfDecimalPlaces = 2

        // Act
        const formattedValue = formatValue(presentationFormatKind, inputValue, numberOfDecimalPlaces)

        // Assert
        expect(formattedValue).toEqual('$151,651,622.56mm')
      })

      it('should format correctly for negative value', () => {
        // Arrange
        const presentationFormatKind = 'mmcurrency'
        const inputValue = '-151651622.555'
        const numberOfDecimalPlaces = 2

        // Act
        const formattedValue = formatValue(presentationFormatKind, inputValue, numberOfDecimalPlaces)

        // Assert
        expect(formattedValue).toEqual('-$151,651,622.56mm')
      })
    })
  })
})
