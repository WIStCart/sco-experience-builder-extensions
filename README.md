# SCO Experience Builder Extensions

This is a collection of experience builder extensions (themes and widgets) used by [Wisconsin State Cartographer's Office](https://www.sco.wisc.edu/) web applications.

## Table of Contents

**Themes:**
1. [Parcel App](#parcel-app)

**Widgets:**
1. [Basemap Toggle](#basemap-toggle)
2. [Google Analytics](#google-analytics)
3. [Layer List Opacity Slider](#layer-list-opacity-slider)
4. [Navigation Boundary](#navigation-boundary)

## Themes

### [Parcel App](themes/parcel-app/)
This is a theme for the [Wisconsin Statewide Parcels Application](https://maps.sco.wisc.edu/Parcels/). There is very light theming by the way of colors in `variables.json`; however, the majority of customization is in the `style.scss` where some elements are hidden, some are modified, but most importantly, the query hints are added using CSS.

## Widgets

### [Basemap Toggle](widgets/basemap-toggle/)
A simple basemap switcher based on the [ArcGIS JavaScript SDK `BasemapToggle`](https://developers.arcgis.com/javascript/latest/api-reference/esri-widgets-BasemapToggle.html).

**Settings:**
- Map: select the map you want the widget to control.
- Basemap name: the [stringID of the esri basemap](https://developers.arcgis.com/javascript/latest/api-reference/esri-Map.html#basemap) that you want to toggle between.

---

### [Google Analytics](widgets/ga4/)
This is a simple widget to add Google Analytics to your application.

**Settings:**
- Measurement ID: the measurement ID of your Google Analytics property
- Page Title: the value for the `title` key in a [pageview](https://developers.google.com/analytics/devguides/collection/ga4/views?client_type=gtm). This value is set to the application name by default.
- Hide Config: toggle on to hide the widget window in the builder. This transparent box can still block clicks in the app, so be sure to send it to the back using the arrange button.

---

### [Layer List Opacity Slider](widgets/layer-list-opacity-slider/)
This widget was made specifically for the [Wisconsin Statewide Parcels Application](https://maps.sco.wisc.edu/Parcels/) but is flexible enough to be used in any application where it fits your needs. The widget creates a simple layer list that only shows layers visible at the current scale with an opacity slider for specific layers.

**Settings in Builder:**
- Map: select the map you want the widget to control.

**Custom Parameters in Web Map:**
- `showInLayerList` [true/false]: whether a layer is shown in layer list.
- `hideChildren` [true/false]: whether to hide the children of a layer in the layer list.
- `opacitySlider` [true/false]: whether to add a panel button to a layer that opens a slider to control the layer opacity. 

In your web map used for the applications you can edit the [custom parameters](https://developers.arcgis.com/web-map-specification/objects/customParameters/) of each layer in order to change how they appear in the widget. For instance in the Wisconsin Statewide Parcels Application [web map](https://uw-mad.maps.arcgis.com/apps/mapviewer/index.html?webmap=bf62f36429084b9393f1cba55b8a0ae4), the county boundaries layer has a custom parameter of `showInLayerList = false`, the parcels feature layer has `opacitySlider = true`, and the parcels raster tile layer has `hideChildren = true`. This means the county boundaries will not appear in the layer list, there will be an opacity slider available for the feature layer, and the tile layer will not show child layers.

---

### [Navigation Boundary](widgets/navigation-boundary/)
Limit the pan and zoom of the map by specifying the max extent.

**Settings:**
- Map: select the map you want the widget to control.
- X Min, Y Min, X Max, Y Max: the bounds of the max extent.
- SRS WKID: the [WKID](https://developers.arcgis.com/documentation/spatial-references/#using-spatial-references) of the spatial reference system used to define the extent.
- Initial Zoom: the initial zoom level on map load.
- Min Zoom: how far out a user can zoom.
 
