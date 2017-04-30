routes.$inject = ['$stateProvider']

export default function routes($stateProvider) {
  $stateProvider
    .state('species', {
      url: '/species',
      template: require('./species-home.pug')()
    })
    .state('speciesdetail', {
      url: '/species/:name',
      template: require('./species.pug')(),
      controller: 'SpeciesController',
      controllerAs: 'species'
    })
}
