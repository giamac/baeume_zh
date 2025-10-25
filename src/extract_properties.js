// Fetch the GeoJSON data
const geoJsonUrl = "https://www.ogd.stadt-zuerich.ch/wfs/geoportal/Baumkataster?service=WFS&version=1.1.0&request=GetFeature&outputFormat=GeoJSON&typename=baumkataster_baumstandorte";
const geoJsonData = await fetch(geoJsonUrl).then((response) => response.json());

// Extract the properties keys from the first feature
const featureProperties = Object.keys(geoJsonData.features[0].properties);

// Log the list of available feature properties
console.log("Available Feature Properties:", featureProperties);
