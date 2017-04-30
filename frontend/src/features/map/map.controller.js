import swallow_data from './swallow_data.json'

export default class MapController {
  constructor(leafletData) {
    this.markers = {
      test: {
        lat: 51.510,
        lng: -0.06,
        message: 'Hello there'
      }
    }
    console.log(swallow_data)
    this.paths = {swallow : {color: 'red', weight: 3, latlngs: swallow_data}}

    this.layers = {
      baselayers: {
        osm: {
          name: 'OpenStreetMap',
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
      lat: 51.505,
      lng: -0.09,
      zoom: 8
    }

  }
}
