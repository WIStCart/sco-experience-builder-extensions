import { React, AllWidgetProps } from 'jimu-core';
import { JimuMapViewComponent, JimuMapView } from 'jimu-arcgis';
import { IMConfig } from '../config';

import Extent from "esri/geometry/Extent";
import SpatialReference from "esri/geometry/SpatialReference";

const { useState, useRef, useEffect } = React;

export default function (props: AllWidgetProps<IMConfig>) {
  const apiWidgetContainer = useRef<HTMLDivElement>();

  const [jimuMapView, setJimuMapView] = useState<JimuMapView>(null);

  async function main(jmv:JimuMapView) {

    await jmv.view.when();
    const view = jmv.view

    const extent = new Extent({
      xmin: props.config.xmin,
      ymin: props.config.ymin,
      xmax: props.config.xmax,
      ymax: props.config.ymax,
      spatialReference: new SpatialReference({wkid:props.config.srsWkid})
    });

    view.constraints = {
      geometry: extent,
      minZoom: props.config.minZoom,
      rotationEnabled: props.config.rotationEnabled
    }
    view.zoom = props.config.initialZoom;
    
  }
  
  useEffect(() => {
    if (jimuMapView) {

      main(jimuMapView)

    }

    return () => {
       
    }

  }, [jimuMapView, props.config])

  const onActiveViewChange = (jmv: JimuMapView) => {

    setJimuMapView(jmv);

  }

  return (
    <div>
      <JimuMapViewComponent
        useMapWidgetId={props.useMapWidgetIds?.[0]}
        onActiveViewChange={onActiveViewChange}
      />
    </div>
  )
}