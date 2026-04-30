import { React, AllDataSourceTypes, Immutable } from 'jimu-core'
import { AllWidgetSettingProps } from 'jimu-for-builder'
import { DataSourceSelector } from 'jimu-ui/advanced/data-source-selector'
import { MapWidgetSelector } from 'jimu-ui/advanced/setting-components'
import { Label, NumericInput, TextInput } from 'jimu-ui'
import { IMConfig } from '../config'

export default function Setting(props: AllWidgetSettingProps<IMConfig>): React.ReactElement {
  // Only feature layers are supported because the widget queries parcel features directly.
  const supportedTypes = Immutable([AllDataSourceTypes.FeatureLayer])

  // Update the selected parcel data source in widget settings.
  const onDataSourceChange = (useDataSources: any[]) => {
    props.onSettingChange({
      id: props.id,
      useDataSources
    })
  }

  // Persist a single config field back to the widget config object.
  const onPropChange = (propName: string, value: string | number) => {
    props.onSettingChange({
      id: props.id,
      config: props.config.set(propName, value)
    })
  }

  // The settings panel lets the builder choose the parcel layer, optional map, and search defaults.
  return (
    <div className='p-3'>
      <div className='mb-3'>
        Select parcel data source
        <DataSourceSelector
          types={supportedTypes}
          mustUseDataSource
          useDataSources={props.useDataSources}
          onChange={onDataSourceChange}
          widgetId={props.id}
        />
      </div>

      <div className='mb-3'>
        Optional map for zooming results
        <MapWidgetSelector onSelect={(useMapWidgetIds: string[]) => props.onSettingChange({ id: props.id, useMapWidgetIds })} useMapWidgetIds={props.useMapWidgetIds} />
      </div>

      <Label className='w-100 mb-2'>
        Input placeholder text
        <TextInput
          className='mt-1'
          defaultValue={props.config.placeholder}
          onChange={(event: any) => onPropChange('placeholder', event.target.value)}
        />
      </Label>

      <Label className='w-100 mb-2'>
        Max results
        <NumericInput
          className='mt-1'
          defaultValue={props.config.maxResults}
          min={1}
          max={100}
          onChange={(value: number) => onPropChange('maxResults', value)}
        />
      </Label>

      <Label className='w-100 mb-2'>
        Zoom scale for single result
        <NumericInput
          className='mt-1'
          defaultValue={props.config.zoomScale}
          min={100}
          onChange={(value: number) => onPropChange('zoomScale', value)}
        />
      </Label>
    </div>
  )
}
