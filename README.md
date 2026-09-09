# WebGIS Infrastruktur dan Fasilitas Publik Kabupaten Sleman

WebGIS sederhana/statis berbasis **Leaflet** yang menampilkan tiga jenis
geometri yang dipersyaratkan dalam penugasan:

1. **Polygon** — batas administrasi kecamatan.
2. **Line** — jaringan jalan.
3. **Point / POI fasilitas umum** — lokasi puskesmas.

Semua dataset pendukung disertakan di repository sehingga penguji tidak
bergantung pada ketersediaan layanan OGC eksternal ketika membuka source code.

## Screenshot

![Screenshot WebGIS](assets/webgis-screenshot.png)

## Fitur

- Layer panel untuk mengaktifkan/menonaktifkan layer.
- Popup atribut ketika fitur diklik.
- Dua pilihan basemap:
  - OpenStreetMap
  - Esri World Imagery
- Legenda.
- Scale bar.
- Tampilan responsif.
- Data tematik dibaca dari file lokal.

## Cara membuka

### Cara termudah

Buka langsung:

```text
index.html
```

melalui browser. Data GeoJSON sudah dibungkus sebagai JavaScript lokal,
sehingga layer tematik dapat dimuat walaupun halaman dibuka dengan protokol
`file://`.

> Koneksi internet diperlukan untuk memuat library Leaflet dari CDN dan
> basemap OpenStreetMap atau Esri World Imagery. Ketiga data tematik tersimpan
> lokal di repository.

### Alternatif: local web server

```bash
python -m http.server 8000
```

Lalu buka:

```text
http://localhost:8000
```

## Struktur repository

```text
webgis-sleman-static/
├── index.html
├── README.md
├── assets/
│   └── webgis-screenshot.png
├── css/
│   └── style.css
├── js/
│   ├── data_kecamatan.js
│   ├── data_jalan.js
│   ├── data_puskesmas.js
│   └── main.js
└── data/
    ├── processed/
    │   ├── batas_kecamatan.geojson
    │   ├── jaringan_jalan.geojson
    │   └── puskesmas.geojson
    └── source/
        ├── BATAS ADMINISTRASI KABUPATEN SLEMAN TAHUN 2023.zip
        ├── JARINGAN JALAN KABUPATEN SLEMAN.zip
        └── Puskesmas Wilayah Sleman.zip
```

## Pengolahan data

Dataset sumber berada pada **EPSG:9489 (SRGI 2013)**.

Sebelum digunakan pada Leaflet, seluruh layer ditransformasikan menjadi
**WGS 84 / EPSG:4326**.

Dataset administrasi sumber terdiri atas **86 polygon desa**.
Untuk memenuhi ketentuan layer batas administrasi **kecamatan**, polygon desa
didissolve berdasarkan field `wadmkc`, menghasilkan **17 kecamatan**.

Dataset akhir:

| Layer | Geometry | Feature |
|---|---|---:|
| Batas Kecamatan | Polygon/MultiPolygon | 17 |
| Jaringan Jalan | LineString/MultiLineString | 347 |
| Puskesmas | Point | 25 |

## Sumber data

Data bersumber dari **Geoportal Kabupaten Sleman** dan disertakan dalam folder
`data/source/` untuk keperluan reproduksibilitas.

## Teknologi

- HTML5
- CSS3
- JavaScript
- Leaflet
- GeoJSON
- GeoPandas (pra-pemrosesan data)

## Catatan

File pada `data/processed/` adalah GeoJSON standar hasil pra-pemrosesan.
File pada `js/data_*.js` berisi data yang sama dalam bentuk variabel JavaScript
agar aplikasi dapat dibuka langsung tanpa membutuhkan `fetch()` ke file lokal.
