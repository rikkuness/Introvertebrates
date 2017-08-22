import swallow_data from './swallow_data.json'
import elasticsearch from 'elasticsearch'
import randomcolor from 'randomcolor'

export default class MapController {
  constructor(leafletData, $scope, leafletMapEvents) {
    this.esclient = null
    this.markers = {}
    this.paths = {}



    let me = this

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


angular.element(document).ready(function (me) {

      if (navigator.geolocation) {

        navigator.geolocation.getCurrentPosition(function (position) {

        self.center = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              zoom: 8
                  }

        leafletData.getMap('map').then(map => {
              map.panTo([self.center.lat, self.center.lng])
            })

 self.markers["HomeMarker"] = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          message: 'This is where you are currently, based on your geolocation',
          icon: {
            type: 'extraMarker',
            icon: 'fa-home',
            markerColor: 'red',
            prefix: 'fa',
            shape: 'circle'
          }
        }
          //   self.L.markers(center,{draggable:false,title:"You Are Here",icon:self.homeIcon}).addTo(self).bindPopup("You are within some meters from this point");
  
  

        }, function (err) {
            self.center = {
      lat: -21.053744,
      lng: -58.359375,
      zoom: 4
    }
          console.log("Geolocation failed")
         
          
        })

      } else {
        self.center = {
      lat: -21.053744,
      lng: -58.359375,
      zoom: 4
    }
        console.log("Geolocation is not supported by this browser.")

      }
    })
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


    // Rough European Swallow data
    this.paths.swallow1 = {
      color: '#777',
      weight: 3,
      latlngs: [
        {lat:52.635563, lng:-1.582031},
        {lat:47.627455, lng:-0.175781},
        {lat:40.604569, lng:-1.845703},
        {lat:32.350963, lng:-6.767578},
        {lat:25.511461, lng:-12.788086},
      ]
    }

    // Rough European Swallow data
    this.paths.swallow2 = {
      color: '#777',
      weight: 3,
      latlngs: [
        {lat:52.635563, lng:-1.582031},
        {lat:47.419725, lng:2.856445},
        {lat:40.470980, lng:-0.703125},
        {lat:18.599395, lng:10.019531},
        {lat:2.235151, lng:17.226563},
        {lat:-27.103144, lng:20.742188},
      ]
    }

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
        "size": 50,
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
      50000 // TODO: Base this on the current zoom
    ).then(r => {
      // Remove all current markers
      mapController.markers = {}

      // Place each marker on the map
      r.hits.hits.map(o => {
        let tweet = o._source
        let image = tweet.image ?
          '<a href="'+tweet.image+'"><img src="'+tweet.image+'"></a>' : ''

        mapController.markers[o._id] = {
          lat: tweet.coordinates.coordinates[1],
          lng: tweet.coordinates.coordinates[0],
          message: image+'<b>'+tweet.user.name+'</b><p>'+tweet.text+'</p>',
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
      try {
        if (!this.paths.hasOwnProperty(a['tag-local-identifier'])) {
          this.paths[a['tag-local-identifier']] = {
            color: randomcolor(),
            weight: 2,
            latlngs: [],
            label: '<h5>'+a['study-name']+'</h5><i>'+a['individual-taxon-canonical-name']+'</i>'
          }
        }
        this.paths[a['tag-local-identifier']].latlngs.push(a)
      } catch (err) {}
    })
  }
}
