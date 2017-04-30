import swallow_data from './swallow_data.json'
import elasticsearch from 'elasticsearch'

export default class MapController {
  constructor(leafletData, $scope, leafletMapEvents) {

    this.markers = {
      test: {
        lat: 50.727255,
        lng: -3.474373,
        message: 'Hello there'
      }
    }
    console.log(swallow_data)
    this.paths = {swallow : {color: 'red', weight: 3, latlngs: swallow_data}}

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
