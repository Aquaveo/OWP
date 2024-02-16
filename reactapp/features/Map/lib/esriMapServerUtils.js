
//get distance by zoom
const getDistanceByZoom = (zoom) => {
    switch (true) {
        case (zoom > 20):
            return 25;
        case (zoom > 17):
            return 125;
        case (zoom > 14):
            return 250;
        case (zoom > 11):
            return 500;
        case (zoom > 8):
            return 1000;
        case (zoom > 5):
            return 2000;
    }

    return 10000;
}

//get corresponding stream service query result
const processStreamServiceQueryResult = (zoom, point, response, mapObject) => {
    console.log(response.features)
    var minStreamOrder = 5;
    var soAttrName = null;
    var fidAttrName = null;
    var nameAttrName = null;

    if (response.features.length === 0) {
        return;
    }

    if (zoom >= 5) minStreamOrder--;
    if (zoom >= 6) minStreamOrder--;
    if (zoom >= 8) minStreamOrder--;
    if (zoom >= 10) minStreamOrder--;


    response.fields.forEach(function (field) {
        if (!fidAttrName && /^(reach_id|station_id|feature_id)$/i.test(field.alias)) {
            fidAttrName = field.name;
        }

        if (!soAttrName && /^(stream_?order)$/i.test(field.alias)) {
            soAttrName = field.name;
        }

        if (!nameAttrName && /^((reach|gnis)?_?name)$/i.test(field.alias)) {
            nameAttrName = field.name;
        }
    });

    var validFeatures = [];

    response.features.forEach(function (feature) {
        if (feature.attributes[soAttrName] < minStreamOrder) {
            return;
        }

        validFeatures.push(feature);
    });

    validFeatures.map(function getDistanceFromPoint(feature) {
        feature.distance = geometryEngine.distance(point, feature.geometry);
        return feature;
    })
    validFeatures.sort(function sortByDistance(a, b) {
        return a.distance - b.distance;
    });

    if (validFeatures.length === 0) {
        return;
    }
    console.log(validFeatures)
    let stationName = isBlank(validFeatures[0].attributes[nameAttrName]) ? 'N/A' : validFeatures[0].attributes[nameAttrName]
    let stationID = validFeatures[0].attributes[fidAttrName]
    console.log("STATION ID", stationID)
    // setCurrentStationID(stationID);
    // setCurrentStation(stationName);
    drawCurrentReachOnClick(validFeatures[0].geometry.paths, mapObject)
}



export { getDistanceByZoom,processStreamServiceQueryResult }