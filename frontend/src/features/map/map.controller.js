export default class MapController {
  constructor(leafletData) {
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

  }
}
