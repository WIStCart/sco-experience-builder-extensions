import { React, AllWidgetProps, DataSourceComponent, loadArcGISJSAPIModules } from 'jimu-core'
import { JimuMapViewComponent, JimuMapView } from 'jimu-arcgis'
import { Alert, Button, Card, CardBody, Label, TextInput } from 'jimu-ui'
import { IMConfig } from '../config'

const { useState } = React

const ADDRESS_FIELD_ALIAS = 'Standardized Site Address'

// Common street abbreviations and direction variants used to broaden address matching.
const WORD_VARIANTS: Record<string, string[]> = {
  n: ['n', 'north'],
  north: ['north', 'n'],
  s: ['s', 'south'],
  south: ['south', 's'],
  e: ['e', 'east'],
  east: ['east', 'e'],
  w: ['w', 'west'],
  west: ['west', 'w'],
  st: ['st', 'street'],
  street: ['street', 'st'],
  ave: ['ave', 'avenue'],
  avenue: ['avenue', 'ave'],
  rd: ['rd', 'road'],
  road: ['road', 'rd'],
  dr: ['dr', 'drive'],
  drive: ['drive', 'dr'],
  ln: ['ln', 'lane'],
  lane: ['lane', 'ln'],
  ct: ['ct', 'court'],
  court: ['court', 'ct'],
  blvd: ['blvd', 'boulevard'],
  boulevard: ['boulevard', 'blvd'],

}

// Escape apostrophes before embedding user input into SQL WHERE clauses.
function escapeSqlLiteral(value: string): string {
  return value.replace(/'/g, "''")
}

// Normalize the search string so formatting differences do not block a match.
function normalizeAddressInput(value: string): string {
  return value
    .toLowerCase()
    .replace(/[.,]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

// Build a short list of address variants so one user input can match common parcel formats.
function buildAddressVariants(input: string): string[] {
  const normalized = normalizeAddressInput(input)
  if (!normalized) return []

  const tokens = normalized.split(' ')
  const variants = new Set<string>()
  variants.add(normalized)

  // Generate up to two-token substitutions so common address synonyms match.
  const indexedExpandable = tokens
    .map((token, index) => ({ token, index, options: WORD_VARIANTS[token] || [token] }))
    .filter((item) => item.options.length > 1)
    .slice(0, 4)

  for (const item of indexedExpandable) {
    for (const replacement of item.options) {
      const clone = [...tokens]
      clone[item.index] = replacement
      variants.add(clone.join(' '))
    }
  }

  for (let i = 0; i < indexedExpandable.length; i++) {
    for (let j = i + 1; j < indexedExpandable.length; j++) {
      const first = indexedExpandable[i]
      const second = indexedExpandable[j]

      for (const r1 of first.options) {
        for (const r2 of second.options) {
          const clone = [...tokens]
          clone[first.index] = r1
          clone[second.index] = r2
          variants.add(clone.join(' '))
        }
      }
    }
  }

  // Keep query compact for feature service stability and speed.
  return Array.from(variants).slice(0, 8)
}

// Convert the normalized address variants into SQL LIKE clauses.
function buildAddressWhereClauses(fieldName: string, input: string): string[] {
  const variants = buildAddressVariants(input)
  if (variants.length === 0) {
    return ['1=0']
  }

  return variants.map((variant) => `${fieldName} LIKE '%${escapeSqlLiteral(variant)}%'`)
}

// Find the actual field name for the standardized address in the selected data source.
function resolveAddressFieldName(dataSource: any): string {
  const schemaFields = dataSource?.getSchema?.()?.fields || {}

  const matchedEntry = Object.entries(schemaFields).find(([fieldName, fieldInfo]: any[]) => {
    const name = String(fieldInfo?.name || fieldName)
    const alias = String(fieldInfo?.alias || '')
    return name === ADDRESS_FIELD_ALIAS || alias === ADDRESS_FIELD_ALIAS
  })

  if (matchedEntry) {
    const [fieldName, fieldInfo]: any = matchedEntry
    return String(fieldInfo?.name || fieldName)
  }

  return ADDRESS_FIELD_ALIAS
}

// Read a field value from multiple possible field names.
function getAttributeValue(attributes: Record<string, any>, keys: string[]): string {
  for (const key of keys) {
    const value = attributes?.[key]
    if (value !== undefined && value !== null && String(value).trim() !== '') {
      return String(value)
    }
  }

  return ''
}

// Outer scroll container for the result panel.
const RESULTS_PANEL_STYLE: React.CSSProperties = {
  maxHeight: 300,
  overflowY: 'auto',
  border: '1px solid #d8dde3',
  borderRadius: 4,
  background: '#fff',
  padding: 8,
  paddingBottom: 12
}

// Individual result card styling.
const RESULT_ITEM_STYLE: React.CSSProperties = {
  border: '1px solid #d8dde3',
  borderRadius: 4,
  background: '#fff',
  overflow: 'hidden'
}

// Result header row styling.
const RESULT_SUMMARY_STYLE: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 12,
  padding: '8px 10px',
  cursor: 'pointer',
  background: '#f8f9fb',
  listStyle: 'none'
}

// Parcel ID title styling.
const RESULT_TITLE_STYLE: React.CSSProperties = {
  fontWeight: 600,
  lineHeight: 1.25,
  color: '#1f2a36'
}

// Address subtitle styling.
const RESULT_SUBTITLE_STYLE: React.CSSProperties = {
  marginTop: 2,
  fontSize: 12,
  lineHeight: 1.3,
  color: '#5f6b7a'
}

// Expanded attribute table container.
const RESULT_DETAILS_STYLE: React.CSSProperties = {
  borderTop: '1px solid #d8dde3',
  padding: '8px 10px',
  background: '#fff'
}

// One attribute row in the expanded details area.
const ATTRIBUTE_ROW_STYLE: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'minmax(110px, 180px) 1fr',
  gap: 12,
  marginBottom: 4,
  fontSize: 13,
  lineHeight: 1.35
}

// Action row used for the Show on map button.
const RESULT_ACTIONS_STYLE: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: 8,
  marginTop: 8
}

