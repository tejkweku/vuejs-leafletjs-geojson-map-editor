<template>
  <div>

    <div class="form-group" style="display: flex; justify-content: space-between;">
      <div id="map-data-input" style="display: inline; flex: 1 0 100px;">
        <h5 class="m-r-20" style="display: inline">Data Input</h5>
        <label
          for="geojson-input-type-manual"
          class="custom-control custom-radio custom-control-inline"
          v-if="wDataInputType == 'manual' || wDataInputType == 'both'"
        >
          <input
            type="radio"
            class="custom-control-input"
            id="geojson-input-type-manual"
            value="manual"
            v-model="inputType"
            v-bind:disabled="inputDisabled"
            v-on:change="mapDataInputChanged('manual')"
            ref="geojsonInputTypeManual"
          />
          <span class="custom-control-label">Manual</span>
        </label>
        <label
          for="geojson-input-type-map"
          class="custom-control custom-radio custom-control-inline"
          v-if="wDataInputType == 'map' || wDataInputType == 'both'"
        >
          <input
            type="radio"
            class="custom-control-input"
            id="geojson-input-type-map"
            value="map"
            v-model="inputType"
            v-bind:disabled="inputDisabled"
            v-on:change="mapDataInputChanged('map')"
            ref="geojsonInputTypeMap"
          />
          <span class="custom-control-label">Map</span>
        </label>
      </div>

      <!-- config -->
      <div class="config">
        <button
          class="btn btn-primary"
          v-on:click="toggleConfigContainer"
          v-bind:disabled="inputDisabled"
        > Config</button>
        <div 
          class="config-content"
          v-bind:style="{ display: config.show.configContainer }"
        >

          <h5 class="config-title"> Feature Count</h5>
          <div class="form-group">
            <label
              for="config-min-features"
              class=""
            >Minimum </label>
            <input
              type="number"
              class="form-control"
              id="config-min-features"
              v-model="config.minFeatures"
              v-bind:min="Number(minFeatures)"
              v-bind:max="Number(config.maxFeatures) - 1"
            />
          </div>
          <div class="form-group">
            <label
              for="config-max-features"
              class=""
            >Maximum </label>
            <input
              type="number"
              class="form-control"
              id="config-max-features"
              v-model="config.maxFeatures"
              v-bind:min="Number(config.minFeatures) + 1"
              v-bind:max="Number(maxFeatures)"
            />
          </div>
          <hr />
          <h5 class="config-title"> Show Geojsons</h5>
          <div class="form-group">
            <label
              for="config-show-parentbbox"
              class="custom-control custom-checkbox"
            >
              <input
                type="checkbox"
                class="custom-control-input"
                id="config-show-parentbbox"
                v-model="config.show.parentBBox"
                v-bind:disabled="!parentBBox"
                v-on:change="showParentBBox"
                true-value="true"
                false-value=""
              />
              <span class="custom-control-label">Parent Bounding Box</span>
            </label>
          </div>
          <div class="form-group">
            <label
              for="config-show-sibling-geojson"
              class="custom-control custom-checkbox"
            >
              <input
                type="checkbox"
                class="custom-control-input"
                id="config-show-sibling-geojson"
                v-model="config.show.siblingGeojson"
                v-bind:disabled="!siblingGeojson"
                v-on:change="showSiblingGeojson"
                true-value="true"
                false-value=""
              />
              <span class="custom-control-label">Sibling Geojson</span>
            </label>
          </div>
          <hr />
          <h5 class="config-title"> Validation Rules</h5>
          <div class="form-group">
            <label
              for="config-validation-rules-no-intersecting-features"
              class="custom-control custom-checkbox"
            >
              <input
                type="checkbox"
                class="custom-control-input"
                id="config-validation-rules-no-intersecting-features"
                v-model="config.validationRules.noIntersectingFeatures"
              />
              <span class="custom-control-label">No Intersecting Features</span>
            </label>
          </div>
          <div class="form-group">
            <label
              for="config-validation-rules-do-not-intersect-sibling-geojson"
              class="custom-control custom-checkbox"
            >
              <input
                type="checkbox"
                class="custom-control-input"
                id="config-validation-rules-do-not-intersect-sibling-geojson"
                v-model="config.validationRules.doNotIntersectSiblingGeojson"
              />
              <span class="custom-control-label">Do Not Intersect Sibling Geojson</span>
            </label>
          </div>
          <div class="form-group">
            <label
              for="config-validation-rules-features-in-bounding-box"
              class="custom-control custom-checkbox"
            >
              <input
                type="checkbox"
                class="custom-control-input"
                id="config-validation-rules-features-in-bounding-box"
                v-model="config.validationRules.featuresInBoundingBox"
              />
              <span class="custom-control-label">All Features in Bounding Box</span>
            </label>
          </div>

        </div>
      </div>
      <!-- end config -->
    </div>

    <div class="form-group">
      <div class="alert alert-info">
        <span class="fa fa-info-circle"></span>
        Maximum number of features based on selected geofence type is {{ maxFeatures }}
      </div>
    </div>

    <!-- manual data input container -->
    <form
      id="feature-container"
      v-show="((inputType == 'manual'))"
      v-if="wDataInputType == 'manual' || wDataInputType == 'both'"
    >
      <div class="m-b-20">
        <button
          class="btn btn-primary"
          v-on:click.prevent="addFeature(1)"
          v-bind:disabled="!canAddFeature"
        > Add Feature
        </button>
        <div
          v-for="(feature, fIdx) in geojson.features"
          v-bind:key="fIdx"
          class="col-lg-12 m-t-10 feature"
        >
          <div class="m-r-10" style="flex: 1;">
            <label class="control-label">Title</label>
            <input
              v-model="feature.properties.title"
              v-bind:ref="'featureTitle' + fIdx"
              v-bind:disabled="inputDisabled"
              type="text"
              class="form-control map-manual-feature-title"
              required
            />
          </div>
          <div class="m-r-10" style="flex: 2;">
            <label class="control-label">
              Coordinates
              <span class="text-danger">*</span>
            </label>
            <input
              v-model="feature.geometry.coordinates"
              v-bind:ref="'featureCoordinates' + fIdx"
              v-bind:disabled="inputDisabled"
              type="text"
              class="form-control map-manual-feature-coordinates"
              required
            />
          </div>
          <div class="">
            <label> </label><br>
            <button
              class="btn btn-danger"
              v-on:click.prevent="removeFeature(fIdx)"
              v-bind:disabled="inputDisabled"
            >
              <i class="fa fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </form>
    <!-- end manual data input container -->

    <!-- map data input container -->
    <div>
      <div 
        id="map" 
        class="m-t-20" 
        v-show="((inputType == 'map'))" 
        v-if="wDataInputType == 'map' || wDataInputType == 'both'"
        ref="mapObj">
      </div>
    </div>
    <!-- end manual data input container -->

    <div class="form-group m-t-20 m-b-0">
      <div class="btn-group">
        <button
          class="btn btn-primary"
          style="float: right"
          v-on:click.stop="editMapData"
          v-bind:disabled="canEdit"
        >
          <i class="fa fa-edit"></i> Edit
        </button>
        <button 
          class="btn btn-primary" 
          style="float: right" 
          v-on:click.stop="resetMapData"
          v-bind:disabled="canReset"
        > 
          <i class="fa fa-undo"></i> Reset
        </button>
        <button 
          class="btn btn-primary" 
          style="float: right" 
          v-on:click.stop="validateMapData"
          v-bind:disabled="canValidate"
        > 
          <i class="fa fa-check"></i> Validate
        </button>
      </div>
    </div>

  </div>
