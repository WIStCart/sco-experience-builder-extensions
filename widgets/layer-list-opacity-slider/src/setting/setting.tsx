import { React } from 'jimu-core';
import { MapWidgetSelector } from 'jimu-ui/advanced/setting-components';
import { AllWidgetSettingProps } from 'jimu-for-builder';
import { IMConfig } from '../config'


export default function Setting(props: AllWidgetSettingProps<IMConfig>): React.ReactElement {

  const onMapSelected = (useMapWidgetIds: string[]) => {
    props.onSettingChange({
      id: props.id,
      useMapWidgetIds: useMapWidgetIds
    });
  }

  return (
    <div className="p-2">
      <div className="mb-3">
        Select Map:
        <MapWidgetSelector onSelect={onMapSelected} useMapWidgetIds={props.useMapWidgetIds} />
      </div>
    </div>
  );
}