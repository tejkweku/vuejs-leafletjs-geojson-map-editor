
const defaults = {
  geojson: {
    type: "FeatureCollection",
    features: []
  },
  dataInputType: "both"
};

const config = {
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
};

function testHasValidFeatures(inputType, dataGeojson, config, vmRefs) {
  var finalGeojson = null;

  return new Promise((resolve, reject) => {
    switch (inputType) {
      case "manual":
        finalGeojson = JSON.parse(JSON.stringify(defaults.geojson));
        dataGeojson.features.forEach((feature, fIdx) => {
          var coordElement = vmRefs["featureCoordinates" + fIdx][0];
          coordElement.classList.remove("is-invalid");

          try {
            if (!feature.properties.title) {
              throw new Error("Feature must have a title");
            }
            var t1 = [];
            t1.push(JSON.parse(feature.geometry.coordinates));
            let poly = turf.polygon(t1, {
              title: feature.properties.title
            });
            finalGeojson.features.push(poly);
          } catch (err) {
            finalGeojson = JSON.parse(JSON.stringify(defaults.geojson));
            coordElement.classList.add("is-invalid");
            coordElement.focus();

            reject({ test: "THVF", data: err.message, success: false });
          }
        });
        break;
      case "map":
        finalGeojson = dataGeojson;
        if (finalGeojson.features.length < 1) {
          reject({
            test: "THVF",
            data: "Use the drawing tools to draw at least one polygon"
          });
        } else if (finalGeojson.features.length > config.maxFeatures) {
          reject({
            test: "THVF",
            data:
              "Number of features exceeds limit for selected Geofence Type"
          });
        } else {
          finalGeojson.features.forEach((feature, fIdx) => {
            if (!feature.properties.title) {
              reject({ test: "THVF", data: "Feature must have a title" });
            }
          });
        }
        break;
      default:
        break;
    }

    resolve({ test: "THVF", success: true, geojson: finalGeojson });
  });
}

function testFeaturesIntersectOneAnother(features) {
  return new Promise((resolve, reject) => {
    var intersects = [];
    var intersectObj = null;
    let len1 = features.length;

    for (let pFIdx = 0; pFIdx < len1; pFIdx++) {
      var primaryFeature = features[pFIdx],
        primaryFeatureTitle = features[pFIdx].properties.title
          ? features[pFIdx].properties.title
          : (pFIdx + 1);
      for (let sFIdx = pFIdx + 1; sFIdx < len1; sFIdx++) {
        var secondaryFeature = features[sFIdx],
          secondaryFeatureTitle = features[sFIdx].properties.title
            ? features[sFIdx].properties.title
            : (sFIdx + 1);

        // test for intersecting features
        intersectObj = turf.intersect(primaryFeature, secondaryFeature);

        if (
            intersectObj && 
            ["Polygon", "MultiPolygon"].indexOf(intersectObj.geometry.type) > -1) 
        {
          intersects.push({
            titles: [primaryFeatureTitle, secondaryFeatureTitle],
            indexes: [pFIdx, sFIdx]
          });
        } else {
          continue;
        }
      }
    }

    if (intersects.length == 0) {
      resolve({ test: "TFIOA", success: true });
    } else {
      reject({ test: "TFIOA", data: intersects, success: false });
    }
  });
}

function testFeaturesIntersectSiblingGeojson(features, siblingGeojson) {
  return new Promise((resolve, reject) => {
    var intersects = [];
    var intersectObj = null;
    const siblingFeatures = siblingGeojson.features;

    for (let siblingFIdx = 0; siblingFIdx < siblingFeatures.length; siblingFIdx++) {
      var siblingFeature = siblingFeatures[siblingFIdx],
        siblingFeatureTitle = siblingFeatures[siblingFIdx].properties.title
          ? siblingFeatures[siblingFIdx].properties.title
          : (siblingFIdx + 1);
          
      for (let newFIdx = 0; newFIdx < features.length; newFIdx++) {
        var newFeature = features[newFIdx],
          newFeatureTitle = features[newFIdx].properties.title
            ? features[newFIdx].properties.title
            : (newFIdx + 1);

        // test for intersecting features
        intersectObj = turf.intersect(siblingFeature, newFeature);

        if (
            intersectObj && 
            ["Polygon", "MultiPolygon"].indexOf(intersectObj.geometry.type) > -1) 
        {
          intersects.push({
            titles: [siblingFeatureTitle, newFeatureTitle],
            indexes: [siblingFIdx, newFIdx]
          });
        } else {
          continue;
        }
      }
    }

    if (intersects.length == 0) {
      resolve({ test: "TFISG", success: true });
    } else {
      reject({ test: "TFISG", data: intersects, success: false });
    }
  });
}

function testBoundingBoxContainsFeatures(features, parentBBox = null) {
  return new Promise((resolve, reject) => {
    var intersects = [],
      intersectObj = null,
      fpCount = 0;

    if (parentBBox != null) {
      const parentFeatures = parentBBox.features;
      for (let parentFIdx = 0; parentFIdx < parentFeatures.length; parentFIdx++) {
        var parentFeature = parentFeatures[parentFIdx],
          parentFeatureTitle = parentFeatures[parentFIdx].properties.title
            ? parentFeatures[parentFIdx].properties.title
            : (parentFIdx + 1);
        for (let pFIdx = 0; pFIdx < features.length; pFIdx++) {
          const pFeature = features[pFIdx];
          const pFeatureTitle = pFeature.properties.title;
          console.log("pFeature: ", pFeature);

          // test for intersecting features
          intersectObj = turf.intersect(parentFeature, pFeature);
          if (
              intersectObj && 
              intersectObj.geometry.coordinates[0].length != pFeature.geometry.coordinates[0].length
             )
          {
            intersects.push({
              titles: [parentFeatureTitle, pFeatureTitle],
              indexes: [parentFIdx, pFIdx]
            });
          } else {
            continue;
          }
        }
      }
    }

    if (intersects.length == 0) {
      resolve({ test: "TBBCF", success: true });
    } else {
      reject({ test: "TBBCF", data: intersects, success: false });
    }
  });
}

export default {
  methods: {
    
    testHasValidFeatures: testHasValidFeatures,
    testFeaturesIntersectOneAnother: testFeaturesIntersectOneAnother,
    testFeaturesIntersectSiblingGeojson: testFeaturesIntersectSiblingGeojson,
    testBoundingBoxContainsFeatures: testBoundingBoxContainsFeatures

  }
}