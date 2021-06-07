export function toEnum<T>(enumType: T, enumString: string): T[keyof T] {
  // Split to handle flags
  const enumStrings = enumString.split('|')
  let result: T[keyof T] | null = null

  for (const enumStringKey of enumStrings) {
    const enumKey = enumStringKey as keyof T
    const enumValue = enumType[enumKey]

    if (!result) {
      result = enumValue
    } else {
      // Add value if flags
      // tslint:disable-next-line: no-bitwise
      (result as any) |= enumValue as any
    }
  }

  // Must have a result now unless we couldn't find the enum. Don't have the enum name here
  // so just list out the values (should be able to determine the enum from those in the case of troubleshooting).
  if (!result) {
    throw new Error(
      `The enum string, '${enumString}', was not found in the enum with values of: '${Object.values(enumType).filter(
        v => isNaN(Number(v)),
      )}'.`,
    )
  }

  return result
}
