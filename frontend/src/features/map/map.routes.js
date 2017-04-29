routes.$inject = ['$stateProvider']

export default function routes($stateProvider) {
  $stateProvider
    .state('map', {
      url: '/map',
      template: require('./map.pug')(),
      controller: 'MapController',
      controllerAs: 'map'
    })
}