// Header layout for the result count and clear button.
const RESULTS_HEADER_STYLE: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 12,
  marginBottom: 8
}

export default function Widget(props: AllWidgetProps<IMConfig>) {
  const [jimuMapView, setJimuMapView] = useState<JimuMapView>(null)
  const [dataSource, setDataSource] = useState<any>(null)
  const [address, setAddress] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState('')
  const [results, setResults] = useState<any[]>([])
  const highlightGraphicRef = React.useRef<any>(null)

  // Remove the temporary highlight graphic from the map.
  const clearHighlight = () => {
    if (!jimuMapView?.view) return

    jimuMapView.view.graphics.removeAll()
    highlightGraphicRef.current = null
  }

  // Jump to a single parcel and draw a temporary highlight on top of it.
  const showOnMap = async (graphic: any) => {
    if (!jimuMapView?.view || !graphic?.geometry) return

    try {
      clearHighlight()

      await jimuMapView.view.goTo(
        {
          target: graphic.geometry,
          scale: props.config.zoomScale || 2000
        },
        { duration: 500 }
      )

      const [Graphic] = await loadArcGISJSAPIModules(['esri/Graphic'])
      const highlightGraphic = new Graphic({
        geometry: graphic.geometry,
        symbol: {
          type: 'simple-fill',
          color: [255, 230, 0, 0.2],
          outline: {
            color: [255, 230, 0, 1],
            width: 2
          }
        }
      })

      highlightGraphicRef.current = jimuMapView.view.graphics.add(highlightGraphic)
    } catch {
      setError('Map navigation failed.')
    }
  }

  // Fit the map to all returned geometries, or delegate to the single-result highlight flow.
  const zoomToGraphics = async (graphics: any[]) => {
    if (!jimuMapView || graphics.length === 0) return

    try {
      if (graphics.length === 1) {
        await showOnMap(graphics[0])
        return
      }

      await jimuMapView.view.goTo(graphics.map((graphic) => graphic.geometry), { duration: 700 })
      clearHighlight()
    } catch {
      setError('Map navigation failed.')
    }
  }

  // Query either the layer itself or the data source wrapper, depending on what Experience Builder provides.
  const queryLayer = async (where: string, maxResults: number) => {
    const layer = dataSource?.layer || dataSource?.getMainDataSource?.()?.layer
    if (layer?.queryFeatures) {
      const query = layer.createQuery ? layer.createQuery() : {}
      query.where = where
      query.returnGeometry = true
      query.outFields = ['*']
      query.num = maxResults

      const featureSet = await layer.queryFeatures(query)
      return featureSet?.features || []
    }

    if (dataSource?.query) {
      const result = await dataSource.query({
        where,
        page: 1,
        pageSize: maxResults
      })

      return (result?.records || []).map((record: any) => record.getData ? record.getData() : record)
    }

    return []
  }

  // Run the search, reset previous output, and zoom to the matching parcel(s).
  const onSearch = async () => {
    const trimmed = address.trim()
    setError('')
    setResults([])
    clearHighlight()

    if (!trimmed) {
      setError('Enter an address to search.')
      return
    }

    if (!dataSource) {
      setError('Select the V9 Statewide Parcels data source first.')
      return
    }

    setIsSearching(true)
    try {
      const addressFieldName = resolveAddressFieldName(dataSource)
      const whereClauses = buildAddressWhereClauses(addressFieldName, trimmed)
      const maxResults = Math.max(1, props.config.maxResults || 10)

      let graphics: any[] = []
      for (const where of whereClauses) {
        graphics = await queryLayer(where, maxResults)
        if (graphics.length > 0) break
      }

      setResults(graphics)

      if (graphics.length === 0) {
        setError('No parcel matched your address.')
        return
      }

      await zoomToGraphics(graphics)
    } catch (err: any) {
      const detail = err?.message ? ` (${err.message})` : ''
      setError(`Search failed.${detail}`)
    } finally {
      setIsSearching(false)
    }
  }

  // Clear the results list, warning text, and map highlight in one step.
  const clearResults = () => {
    setResults([])
    setError('')
    clearHighlight()
  }

  // Keep the results panel condition readable outside the JSX tree.
  const hasResults = results.length > 0

  return (
    <div className='jimu-widget p-2'>
      <DataSourceComponent
        widgetId={props.id}
        useDataSource={props.useDataSources?.[0]}
        onDataSourceCreated={(ds: any) => setDataSource(ds)}
      >
        {() => (
          <Card>
            <CardBody>
              <Label className='w-100'>
                Search by Address
                <TextInput
                  className='mt-1'
                  value={address}
                  onChange={(event: any) => setAddress(event.target.value)}
                  onKeyDown={(event: any) => {
                    if (event.key === 'Enter') onSearch()
                  }}
                  placeholder={props.config.placeholder || 'Search standardized site address'}
                />
              </Label>

              <Button className='mt-2' type='primary' disabled={isSearching} onClick={onSearch}>
                {isSearching ? 'Searching...' : 'Search Address'}
              </Button>

              {error && <Alert className='mt-2' open text={error} type='warning' withIcon />}

              {hasResults && (
                <div className='mt-2' style={RESULTS_PANEL_STYLE}>
                  <div style={RESULTS_HEADER_STYLE}>
                    <div>
                      <div className='fw-bold' style={{ fontSize: 14 }}>Results</div>
                      <div style={{ fontSize: 12, color: '#5f6b7a' }}>
                        Features displayed: 1 - {results.length} / {results.length}
                      </div>
                    </div>

                    <Button size='sm' type='default' onClick={clearResults}>
                      Clear Result
                    </Button>
                  </div>

                  <div className='d-flex flex-column' style={{ gap: 8 }}>
                    {results.map((graphic: any, index: number) => {
                      const attributes = graphic.attributes || {}
                      const parcelId = getAttributeValue(attributes, ['PARCELID']) || 'Unknown'
                      const addressLabel = getAttributeValue(attributes, [
                        'Standardized Site Address',
                        'SITEADDRESS',
                        'SITE_ADDR',
                        'ADDRESS',
                        'SITUSADDRESS'
                      ])

                      return (
                        <details key={index} style={RESULT_ITEM_STYLE}>
                          <summary style={RESULT_SUMMARY_STYLE} onClick={() => zoomToGraphics([graphic])}>
                            <div style={{ minWidth: 0 }}>
                              <div style={RESULT_TITLE_STYLE}>Parcel ID: {parcelId}</div>
                              {addressLabel && <div style={RESULT_SUBTITLE_STYLE}>{addressLabel}</div>}
                            </div>
                            <div style={{ flex: '0 0 auto', fontSize: 12, color: '#5f6b7a' }}>View</div>
                          </summary>

                          <div style={RESULT_DETAILS_STYLE}>
                            {Object.entries(attributes).map(([key, value]) => (
                              <div key={key} style={ATTRIBUTE_ROW_STYLE}>
                                <div style={{ fontWeight: 600, color: '#1f2a36', wordBreak: 'break-word' }}>{key}</div>
                                <div style={{ color: '#1f2a36', wordBreak: 'break-word' }}>{String(value ?? '')}</div>
                              </div>
                            ))}

                            <div style={RESULT_ACTIONS_STYLE}>
                              <Button size='sm' type='primary' onClick={() => showOnMap(graphic)}>
                                Show on map
                              </Button>
                            </div>
                          </div>
                        </details>
                      )
                    })}
                  </div>
                </div>
              )}
            </CardBody>
          </Card>
        )}
      </DataSourceComponent>
      <JimuMapViewComponent useMapWidgetId={props.useMapWidgetIds?.[0]} onActiveViewChange={setJimuMapView} />
    </div>
  )
}
