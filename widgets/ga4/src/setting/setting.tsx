import { React, AllWidgetProps, getAppStore } from 'jimu-core';
import { TextInput, Switch } from 'jimu-ui';
import { IMConfig } from '../config'

export default function (props: AllWidgetProps<IMConfig>) {

    const appInfo = getAppStore().getState().appStateInBuilder.appInfo;

    const measurementIdChangeHandler = (e) => {
        props.onSettingChange({
            id: props.id,
            config: props.config.set('measurementId', e.target.value)
        });
    }

    const pageTitleChangeHandler = (value) => {
        props.onSettingChange({
            id: props.id,
            config: props.config.set('pageTitle', value)
        });
    }

    const hideConfigHandler = (e) => {
        props.onSettingChange({
            id: props.id,
            config: props.config.set('hideConfig', e.target.checked)
        });
    }
    
    // When widget is first added
    if (!props.config.initialized) {
        // Initialize the page title as the app name
        props.config = props.config.set('pageTitle', appInfo.name);

        // Set initialized to true and rerender
        props.onSettingChange({
            id: props.id,
            config: props.config.set('initialized', true)
        });
    }
        
    return (
        <div className="p-3">
            <label>
                Measurement ID:{' '}
                <TextInput
                    className="mb-3"
                    value={ props.config.measurementId }
                    onChange={(e) => { measurementIdChangeHandler(e); }}
                />
            </label>
            <label>
                Page Title:{' '}
                <TextInput
                    className="mb-3"
                    value={ props.config.pageTitle }
                    onChange={(e) => { pageTitleChangeHandler(e.target.value); }}
                />
            </label>
            <label>
                <Switch
                    className="mr-2"
                    checked={ props.config.hideConfig }
                    onChange={(e) => { hideConfigHandler(e); }}
                />
                Hide Config in Builder
            </label>  
        </div>
    );
}