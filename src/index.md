---
toc: false
---

# Bäume in der Stadt Zürich

```js
import * as L from "npm:leaflet";

// Fetch the GeoJSON data
const geoJsonUrl = "https://www.ogd.stadt-zuerich.ch/wfs/geoportal/Baumkataster?service=WFS&version=1.1.0&request=GetFeature&outputFormat=GeoJSON&typename=baumkataster_baumstandorte";
const geoJsonData = await d3.json(geoJsonUrl);

// Extract unique 'baumnamelat' values and sort them alphabetically
const uniqueBaumnamen = [...new Set(geoJsonData.features.map((feature) => feature.properties.baumnamelat))].sort();

// Create a standard dropdown for filtering and render it using html
const dropdown = html`<select></select>`;
uniqueBaumnamen.forEach((baumnamelat) => {
  const option = document.createElement("option");
  option.value = baumnamelat;
  option.textContent = baumnamelat;
  option.title = baumnamelat; // Add a tooltip to show the full text
  dropdown.appendChild(option);
});

// Apply responsive styles to the dropdown
dropdown.style.marginBottom = "10px"; // Add some spacing below the dropdown
dropdown.style.display = "block"; // Ensure it is displayed as a block element
dropdown.style.width = "100%"; // Make the dropdown take full width on smaller screens
dropdown.style.maxWidth = "400px"; // Limit the maximum width on larger screens
dropdown.style.padding = "8px"; // Add padding for better touch interaction
dropdown.style.fontSize = "16px"; // Increase font size for readability
dropdown.style.boxSizing = "border-box"; // Ensure padding doesn't affect width
dropdown.style.border = "1px solid #ccc"; // Add a border for better visibility
dropdown.style.borderRadius = "4px"; // Add rounded corners for aesthetics
dropdown.style.overflow = "hidden"; // Hide overflowing text
dropdown.style.textOverflow = "ellipsis"; // Add ellipsis for overflowing text
dropdown.style.whiteSpace = "nowrap"; // Prevent text from wrapping
display(dropdown); // Render the dropdown
```

```js
// Create and display the map container
const div = display(document.createElement("div"));
div.style = "height: 600px;";

const map = L.map(div)
  .setView([47.3769, 8.5417], 13);

L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}", {
  attribution: '&copy; <a href="https://www.esri.com/">Esri</a>',
}).addTo(map);

// Define a smaller custom icon
const smallIcon = L.icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png", // Default Leaflet marker icon
  iconSize: [16, 26], // Set the size of the icon (width, height)
  iconAnchor: [8, 26], // Anchor the icon (center bottom)
  popupAnchor: [0, -26], // Position the popup relative to the icon
});

// Layer to hold markers
let markersLayer = L.layerGroup().addTo(map);

// Function to update the map based on the dropdown selection
function updateMap(selectedBaumnamelat) {
  // Filter features based on the selected 'baumnamelat'
  const filteredFeatures = geoJsonData.features.filter(
    (feature) => feature.properties.baumnamelat === selectedBaumnamelat
  );

  // Clear existing markers
  markersLayer.clearLayers();

  // Add markers for the filtered features
  filteredFeatures.forEach((feature) => {
    const [lon, lat] = feature.geometry.coordinates;
    const tooltipContent = `
      <strong>Baumname (Lat.):</strong> ${feature.properties.baumnamelat}<br>
      <strong>Baumname (Deu.):</strong> ${feature.properties.baumnamedeu}<br>
      <strong>Pflanzjahr:</strong> ${feature.properties.pflanzjahr}<br>
    `;
    const marker = L.marker([lat, lon], { icon: smallIcon }).bindTooltip(tooltipContent);
    markersLayer.addLayer(marker);
  });
}

// Initialize the map with the default selection
updateMap(dropdown.value);

// Update the map whenever the dropdown value changes
dropdown.addEventListener("change", () => updateMap(dropdown.value));
```