</template>

<script>
import GeofenceMixins from "../mixins/geofences";

var map = null,
  geoJSONGroup = null,
  parentBBoxGeoJSONGroup = null,
  siblingGeoJSONGroup = null,
  featureGroup = null,
  drawControl = null;

export default {
  props: ["mapboxAccessToken", "minFeatures", "maxFeatures", "dataInputType", "parentBBox", "siblingGeojson"],
  mixins: [GeofenceMixins],
  data() {
    return {
      inputDisabled: false,
      inputType: null,
      countFeatures: 0,
      geojson: {
        type: "FeatureCollection",
        features: []
      },
      finalGeojson: {
        type: "FeatureCollection",
        features: []
      },
      defaults: {
        geojson: {
          type: "FeatureCollection",
          features: []
        },
        dataInputType: "both"
      },
      config: {
        minFeatures: 1,
        maxFeatures: 10,
        show: {
          configContainer: "none",
          parentBBox: true,
          siblingGeojson: true,
        },
        validationRules: {
          noIntersectingFeatures: true,
          doNotIntersectSiblingGeojson: true,
          featuresInBoundingBox: true
        }
      },
      errors: {
        turf: false
      }
    };
  },
  methods: {
    toggleConfigContainer: function() {
      if (this.config.show.configContainer == "none") {
        this.config.show.configContainer = 'block';
      } else {
        this.config.show.configContainer = 'none';
      }
    },
    addFeature: function(numFeatures) {
      for (let idx = 0; idx < numFeatures; idx++) {
        let newFeature = turf.polygon([]);
        this.geojson.features.push(newFeature);
        this.countFeatures++;
      }
    },
    removeFeature: function(fIdx) {
      if (this.geojson.features.length > this.config.minFeatures) {
        this.geojson.features.splice(fIdx, 1);
        this.countFeatures--;
      } else {
        this.$emit("error", "Geojson must have at least 1 feature");
      }
    },
    validateMapData: async function() {
      var vm = this;
      var dataGeojson = null;

      this.finalGeojson = JSON.parse(JSON.stringify(this.defaults.geojson));

      switch (this.inputType) {
        case "manual":
          dataGeojson = JSON.parse(JSON.stringify(this.geojson));
          break;
        case "map":
          dataGeojson = geoJSONGroup.toGeoJSON();
          break;
      }

      // run the tests
      this.testHasValidFeatures(this.inputType, dataGeojson, this.config, vm.$refs)
        .then(THVF => {
          vm.finalGeojson = THVF.geojson;

          var TFIOA = (this.config.validationRules.noIntersectingFeatures) ?
            this.testFeaturesIntersectOneAnother(
              vm.finalGeojson.features
            ) : Promise.resolve(true);
          var TFISG = (this.config.validationRules.doNotIntersectSiblingGeojson) ?
            this.testFeaturesIntersectSiblingGeojson(
              vm.finalGeojson.features,
              vm.siblingGeojson
            ) : Promise.resolve(true);
          var TBBCF = (this.config.validationRules.featuresInBoundingBox) ? 
            this.testBoundingBoxContainsFeatures(
              vm.finalGeojson.features,
              this.parentBBox
            ) : Promise.resolve(true);

          Promise.all([TFIOA, TFISG, TBBCF])
            .then(values => {
              vm.inputDisabled = true;
              if (drawControl) map.removeControl(drawControl);
              vm.$emit("input", this.finalGeojson);
            })
            .catch(err => {
              var errMsgs = [],
                errMsg = "";
              if (err.test == "TFIOA" || err.test == "TFISG") {
                err.data.forEach(errItem => {
                  if (vm.inputType == "manual") {
                    vm.$refs[
                      "featureCoordinates" + errItem["indexes"][0]
                    ][0].classList.add("is-invalid");
                    vm.$refs[
                      "featureCoordinates" + errItem["indexes"][1]
                    ][0].classList.add("is-invalid");
                    errMsg =
                      "Feature '" +
                      errItem["titles"][0] +
                      "' intersects/is within Feature '" +
                      errItem["titles"][1] +
                      "'";
                  } else if (vm.inputType == "map") {
                    errMsg = "Features are not to intersect one another (" + errItem.titles.join(", ") + ")";
                  }
                  vm.$emit("error", errMsg);
                });
              } else if (err.test == "TBBCF") {
                err.data.forEach((errDataItem) => {
                  errMsg = "Feature '" + errDataItem.titles[1] + "' is not fully within the Parent Bounding Box '" + errDataItem.titles[0] + "'";
                  vm.$emit("error", errMsg);
                });
              } else {
                vm.$emit("error", "Unable to process complex feature intersections. Recheck");
              }
            });
        })
        .catch(err => {
          vm.$emit("error", err.data);
        });
    },
    editMapData: function() {
      this.inputDisabled = false;
      if (!drawControl._map) map.addControl(drawControl);
    },
    resetMapData: function() {
      switch (this.inputType) {
        case "manual":
          this.geojson = JSON.parse(JSON.stringify(this.defaults.geojson));
          break;
        case "map":
          if (drawControl && !drawControl._map) map.addControl(drawControl);
          this.countFeatures = 0;
          break;
        default:
          break;
      }
      if (geoJSONGroup) geoJSONGroup.clearLayers();
      this.finalGeojson = JSON.parse(JSON.stringify(this.defaults.geojson));
      this.inputDisabled = false;
      this.$emit("input", null);
    },
    mapDataInputChanged: function(nextView) {
      var vm = this;

      if (nextView == "manual") {
        this.geojson = JSON.parse(JSON.stringify(geoJSONGroup.toGeoJSON()));
        this.geojson.features.forEach(feature => {
          feature.geometry.coordinates = JSON.stringify(feature.geometry.coordinates);
        });
      } else if (nextView == "map") {
        this.testHasValidFeatures("manual", JSON.parse(JSON.stringify(this.geojson)), vm.config, vm.$refs)
          .then(() => {
            this.initializeMap();
          })
          .catch((err) => {
            vm.inputType = "manual";
            vm.$emit("error", err.data);
          })
      }
    },
    showParentBBox: function() {
      var vm = this;

      if (vm.config.show.parentBBox) {
        try {
          this.parentBBoxGeoJSONGroup = L.geoJSON(vm.parentBBox, {
            style: {
              pmIgnore: true,
              color: "#555555",
              fillOpacity: 0.25,
              fillColor: "#6491A2",
              weight: 2
            }
          }).addTo(map).bringToBack();

          // draw features and zoom to fit features
          map.fitBounds(this.parentBBoxGeoJSONGroup.getBounds());
          vm.$nextTick(() => {
            if (map) {
              map.invalidateSize();
              map.fitBounds(this.parentBBoxGeoJSONGroup.getBounds());
            }
          });
        } catch (err) {
          vm.$emit("error", err.message);
        }
      } else {
        map.removeLayer(this.parentBBoxGeoJSONGroup);
      }
    },
    showSiblingGeojson: function() {
      var vm = this;

      if (vm.config.show.siblingGeojson) {
        try {
          this.siblingGeoJSONGroup = L.geoJSON(vm.siblingGeojson, {
            style: {
              pmIgnore: true,
              color: "#EA9E14",
              dashArray: "3 1",
              dashOffset: "3",
              fillOpacity: 0.25,
              fillColor: "#F2D678",
              weight: 2
            }
          }).addTo(map).bringToBack();
        } catch (err) {
          vm.$emit("error", err);
        }
      } else {
        map.removeLayer(this.siblingGeoJSONGroup);
      }
    },
    initializeMap: function() {
      var vm = this;

      try {
        if (!map) {
          L.mapbox.accessToken = this.mapboxAccessToken;

          featureGroup = L.featureGroup();
          map = L.map("map", { worldCopyJump: true })
            .setView([8, -1.5], 7)
            .addLayer(
              L.mapbox.styleLayer("mapbox://styles/mapbox/streets-v11", {
                tileLayer: { format: "jpg70" }
              })
            );

          map.on("draw:created", (e, l) => {
            try {
              if (vm.countFeatures >= vm.config.maxFeatures) {
                vm.$emit("error", "Number of features exceeds limit for selected Geofence Type");
              } else {
                vm.countFeatures++;
                featureGroup.clearLayers();
                featureGroup
                  .addLayer(e.layer)
                  .setZIndex();
                geoJSONGroup.addData(featureGroup.toGeoJSON());
                vm.$emit("input", null);
              }
            } catch (err) {
              vm.$emit("error", err);
            }
          });
          map.on("draw:edited", e => {
            // DO NOTHING
          });
          map.on("draw:deleted", e => {
            vm.countFeatures -= Object.keys(e.layers._layers).length;
          });

        }

        // TODO;
        // Add geolocate control to the map.

        if (!geoJSONGroup) {
          const data = JSON.parse(JSON.stringify(vm.finalGeojson));
          geoJSONGroup = L.geoJSON(data, {
            onEachFeature: (feature, layer) => {
              // tag on layer for easy removal/deletion
              layer.tag = feature.properties.title;
              // input for feature title
              var input = L.DomUtil.create("input", "my-input");
              input.value = (feature.properties.title) ? feature.properties.title : "";
              L.DomEvent.addListener(input, "change", function() {
                feature.properties.title = input.value;
              });
              layer.bindPopup(input);
            }
          })
          .addTo(map);
        } else {
          geoJSONGroup.clearLayers();
          const data = JSON.parse(JSON.stringify(vm.finalGeojson));
          geoJSONGroup.addData(data);
        }

        if (!drawControl) {
          drawControl = new L.Control.Draw({
            edit: {
              featureGroup: geoJSONGroup
            },
            draw: {
              polygon: true,
              polyline: false,
              rectangle: true,
              circle: false,
              marker: false
            }
          });
        }

        // add draw controls if input data is through  the map
        if (this.inputType == "map") {
          map.whenReady(() => {
            window.dispatchEvent(new Event("resize"));
          });
          if (!vm.inputDisabled && !drawControl._map) {
            map.addControl(drawControl);
          }
          if (this.geoJSONGroup) {
            vm.$nextTick(() => {
              map.invalidateSize();
              map.fitBounds(geoJSONGroup.getBounds());
            });
          }
          if (this.siblingGeojson) {
            this.config.show.siblingGeojson = true;
            this.showSiblingGeojson();
          }
          if (this.parentBBox) {
            this.config.show.parentBBox = true;
            this.showParentBBox();
          }
        }
      } catch (err) {
        vm.$emit("error", err);
      }
    }
  },
  computed: {
    canAddFeature: function() {
      return (
        !this.errors.turf && 
        !this.inputDisabled &&
        this.geojson.features.length < this.config.maxFeatures 
      );
    },
    canReset: function() {
      return this.errors.turf || !this.inputDisabled;
    },
    canEdit: function() {
      return this.errors.turf || !this.inputDisabled;
    },
    canValidate: function() {
      return this.inputDisabled;
    }
  },
  created: function() {
    if (this.minFeatures) this.config.minFeatures = this.minFeatures;
    if (this.maxFeatures) this.config.maxFeatures = this.maxFeatures;
    if (this.config.minFeatures > this.config.maxFeatures) {
      this.$emit("error", "Min features cannot be greater than Max features");
    }

    this.wDataInputType = (!this.dataInputType) ? this.defaults.dataInputType : this.dataInputType;
    if (this.wDataInputType == "manual" || this.wDataInputType == "both") {
      this.inputType = "manual";
    } else if (this.wDataInputType == "map") {
      this.inputType = "map";
      this.initializeMap();
    }
  },
  mounted: function() {
    var vm = this;

    vm.resetMapData();
    vm.initializeMap();

    // check if turf is available
    try {
      turf.point([0,0]);
      this.errors.turf = false;
      this.inputDisabled = false;
    } catch (err) {
      this.errors.turf = true;
      this.inputDisabled = true;
      vm.$emit("error", err);
    }
  },
  beforeRouteLeave: function(to, from, next) {
    this.inputType = "map";
    this.resetMapData();
    this.inputType = "manual";
    this.resetMapData();
    next();
  }
};
</script>

