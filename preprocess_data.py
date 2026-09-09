"""Pre-processing reference for the WebGIS datasets.

The committed files under data/processed/ are already ready to use.
This script documents the important transformation applied to the
administrative dataset: village polygons are dissolved into kecamatan
and transformed to EPSG:4326 for Leaflet.
"""

from pathlib import Path
import geopandas as gpd

# Example after extracting the source shapefile:
# admin = gpd.read_file("administrasi_ar_5k1_th_2023.shp")
#
# kecamatan = (
#     admin[["wadmkc", "wadmkk", "wadmpr", "geometry"]]
#     .dissolve(by="wadmkc", as_index=False)
#     .to_crs(epsg=4326)
# )
#
# kecamatan.to_file(
#     "data/processed/batas_kecamatan.geojson",
#     driver="GeoJSON"
# )

print("Processed GeoJSON files are already available in data/processed/.")
