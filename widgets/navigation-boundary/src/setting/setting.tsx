import { React } from 'jimu-core';
import { NumericInput, Switch } from 'jimu-ui';
import { MapWidgetSelector } from 'jimu-ui/advanced/setting-components';
import { AllWidgetSettingProps } from 'jimu-for-builder';
import { IMConfig } from '../config';

export default function Setting(props: AllWidgetSettingProps<IMConfig>): React.ReactElement {

  const onMapSelected = (useMapWidgetIds: string[]) => {
    props.onSettingChange({
      id: props.id,
      useMapWidgetIds: useMapWidgetIds
    });
  }

  const onPropChange = (propName, value) => {
    console.log(props.config[propName])
    props.onSettingChange({
        id: props.id,
        config: props.config.set(propName, value)
    });
  }

  return (
    <div className="p-2">
      <div className="mb-3">
        Select Map:
        <MapWidgetSelector onSelect={onMapSelected} useMapWidgetIds={props.useMapWidgetIds} />
      </div>
      <label>
        X min:{' '}
        <NumericInput 
          defaultValue={ props.config.xmin }
          onChange={ (value)=>{onPropChange('xmin', value)} } 
        />
      </label>
      <label>
        y min:{' '}
        <NumericInput 
          defaultValue={ props.config.ymin }
          onChange={ (value)=>{onPropChange('ymin', value)} } 
        />
      </label>
      <label>
        X max:{' '}
        <NumericInput 
          defaultValue={ props.config.xmax }
          onChange={ (value)=>{onPropChange('xmax', value)} } 
        />
      </label>
      <label>
        Y max:{' '}
        <NumericInput 
          defaultValue={ props.config.ymax }
          onChange={ (value)=>{onPropChange('ymax', value)} } 
        />
      </label>
      <label>
        SRS WKID:{' '}
        <NumericInput 
          defaultValue={ props.config.srsWkid }
          onChange={ (value)=>{onPropChange('srsWkid', value)} }
          showHandlers={ false }
        />
      </label>
      <label>
        Initial Zoom:{' '}
        <NumericInput 
          defaultValue={ props.config.initialZoom }
          onChange={ (value)=>{onPropChange('initialZoom', value)} } 
        />
      </label>
      <label>
        Min Zoom:{' '}
        <NumericInput 
          defaultValue={ props.config.minZoom }
          onChange={ (value)=>{onPropChange('minZoom', value)} } 
        />
      </label>
      <label>
          <Switch
              className="mr-2"
              checked={ props.config.rotationEnabled }
              onChange={ (event, checked)=>{onPropChange('rotationEnabled', checked)} }
          />
          Map Rotation Enabled
      </label> 
    </div>
  );
}