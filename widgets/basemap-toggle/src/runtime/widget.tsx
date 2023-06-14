import { React, AllWidgetProps } from 'jimu-core';
import { JimuMapViewComponent, JimuMapView } from 'jimu-arcgis';

import BasemapToggle from "esri/widgets/BasemapToggle";

const { useState, useRef, useEffect } = React;

export default function (props: AllWidgetProps<{}>) {
  const apiWidgetContainer = useRef<HTMLDivElement>();

  const [jimuMapView, setJimuMapView] = useState<JimuMapView>(null);
  const [basemapToggleWidget, setBasemapToggleWidget] = useState<BasemapToggle>(null);

  async function main(jmv:JimuMapView) {

    await jmv.view.when();
    const view = jmv.view

    if (!basemapToggleWidget) {
      // Create dummy DOM to replace with layer list
      const container = document.createElement("div");
      apiWidgetContainer.current.appendChild(container);

      // Create and add layer list
      const basemapToggle = new BasemapToggle({
        view: view, 
        nextBasemap: props.config.basemap,
        container: container
      });
      
      setBasemapToggleWidget(basemapToggle);
      
    }
    
  }
  
  useEffect(() => {
    if (jimuMapView) {

      main(jimuMapView)

    }

    return () => {
      if (basemapToggleWidget) {
        basemapToggleWidget.destroy();
        setBasemapToggleWidget(null);
      }
      
    }

  }, [jimuMapView, props.config])

  const onActiveViewChange = (jmv: JimuMapView) => {

    if (jimuMapView && basemapToggleWidget) {
      // Destroy layer list widget when mapview changes (e.g., changing map in settings)
      basemapToggleWidget.destroy();
      setBasemapToggleWidget(null);
    }

    setJimuMapView(jmv);

  }

  return (
    <div>
      <JimuMapViewComponent
        useMapWidgetId={props.useMapWidgetIds?.[0]}
        onActiveViewChange={onActiveViewChange}
      />

      <div id="basemap-toggle" ref={apiWidgetContainer} />
    </div>
  )
}