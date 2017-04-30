import elasticsearch from 'elasticsearch'

// Connect to Elasticsearch
const esclient = new elasticsearch.Client({
  host: 'https://e392e7556915b57b7106b1efaf1b4cf3.eu-west-1.aws.found.io:9243/',
  log: 'trace',
  httpAuth: 'readonly:spaceappschallenge'
});

function findPointsAround(x, y, radius) {
  return esclient.search({
    index: 'twitter',
    type: 'tweet',
    body: {
      "query": {
        "bool": {
          "must": {
            "match_all": {}
          },
          "filter": {
            "geo_distance": {
              "distance": radius + "km",
              "coordinates.coordinates": {
                "lat": x,
                "lon": y
              }
            }
          }
        }
      }
    }
  })
}

function populateTweetMarkers(mapController) {
  findPointsAround(
          mapController.center.lat,
          mapController.center.lng,
          500 // TODO: Base this on the current zoom
        ).then((r) => {
          // Remove all current markers
          mapController.markers = {}

          // Place each marker on the map
          r.hits.hits.map((o) => {
            mapController.markers[o._id] = {
              lat: o._source.coordinates.coordinates[1],
              lng: o._source.coordinates.coordinates[0],
              message: o._source.text
            }
          })

          // Fix marker src (This is fine, just leave it. It's fine. Fine... I need a hug)
          setTimeout(() => {
            let els = document.querySelectorAll(".leaflet-marker-icon")
            console.log(els)
            for (var i = 0; i < els.length; i++) {
              els[i].src = els[i].src.split(/("|%22)\)/)[0]
            }
          }, 200)
      })
}

export default class MapController {
  constructor(leafletData, $scope, leafletMapEvents) {

    this.markers = {
      test: {
        lat: 50.727255,
        lng: -3.474373,
        message: 'Hello there'
      }
    }

    this.paths = {}

    this.layers = {
      baselayers: {
        osm: {
          name: 'Basic',
          url: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png',
          type: 'xyz'
        }
      }
    }

    // If the thing needs to be reset
    // leafletData.getMap('map').then(map => {
    //   setTimeout(() => {
    //     L.Util.requestAnimFrame(map.invalidateSize, map, !1, map._container)
    //     L.Util.requestAnimFrame(map.setView, map, !1, map._container)
    //   }, 200)
    // })

    // Example center for now
    this.center = {
      lat: 50.727255,
      lng: -3.474373,
      zoom: 8
    }

    // Register events to listen on
    this.events = {
      map: {
        enable: ['dragend'],
        logic: 'emit'
      }
    }

    // Event listeners
    let self = this

    $scope.$on('leafletDirectiveMap.map.dragend', (e) => {
      console.log("dragend")
      populateTweetMarkers(self)
    })

    // ALL THE HACKINESS
    // Initial call to populate markers
    populateTweetMarkers(self)

    // Pan to center point to trigger map update
    leafletData.getMap('map').then(map => {
      map.panTo([51, 0])
    })
  }
}
