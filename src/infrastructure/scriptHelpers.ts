export function addScript(scriptContent: string, id?: string) {
  const script = document.createElement('script') as HTMLScriptElement
  script.type  = 'text/javascript'
  script.text  = scriptContent
  if (id) {
    const existingScript = document.head.querySelector(`#${id}`)
    existingScript?.remove()
    script.id = id
  }
  document.head.appendChild(script)
}

export function loadScriptFromUrl(src: string, id?: string) {
  // return new Promise(function(resolve, reject) {
  const script = document.createElement('script') as HTMLScriptElement
  script.src   = src
  script.async = true
  if (id) {
    const existingScript = document.head.querySelector(`script#${id}`)
    existingScript?.remove()
    script.id = id
  }

  // script.onload = resolve
  // script.onerror = reject
  document.head.appendChild(script)
  // })
}
