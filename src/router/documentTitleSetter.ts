import Vue from 'vue'
import { NavigationGuard } from 'vue-router'

export const makeDocumentTitleSetter = (title: string) => {

  const documentTitleSetter: NavigationGuard<Vue> = (to, from, next) => {
    document.title = title
    next()
  }
  return documentTitleSetter
}
