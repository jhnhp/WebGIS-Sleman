/* global L, DATA_KECAMATAN, DATA_JALAN, DATA_PUSKESMAS */

const map = L.map("map", {
  zoomControl: true,
  minZoom: 9,
  maxZoom: 20
});

const osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 20,
  attribution: "&copy; OpenStreetMap contributors"
});

const imagery = L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  {
    maxZoom: 20,
    attribution: "Tiles &copy; Esri"
  }
);

osm.addTo(map);

const districtColors = [
  "#2f6f9f", "#447a55", "#8a6d3b", "#7a5195", "#a04b4b",
  "#3b7d7b", "#735d3d", "#4c6a92", "#6d7d3c", "#825a79",
  "#5e7184", "#7d6542", "#486f66", "#7665a0", "#926a55",
  "#4f758d", "#687657"
];

function safe(v) {
  if (v === null || v === undefined || v === "") return "-";
  return String(v)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function row(label, value) {
  return `<tr><th>${safe(label)}</th><td>${safe(value)}</td></tr>`;
}

const kecamatanLayer = L.geoJSON(DATA_KECAMATAN, {
  style: feature => {
    const idx = Math.abs(
      [...feature.properties.kecamatan].reduce((sum, c) => sum + c.charCodeAt(0), 0)
    ) % districtColors.length;

    return {
      color: districtColors[idx],
      weight: 2,
      opacity: 0.9,
      fillColor: districtColors[idx],
      fillOpacity: 0.16
    };
  },
  onEachFeature: (feature, layer) => {
    const p = feature.properties;
    layer.bindPopup(`
      <div class="popup-title">Kecamatan ${safe(p.kecamatan)}</div>
      <table class="popup-table">
        ${row("Kabupaten", p.kabupaten)}
        ${row("Provinsi", p.provinsi)}
        ${row("Jumlah desa", p.jumlah_desa)}
        ${row("Luas (km²)", p.luas_km2)}
      </table>
    `);
    layer.bindTooltip(`Kec. ${safe(p.kecamatan)}`, { sticky: true });
  }
}).addTo(map);

const jalanLayer = L.geoJSON(DATA_JALAN, {
  style: {
    color: "#5f6368",
    weight: 2.2,
    opacity: 0.9
  },
  onEachFeature: (feature, layer) => {
    const p = feature.properties;
    layer.bindPopup(`
      <div class="popup-title">${safe(p.nama_jalan || "Jaringan Jalan")}</div>
      <table class="popup-table">
        ${row("ID", p.id)}
        ${row("SRS sumber", p.srs)}
        ${row("Keterangan", p.sumber_keterangan)}
        ${row("Metadata", p.metadata_ref)}
      </table>
    `);
  }
}).addTo(map);

const puskesmasLayer = L.geoJSON(DATA_PUSKESMAS, {
  pointToLayer: (feature, latlng) => L.circleMarker(latlng, {
    radius: 6,
    fillColor: "#b3261e",
    color: "#ffffff",
    weight: 2,
    opacity: 1,
    fillOpacity: 0.95
  }),
  onEachFeature: (feature, layer) => {
    const p = feature.properties;
    const website = p.website
      ? `<a href="${safe(p.website)}" target="_blank" rel="noopener noreferrer">Buka website</a>`
      : "-";

    layer.bindPopup(`
      <div class="popup-title">${safe(p.nama_puskesmas)}</div>
      <table class="popup-table">
        ${row("Kecamatan", p.kecamatan)}
        ${row("Desa", p.desa)}
        ${row("Alamat", p.alamat)}
        ${row("Telepon", p.telepon)}
        ${row("Pengelola", p.pengelola)}
        <tr><th>Website</th><td>${website}</td></tr>
      </table>
    `);
  }
}).addTo(map);

map.fitBounds(kecamatanLayer.getBounds(), { padding: [18, 18] });

L.control.layers(
  {
    "OpenStreetMap": osm,
    "Esri World Imagery": imagery
  },
  {
    "Batas Kecamatan": kecamatanLayer,
    "Jaringan Jalan": jalanLayer,
    "Puskesmas": puskesmasLayer
  },
  {
    collapsed: false,
    position: "topright"
  }
).addTo(map);

L.control.scale({
  metric: true,
  imperial: false,
  position: "bottomright"
}).addTo(map);

const legend = L.control({ position: "bottomleft" });
legend.onAdd = function () {
  const div = L.DomUtil.create("div", "legend");
  div.innerHTML = `
    <strong>Legenda</strong>
    <div class="legend-row">
      <span class="legend-symbol" style="border-color:#2f6f9f;background:rgba(47,111,159,.16)"></span>
      Batas kecamatan
    </div>
    <div class="legend-row">
      <span class="legend-line"></span>
      Jaringan jalan
    </div>
    <div class="legend-row">
      <span class="legend-point"></span>
      Puskesmas
    </div>
  `;
  L.DomEvent.disableClickPropagation(div);
  return div;
};
legend.addTo(map);
