import { React } from 'jimu-core';
import { TextInput } from 'jimu-ui';
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

  const onBasemapChange = (value) => {
    props.onSettingChange({
      id: props.id,
      config: props.config.set("basemap", value)
    });
  }

  return (
    <div className="p-2">
      <div className="mb-3">
        Select Map:
        <MapWidgetSelector onSelect={onMapSelected} useMapWidgetIds={props.useMapWidgetIds} />
      </div>
      <label>
        Base Map Name:{' '}
        <TextInput
            className="mb-3"
            value={ props.config.basemap }
            onChange={(e) => { onBasemapChange(e.target.value); }}
        />
      </label>
    </div>
  );
}