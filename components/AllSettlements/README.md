## Települések

A települések JSON adata a következő képpen készült:
a zip-api.tisztaszavazas.hu-ról a következő egyedi lekéréssel:
 ```
 [
    {
        $limit: 3500
    },
    {
        $project: {
            type: "Feature",
            geometry: {
                type: "$boundaries.type",
                coordinates: "$boundaries.coordinates"
            },
            name: "$name"
        }   
    }
]

Az eredményt átalakítva `FeatureCollection`-né.

```
majd a `mapshaper.org` vagy a `mapshaper` node library segítségével egyszerűsítve:

```
npm i -g mapshaper
mapshaper -i response.json -simplify 60% keep-shapes -o format=geojson out.json
```