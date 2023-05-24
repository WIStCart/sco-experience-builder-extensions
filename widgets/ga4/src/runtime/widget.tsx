import { React, AllWidgetProps, getAppStore } from 'jimu-core'
import { Alert } from 'jimu-ui';
import { IMConfig } from '../config'
import ReactGA from "react-ga4"

const Widget = (props: AllWidgetProps<IMConfig>) => {

  const appContext = getAppStore().getState().appContext;

  if (props.config.measurementId.length > 0) {
    //Initialize GA4
    ReactGA.initialize(props.config.measurementId);

    // Send pageview with a custom path
    ReactGA.send({ hitType: "pageview", page: window.location.pathname, title: props.config.pageTitle }); 
  }

  const incompleteSetupWarning = (
    <Alert
      open
      text="Config not complete!"
      type="warning"
      withIcon
      className="mb-5"
    />
  )

  if (appContext.isInBuilder && !props.config.hideConfig) {
    return (
      <div className="widget-demo jimu-widget p-5 bg-white">
        { (props.config.measurementId === '' || props.config.pageTitle === '') ? incompleteSetupWarning:null }
        <p>Google Analytics Widget</p>
        <p>Measurement ID: { props.config.measurementId }</p>
        <p>Page Title: { props.config.pageTitle }</p>
        <i>Note: This box will only be shown in the builder; however, you can hide it here too in the component settings.<br/>
        See <a href="https://www.npmjs.com/package/react-ga4" target="_blank">https://www.npmjs.com/package/react-ga4</a> for info on how to track events.</i>
      </div>
    )
  } else {
    return (null)
  }

}

export default Widget