<style>
  #map {
    width: 100% !important;
    min-height: 500px;
  }

  .nopadding {
      padding: 0px;
  }

  .m-r-0 {
      margin-right: 0px;
  }

  .m-r-5 {
      margin-right: 5px;
  }

  .m-r-10 {
      margin-right: 10px;
  }

  .m-r-20 {
      margin-right: 20px;
  }

  .m-l-0 {
      margin-left: 0px;
  }

  .m-l-5 {
      margin-left: 5px;
  }

  .m-l-10 {
      margin-left: 10px;
  }

  .m-l-20 {
      margin-left: 20px;
  }

  .m-t-0 {
      margin-top: 0px;
  }

  .m-t-10 {
      margin-top: 10px;
  }

  .m-t-20 {
      margin-top: 20px;
  }

  .m-b-0 {
      margin-bottom: 0px;
  }

  .m-b-10 {
      margin-bottom: 10px;
  }

  .m-b-20 {
      margin-bottom: 20px;
  }


  .container {
    display: block;

  }

  .form-group {
    display: block;
  }

  button {
    padding: 10px;
    border: 0px;
  }

  .middle {
    margin: 0px auto;
  }

  .right {
    float: right;
  }

  .container {
    display: flex;
    flex-direction: column;
    border: 1px solid lightgray;
  }

  #top-widget-controls {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    background-color: lightgray;
  }

  #top-widget-controls div {
    display: inline;
    padding: 10px;
  }

  #top-widget-controls .form-group h5 {
    line-height: 2em;
  }

  #top-widget-controls .form-group label {
    line-height: 2em;
  }

  #feature-container {
    padding: 10px;
  }

  .feature {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    margin: 10px;
  }

  .feature-title {
    flex: 2 0 200px;
    display: flex;
    flex-direction: row;
  }

  .feature-coordinates {
    flex: 7 0 400px;
    display: flex;
    flex-direction: row;
  }

  .feature-actions {
    flex: 1 0 50px;
  }

  .feature-title label,
  .feature-coordinates label {
    flex: 1 0 50px;
  }

  .feature-title input,
  .feature-coordinates input {
    flex: 3 0 150px;
  }

  .config {
    position: relative;
    display: inline-block;
  }

  .config-title {
    margin: 10px 0 0 0;
  }

  .config-group {
    padding: 5px !important;
    text-align: left;
    width: 100%;
    display: block !important;
  }

  .config-content {
    /*display: none;*/
    display: block;
    position: absolute;
    right: 10px;
    background-color: #f9f9f9;
    min-width: 250px;
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    padding: 12px 16px;
    z-index: 1;
  }

</style>