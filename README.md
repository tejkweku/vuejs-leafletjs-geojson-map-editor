# vuejs-leafletjs-map-editor

[![Software License](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](LICENSE)
[![Vue 2.x](https://img.shields.io/badge/vue-2.x-brightgreen.svg?style=flat-square)](https://vuejs.org)

> GeoJson map editor for Vue using Leafletjs. Supports manual coordinate input and drawing modes.

## Demo

**[Go to demo](http://tej-kweku.github.io/vuejs-leafletjs-map-editor)**.

![Demo 1](https://github.com/tej-kweku/vuejs-leafletjs-map-editor/img/demo1.jpg)

![Demo 2](https://github.com/tej-kweku/vuejs-leafletjs-map-editor/img/demo2.jpg)

## Installation

Load Mapbox and Leafletjs via script tag

```html
<script src='https://api.mapbox.com/mapbox.js/v3.3.1/mapbox.js'></script>
<link href='https://api.mapbox.com/mapbox.js/v3.3.1/mapbox.css' rel='stylesheet' />

<link href='https://api.mapbox.com/mapbox.js/plugins/leaflet-draw/v0.4.10/leaflet.draw.css' rel='stylesheet' />
<script src='https://api.mapbox.com/mapbox.js/plugins/leaflet-draw/v0.4.10/leaflet.draw.js'></script>

```

[Turf.js](https://turfjs.org/) is required.
Load the minified file via a script tag.

```html
<script src='https://unpkg.com/@turf/turf/turf.min.js'></script>
```

### Git

```bash
git clone https://github.com/tej-kweku/vuejs-leafletjs-map-editor.git
```

#### Register

```js
import Vue from 'vue'
import { GeofenceEditor } from 'GeofenceEditor'

Vue.use(GeofenceEditor)
```

#### Register manually

##### Global

```js
import { GeofenceEditor } from 'GeofenceEditor';

Vue.component('geofence-editor', GeofenceEditor);
```

##### Local

```js
import { GeofenceEditor } from 'GeofenceEditor';

Vue.extend({
  template: '...',
  components: {
    geofence-editor: GeofenceEditor
  }
});
```

### Browser

Download GeofenceEditor.

```html
<script src="vue.js"></script>
<script src="GeofenceEditor.js"></script>
```


## Usage

### Minimal

```html
<geofence-editor v-model="geojson"></geofence-editor>
```

## Setup

### Parameters

Parameter | Type | Default | Description
--------- | ---- | ------- | -----------
mapbox-access-token | `String` | `null` | Mapbox Access Token.
min-features | `Number` | `1` | Minimum number of features.
max-features | `Numer` | `10` | Maximum number of features.
data-input-type | `String` | `"both"` | Data input type: manual, map or both
v-model (*required*) | ISO 8601 `String` | - | GeofenceEditor.
parentBBox | `Object` | `null` | A FeatureCollection geojson for parent bounding box.
siblingGeojson | `Object` | `null` | A FeatureCollection geojson of the sibling geojson.

<!-- 
### Internationalization

Date internationalization depends on luxon. [Set the default locale](https://moment.github.io/luxon/docs/manual/intl.html#setting-the-default).

```js
import { Settings } from 'luxon'

Settings.defaultLocale = 'es'
``` -->

### Events

Component emits the `input` event to work with `v-model`. [More info](https://vuejs.org/v2/guide/components.html#Form-Input-Components-using-Custom-Events).

`error` event is emitted when an error is detected.

Also, input text inherits all component events.

## License

[The MIT License](http://opensource.org/licenses/MIT)
