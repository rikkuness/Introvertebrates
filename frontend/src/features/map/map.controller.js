import swallow_data from './swallow_data.json'
import elasticsearch from 'elasticsearch'

export default class MapController {
  constructor(leafletData, $scope, leafletMapEvents) {
    this.esclient = null
    this.markers = {}
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

    // Connect to Elasticsearch
    this.connectEs()

    // Event listeners
    let self = this

    $scope.$on('leafletDirectiveMap.map.dragend', (e) => {
      console.log("dragend")
      this.populateTweetMarkers(self)
    })

    // ALL THE HACKINESS
    // Initial call to populate markers
    this.populateTweetMarkers(self)

    // Pan to center point to trigger map update
    leafletData.getMap('map').then(map => {
      map.panTo([51, 0])
    })
  }

  connectEs() {
    this.esclient = new elasticsearch.Client({
      host: 'https://e392e7556915b57b7106b1efaf1b4cf3.eu-west-1.aws.found.io:9243/',
      log: 'trace',
      httpAuth: 'readonly:spaceappschallenge'
    })
  }

  findPointsAround(x, y, radius) {
    return this.esclient.search({
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

  populateTweetMarkers(mapController) {
    this.findPointsAround(
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
    })
  }
}
