import { Store } from 'vuex'

import { PaneKind } from '@vuescape/components/Reporting'

import {
  ClientBehavior,
  ColumnWidthBehavior,
  ColumnWrapBehavior,
  Guid,
  HoverContentKind,
  HttpMethod,
  Link,
  LinkName,
  LinkTarget,
  SortComparisonStrategy,
  SortDirection,
  SortLevel,
  toEnum,
  TreeTable,
  TreeTableCell,
  TreeTableHeaderCell,
  TreeTableHeaderRow,
  TreeTableRow,
  tryToEnum,
  UnitOfMeasure,
} from '@vuescape/index'

import { ValueMapper } from '@vuescape/store/modules/types'
import {
  dispatchAndAwaitAction,
  registerStoreModule,
} from '@vuescape/store/storeHelpers'

import { Report, Section } from '.'
import { HorizontalAlignment, ResourceKind, UiObjectType } from '..'

export class ReportValueMapperFactory {
  private reportValueMapperInstance: ValueMapper<Report | undefined>
  private clickHandlerInstance?: (row?: TreeTableRow, cell?: TreeTableCell) => void
  private store? : Store<Report>
  private namespacePrefix? : string 
  private baseUri? : string 

  public constructor(
    // row?: TreeTableRow,
    // cell?: TreeTableCell,
    store?: Store<Report>,
    namespacePrefix?: string,
    baseUri?: string,
    clickHandler?: (row?: TreeTableRow, cell?: TreeTableCell) => void,
  ) {
    const self = this
    self.store = store
    self.namespacePrefix = namespacePrefix
    self.baseUri = baseUri

    self.clickHandlerInstance = clickHandler ?? self.getClickHandler()
    self.reportValueMapperInstance = (input: any) => {
      if (!input) {
        return
      }

      const isNavigation = input.id.toLowerCase().endsWith('navigation')
      const result: Report = {
        id: input.id,
        title: input.title,
        sections: self.processSections(input.sections, self.clickHandlerInstance, isNavigation),
        additionalReportInfo: input.additionalReportInfo,
        downloadLinks: self.processDownloadLinks(input.downloadLinks),
      }

      return result
    }
  }

  public makeValueMapper() {
    return this.reportValueMapperInstance
  }

  private getClickHandler() {
    const clickHandler = (
      // this: ((row?: TreeTableRow, cell?: TreeTableCell) => void) | undefined, 
      row?: TreeTableRow,
      cell?: TreeTableCell) => {
      if (!cell?.links ||!cell.links[LinkName.Self.toLowerCase()]) {
        return undefined
      }

      const selfLink = cell.links![LinkName.Self.toLowerCase()]

      const reportValueMapperFactory = new ReportValueMapperFactory(
        this.store,
        this.namespacePrefix,
        this.baseUri,
        this.clickHandlerInstance, 
        )

      if (this.store && this.namespacePrefix) {
        // TODO: set namespace based on target
        // TODO: ensure links exist and reference self
        let namespace = this.namespacePrefix
        if (selfLink.linkTarget === LinkTarget.CenterPane) {
          namespace +=  '/' + PaneKind[PaneKind.Main].toLowerCase()
        }
        else if (selfLink.linkTarget === LinkTarget.LeftPane) {
          namespace +=  '/' + PaneKind[PaneKind.Navigation].toLowerCase()
        }
        else if (selfLink.linkTarget === LinkTarget.RightPane) {
          namespace +=  '/' + PaneKind[PaneKind.Detail].toLowerCase()
        }
        else {
          console.error('Unsupported LinkTarget: ' + selfLink.linkTarget.toString())
        }

        const sourceUrl = cell.links![LinkName.Self.toLowerCase()].source

        registerStoreModule(
          this.store,
          namespace,
          HttpMethod.Get,
          sourceUrl,
          this.baseUri,
          false,
          undefined,
          reportValueMapperFactory.reportValueMapperInstance,
        )

        dispatchAndAwaitAction(namespace, sourceUrl, this.store)
      }
      else {
        throw Error('Could not register store module. store or namespace not specified')
      }
    }

    return clickHandler
  }

