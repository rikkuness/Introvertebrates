import swallow_data from './swallow_data.json'
import elasticsearch from 'elasticsearch'
import randomcolor from 'randomcolor'

export default class MapController {
  constructor(leafletData, $scope, leafletMapEvents) {
    this.esclient = null
    this.markers = {}
    this.paths = {}

    this.layers = {
      baselayers: {
        landscape: {
          name: 'Landscape',
          url: 'http://a.tile.thunderforest.com/landscape/{z}/{x}/{y}.png',
          type: 'xyz'
        },
        osm: {
          name: 'Basic',
          url: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png',
          type: 'xyz'
        },
        hills: {
          name: 'Hillshade',
          url: 'http://c.tiles.wmflabs.org/hillshading/{z}/{x}/{y}.png',
          type: 'xyz'
        }
      }
    }

    // Example center for now
    this.center = {
      lat: -21.053744,
      lng: -58.359375,
      zoom: 4
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

    this.loadPaths(swallow_data)

    // Pan to center point to trigger map update
    leafletData.getMap('map').then(map => {
      map.panTo([this.center.lat, this.center.lng])
    })
  }

  connectEs() {
    this.esclient = new elasticsearch.Client({
      host: 'https://e392e7556915b57b7106b1efaf1b4cf3.eu-west-1.aws.found.io:9243/',
      //log: 'trace',
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
        let tweet = o._source
        mapController.markers[o._id] = {
          lat: tweet.coordinates.coordinates[1],
          lng: tweet.coordinates.coordinates[0],
          message: '<b>'+tweet.user.name+'</b><p>'+tweet.text+'</p>',
          icon: {
            type: 'extraMarker',
            icon: 'fa-twitter',
            markerColor: 'cyan',
            prefix: 'fa',
            shape: 'circle'
          }
        }
      })
    })
  }

  loadPaths(data){
    data.forEach(a => {
      if (!this.paths.hasOwnProperty(a['tag-local-identifier'])) {
        this.paths[a['tag-local-identifier']] = {
          color: randomcolor(),
          weight: 2,
          latlngs: [],
          label: '<h5>'+a['study-name']+'</h5><i>'+a['individual-taxon-canonical-name']+'</i>'
        }
      }
      this.paths[a['tag-local-identifier']].latlngs.push(a)
    })
  }
}
