export class Guid {
  public static newGuid() {
    let d = Date.now()
    if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
      d += performance.now()
    }
    // Inspired by https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
    // tslint:disable:no-bitwise
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = (d + Math.random() * 16) % 16 | 0
      d = Math.floor(d / 16)
      return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
    })
    // tslint:enable:no-bitwise
  }
}