  private processDownloadLinks(downloadLinks: Array<any>) {
    if (downloadLinks && downloadLinks.length > 0) {
      const mappedLinks = downloadLinks.map(_ => {
        const link : Link = { 
          source: _.source, 
          linkTarget: toEnum(LinkTarget, _.linkTarget),
          resourceKind: toEnum(ResourceKind, _.resourceKind),
          title: '',
        }        
        return link
      })
      return mappedLinks
    }
  }

  private processSections(
    sections: any,
    clickHandler?: (row?: TreeTableRow, cell?: TreeTableCell) => void,
    isNavigation = false) {
    if (sections && sections.length !== 0) {
      const result = sections.map((section: any) => this.processSection(section, clickHandler, isNavigation))
      return result
    }

    return [] as Array<Section>
  }

  private processSection(
    section: any,
    clickHandler?: (row?: TreeTableRow, cell?: TreeTableCell) => void,
    isNavigation = false) {

    const result: Section = {
      id: section.id,
      title: section.title,
      name: section.name,
      treeTable: this.processTreeTable(section.treeTable, clickHandler, isNavigation),
    }

    return result
  }

  private processTreeTable(
    treeTable: any, 
    clickHandler?: (row?: TreeTableRow, cell?: TreeTableCell) => void, 
    isNavigation = false) {
    const result: any = {}

    const content = treeTable.content
    const behaviors = treeTable.behaviors as Array<ClientBehavior>

    content.headers?.forEach((header: TreeTableHeaderRow) => this.processHeader(header))
    content.rows?.forEach((row: TreeTableRow) => this.processRow(row, behaviors, clickHandler))
    content.footers?.forEach((row: TreeTableRow) => this.processRow(row, behaviors, clickHandler))
    result.id = treeTable.id
    result.columnDefinitions = treeTable?.columnDefinitions?.map((_: any) => {
      return {
        columnWidthBehavior: toEnum(ColumnWidthBehavior, _.columnWidthBehavior),
        columnWrapBehavior: toEnum(ColumnWrapBehavior, _.columnWrapBehavior),
        width: _.width,
        widthUnitOfMeasure: tryToEnum(UnitOfMeasure, _.widthUnitOfMeasure),
        isFrozen: _.isFrozen,
      }
    })

    content.sortLevel = toEnum(SortLevel, content.sortLevel)

    // Set default values for navigation reports
    if (isNavigation) {      
      content.cssClass += ' navigation-report'
    }

    result.content = content
    result.behaviors = behaviors
    // result.headers = content.headers
    // result.rows = content.rows
    // result.shouldScrollVertical = content.shouldScrollVertical
    // result.shouldScrollHorizontal = content.shouldScrollHorizontal
    // result.shouldSyncHeaderScroll = content.shouldSyncHeaderScroll
    // result.shouldSyncFooterScroll = content.shouldSyncFooterScroll
    // result.shouldIncludeFooter = content.shouldIncludeFooter
    // result.deadAreaColor = content.deadAreaColor
    // result.maxRows = content.maxRows
    // result.cssStyles = content.cssStyles

    return result as TreeTable
  }

  private processHeader(header: TreeTableHeaderRow) {
    header.id = header.id || Guid.newGuid()
    header.cells.forEach((cell: TreeTableHeaderCell) => {
      cell.id = cell.id || Guid.newGuid()
      if (cell.columnSorter) {
        if (cell.columnSorter.sortComparisonStrategy) {
          const sortComparisonStrategy = toEnum(
            SortComparisonStrategy,
            cell.columnSorter.sortComparisonStrategy.toString(),
          )
          cell.columnSorter.sortComparisonStrategy = sortComparisonStrategy
        }
        const sortDirection = toEnum(SortDirection, cell.columnSorter.sortDirection.toString())
        cell.columnSorter.sortDirection = sortDirection
      }
    })
  }

