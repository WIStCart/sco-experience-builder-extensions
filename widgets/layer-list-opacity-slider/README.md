# Layer List Opacity Slider

<img width="350" alt="image" src="https://github.com/WIStCart/sco-experience-builder-extensions/assets/10215346/9b29cfd6-f9cf-4967-95fc-ee10d1f0e5b4">

This widget was made specifically for the [Wisconsin Statewide Parcels Application](https://maps.sco.wisc.edu/Parcels/) but is flexible enough to be used in any application where it fits your needs. The widget creates a simple layer list that only shows layers visible at the current scale with an opacity slider for specific layers.

## Settings in Builder

Setting | Description
:-- | :--
Map | Select the map you want the widget to control.

## Custom Parameters in Web Map

Custom Parameter | Value | Description
:-- | --- | :--
`showInLayerList` | `true` \| `false` | Whether a layer is shown in layer list.
`hideChildren` | `true` \| `false` | Whether to hide the children of a layer in the layer list.
`opacitySlider` | `true` \| `false` | Whether to add a panel button to a layer that opens a slider to control the layer opacity. 

In your web map used for the application you can edit the [custom parameters](https://developers.arcgis.com/web-map-specification/objects/customParameters/) of each layer in order to change how they appear in the widget. For instance in the Wisconsin Statewide Parcels Application [web map](https://uw-mad.maps.arcgis.com/apps/mapviewer/index.html?webmap=bf62f36429084b9393f1cba55b8a0ae4), the county boundaries layer has a custom parameter of `showInLayerList = false`, the parcels feature layer has `opacitySlider = true`, and the parcels raster tile layer has `hideChildren = true`. This means the county boundaries will not appear in the layer list, there will be an opacity slider available for the feature layer, and the tile layer will not show child layers.
