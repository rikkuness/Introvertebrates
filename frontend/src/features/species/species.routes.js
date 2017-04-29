routes.$inject = ['$stateProvider']

export default function routes($stateProvider) {
  $stateProvider
    .state('species', {
      url: '/species',
      template: require('./species.pug')()
    })
}