  private processRow(
    row: TreeTableRow,
    behaviors: Array<ClientBehavior>,
    clickHandler?: (row?: TreeTableRow, cell?: TreeTableCell) => void,
  ) {
    row.id = row.id || Guid.newGuid()
    row.cells.forEach(cell => {
      // TODO: This value should come from default slot
      cell.value = cell.displayValue
      cell.id = cell.id || Guid.newGuid()
      if (cell.links) {
        const keys = Object.keys(cell.links)
        for (const key of keys) {
          const link = cell.links[key]
          cell.links[key] = {
            title: link.title,
            source: link.source,
            linkTarget: toEnum(LinkTarget, link.linkTarget.toString()),
            resourceKind: toEnum(ResourceKind, link.resourceKind.toString()),
          }
        }
      }
      if (cell.hover) {
        if (cell.hover.contentKind) {
          const contentKind = toEnum(HoverContentKind, cell.hover.contentKind.toString())
          cell.hover.contentKind = contentKind
        } else {
          cell.hover.contentKind = HoverContentKind.None
        }
        // Default to tooltip component. TODO: ensure tooltip name is correct and component loads. 
        // May need to pre-register?
        cell.hover.content = cell.hover.content || 'tooltip'
      }

      // wire up a clickhandler if there is a self link
      // Note: in this case no click handlers will be wired up without a self link  
      if (clickHandler && cell.links && cell.links[LinkName.Self]) {
        cell.onclick = clickHandler
      }

      if (cell?.cellFormat?.horizontalAlignment) {
        cell.cellFormat.horizontalAlignment = 
          toEnum(HorizontalAlignment, cell?.cellFormat?.horizontalAlignment?.toString())
      }

      if (cell.slots) {
        const keys = Object.keys(cell.slots.slotNameToUiObjectMap)
        for (const key of keys) {
          const uiObject = cell.slots.slotNameToUiObjectMap[key] as any
          if (uiObject.uiObjectType == null) {
            debugger
          }
          cell.slots.slotNameToUiObjectMap[key] = {
            value: uiObject.value,
            uiObjectType: tryToEnum(UiObjectType, uiObject.uiObjectType?.toString()),
          }
        }

        const defaultSlotName = cell.slots.defaultSlotName
        if (cell.slots.slotNameToUiObjectMap[defaultSlotName]) {
          const uiObject = cell.slots.slotNameToUiObjectMap[defaultSlotName]
          switch(uiObject.uiObjectType) {
            case UiObjectType.Bool:
              break
            case UiObjectType.DateTime:
              break
            case UiObjectType.Decimal:
              break
            case UiObjectType.Enum:
              break
            case UiObjectType.Guid:
              break
            case UiObjectType.Int:
              break
            case UiObjectType.Long:
              break
            case UiObjectType.None:
              break
            case UiObjectType.Short:
              break
            case UiObjectType.String:
              break
            case undefined:
              break
            default:
              throw Error('Unsupported UiObjectType: ' + uiObject.uiObjectType)
              break                                                                                            
          }

          cell.value = uiObject.value
          if (!cell.displayValue) {
            cell.displayValue = uiObject.value?.toString()
          }
        }
      }
    })

    // What other client behaviors need to be wired in?

    // Process slots and assign default slot to value

    // recurse children
    if (row.children && row.children.length > 0) {
      row.children.forEach(child => this.processRow(child, behaviors, clickHandler))
    }

    if (row.expandedSummaryRows && row.expandedSummaryRows.length > 0) {
      row.expandedSummaryRows.forEach(expandedSummaryRow => 
        this.processRow(expandedSummaryRow, behaviors, clickHandler))
    }
    if (row.collapsedSummaryRows && row.collapsedSummaryRows.length > 0) {
      row.collapsedSummaryRows.forEach(collapsedSummaryRow => 
        this.processRow(collapsedSummaryRow, behaviors, clickHandler))
    }
  }
}
