import { React, AllWidgetProps } from 'jimu-core';
import { JimuMapViewComponent, JimuMapView } from 'jimu-arcgis';

import LayerList from "esri/widgets/LayerList";
import Slider from "esri/widgets/Slider";

import "./style.scss";

const { useState, useRef, useEffect } = React;

export default function (props: AllWidgetProps<{}>) {
  const apiWidgetContainer = useRef<HTMLDivElement>();

  const [jimuMapView, setJimuMapView] = useState<JimuMapView>(null);
  const [layerListWidget, setLayerListWidget] = useState<LayerList>(null);

  async function main(jmv:JimuMapView) {

    await jmv.view.when();
    const view = jmv.view

    // Custom Parameters (set in webmap)
      // showInLayerList [true/false]
      // hideChildren [true/false]
      // opacitySlider [true/false]

    // Update renderer of feature layer
    function updateRenderer(value, layer) {

      // Fill is the same as the slider value
      const fillAlpha = value;

      // Use slider to scale outline width
      const outlineScaleFactor = 3
      const outlineWidth = outlineWidths[layer.title] + ((1 - value) * outlineScaleFactor * outlineWidths[layer.title]);

      // Save new values
      layer.renderer.symbol.color.a = fillAlpha;
      layer.renderer.symbol.outline.width = outlineWidth;
    }

    // Actions on layer list items
    async function defineActions(event) {
      
      const item = event.item;
      await item.layer.when();

      // Hide layers or children
      if (item.layer.customParameters?.showInLayerList === "false") {
        item.hidden = true;
      }
      if (item.layer.customParameters?.hideChildren === "true") {
        item.layer.listMode = "hide-children";
      }

      // Create slider feature layer
      if (item.layer.customParameters?.opacitySlider === "true") {
        const slider = new Slider({
          min: 0,
          max: 1,
          precision: 2,
          values: [1],
          visibleElements: {
            labels: true,
            rangeLabels: true,

          }
        });

        item.panel = {
          content: [slider, '<span style="text-align:center;display:block;">Layer Transparency</span>'],
          className: "esri-icon-sliders-horizontal",
          title: "Layer Transparency"
        };

        // What to do when slider is moved
        slider.on("thumb-drag", (event) => {
          const { value } = event;
          updateRenderer(value, item.layer);
        });
      }
    }

    // Get outline widths of layers with opacity slider
    let outlineWidths = {};
    view.map.allLayers.map((layer)=>{
      if(layer.customParameters?.opacitySlider === "true") {
        outlineWidths[layer.title] = layer.renderer.symbol.outline.width;
      }
    });

    if (!layerListWidget) {
      // Create dummy DOM to replace with layer list
      const container = document.createElement("div");
      apiWidgetContainer.current.appendChild(container);

      // Create and add layer list
      const layerList = new LayerList({
        view: view,
        container: container,
        listItemCreatedFunction: defineActions,
        _toggleVisibility: null
      });
      
      setLayerListWidget(layerList);
      
    }
    
  }
  
  useEffect(() => {
    if (jimuMapView) {

      main(jimuMapView)

    }

    return () => {
      if (layerListWidget) {
        layerListWidget.destroy();
        setLayerListWidget(null);
      }
      
    }

  }, [jimuMapView, props.config])

  const onActiveViewChange = (jmv: JimuMapView) => {

    if (jimuMapView && layerListWidget) {
      // Destroy layer list widget when mapview changes (e.g., changing map in settings)
      layerListWidget.destroy();
      setLayerListWidget(null);
    }

    setJimuMapView(jmv);

  }

  return (
    <div>
      <JimuMapViewComponent
        useMapWidgetId={props.useMapWidgetIds?.[0]}
        onActiveViewChange={onActiveViewChange}
      />

      <div id="layer-list-opacity-slider" ref={apiWidgetContainer} />
    </div>
  )
}