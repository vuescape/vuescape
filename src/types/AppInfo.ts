export interface AppInfo {
  version: string
  isSiteInMaintenanceMode: boolean
  siteMaintenanceMessage: string
  disabledFeatures: Array<string>
}
