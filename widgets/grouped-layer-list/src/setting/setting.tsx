import { React } from 'jimu-core';
import { TextInput, TextArea } from 'jimu-ui';
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

  const groupNameChangeHandler = (value: string) => {
    props.onSettingChange({
        id: props.id,
        config: props.config.set("groupName", value)
    });
  }

  const parseTextArea = (value)=>{try{ return JSON.parse(value)}catch{return null}}
  const toTextAreaFormat = (values)=>{ 
    if (values) {
      try {
        return '["' + values.join('", "') + '"]'
      } catch {
        return '["' + values[0] + '"]'
      }
    } else {
      return null
    }
  }

  const onGroupLayerTitlesChange = (value) => {
    props.onSettingChange({
      id: props.id,
      config: props.config.set("groupedLayerTitles", parseTextArea(value))
    });
  }

  const onHiddenLayerTitlesChange = (value) => {
    props.onSettingChange({
      id: props.id,
      config: props.config.set("hiddenLayerTitles", parseTextArea(value))
    });
  }

  console.log("groupedLayerTitles", props.config.groupedLayerTitles)
  console.log("hiddenLayerTitles", props.config.hiddenLayerTitles)

  
  return (
    <div className="p-2">
      <div className="mb-3">
        Select Map:
        <MapWidgetSelector onSelect={onMapSelected} useMapWidgetIds={props.useMapWidgetIds} />
      </div>
      <label>
        Name of Group:{' '}
        <TextInput
            className="mb-3"
            value={ props.config.groupName }
            onChange={(e) => { groupNameChangeHandler(e.target.value); }}
        />
      </label>
      <label>
        Grouped Layer Titles:{' '}
        <TextArea
          className="mb-3"
          placeholder='["layer1", "layer2"]'
          value={ toTextAreaFormat(props.config.groupedLayerTitles) }
          onChange={(e) => { onGroupLayerTitlesChange(e.target.value); }}
        />
      </label>
      <label>
        Hidden Layer Titles:{' '}
        <TextArea
          className="mb-3"
          placeholder='["layer1", "layer2"]'
          value={ toTextAreaFormat(props.config.hiddenLayerTitles) }
          onChange={(e) => { onHiddenLayerTitlesChange(e.target.value); }}
        />
      </label>
    </div>
  );
}