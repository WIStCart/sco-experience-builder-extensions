import { React, AllWidgetProps } from 'jimu-core';
import { JimuMapViewComponent, JimuMapView } from 'jimu-arcgis';
import { IMConfig } from '../config'

import GroupLayer from "esri/layers/GroupLayer";
import LayerList from "esri/widgets/LayerList";
import Slider from "esri/widgets/Slider";
import Layer from "esri/layers/Layer";
import Color from "esri/Color";

import "./style.scss";

const { useState, useRef, useEffect } = React;

export default function (props: AllWidgetProps<IMConfig>) {
  const apiWidgetContainer = useRef<HTMLDivElement>();

  const [jimuMapView, setJimuMapView] = useState<JimuMapView>(null);
  const [layerListWidget, setLayerListWidget] = useState<LayerList>(null);
  const [featureLayer, setFeatureLayer] = useState<Layer>();
  const [originalOutlineColor, setOriginalOutlineColor] = useState<Color>();

  // Settings
  // const groupName = "V8 Parcels";
  // const groupedLayerTitles = ["V8 Parcels (Features)", "V8 Statewide Parcels"];
  // const props.config. = ["County Boundaries Vector Tiles"];

  async function main(jmv:JimuMapView) {

    await jmv.view.when();
    const view = jmv.view

    // Update renderer of feature layer
    function updateRenderer(value) {

      // Get a copy of the renderer
      const renderer = featureLayer.renderer.clone();

      // Fill is the same as the slider value
      const fillAlpha = value;

      // Blend black and original outline color based on slider value
      const black = new Color("#000000");
      const outlineColor = Color.blendColors(black, originalOutlineColor, value);

      // Save new values
      renderer.symbol.color.a = fillAlpha;
      renderer.symbol.outline.color = outlineColor;
      featureLayer.renderer = renderer;
    }

    async function defineActions(event) {
				
      const item = event.item;
      await item.layer.when();
  
      // Hide hidden layers
      if (props.config.hiddenLayerTitles.includes(item.title) || props.config.groupedLayerTitles.includes(item.title) ) {
        item.hidden = true;
      }
  
      // Create slider feature layer
      if (item.title === props.config.groupedLayerTitles[0]) {
        const slider = new Slider({
          min: 0,
          max: 1,
          precision: 2,
          values: [1],
          visibleElements: {
            labels: true,
            rangeLabels: true
          }
        });
  
        item.panel = {
          content: slider,
          className: "esri-icon-sliders-horizontal",
          title: "Fill Opacity"
        };
  
        // What to do when slider is moved
        slider.on("thumb-drag", (event) => {
          const { value } = event;
          updateRenderer(value);
        });
      }
  
      // Hide children of tile layer
      if (item.title === props.config.groupedLayerTitles[1]) {
        item.layer.listMode = "hide-children";
      }
  
    }

    // Get feature layer that will have the renderer controlled
    // It should be the first layer in the props.config.groupedLayerTitles
    let featureLayer = view.map.layers.find(function(layer){
      return layer.title === props.config.groupedLayerTitles[0];
    });
    // setFeatureLayer(featureLayer);

    // Also get a copy of the original outline color of featureLayer
    let originalOutlineColor = featureLayer?.renderer.symbol.outline.color.clone();
    // setOriginalOutlineColor(originalOutlineColor);

    // Reset group layer if it already exists
    let oldGroupLayer = view.map.layers.find(function(layer){ 
      return layer.title === props.config.groupName;
    });
    if (oldGroupLayer) {
      view.map.layers.addMany(oldGroupLayer.removeAll())
      oldGroupLayer.destroy();
    }
    
    // Get grouped layers based on list
    const groupedLayers = view.map.layers.filter(function(layer){
      return props.config.groupedLayerTitles.includes(layer.title);
    });

    // Create group layer and add to map
    let groupLayer = new GroupLayer({
      title: props.config.groupName,
      // listMode: "hide-children"
    });

    // Add grouped layers to group layer
    view.map.layers.add(groupLayer)
    groupLayer.layers = groupedLayers.map(layer => layer);

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
    if (jimuMapView && props.config.groupName && props.config.groupedLayerTitles) {

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
      // groupLayer.destroy();
      // setGroupLayer(null);
    }

    setJimuMapView(jmv);

  }

  return (
    <div>
      <JimuMapViewComponent
        useMapWidgetId={props.useMapWidgetIds?.[0]}
        onActiveViewChange={onActiveViewChange}
      />

      <div id="grouped-layer-list" ref={apiWidgetContainer} />
    </div>
  )
}