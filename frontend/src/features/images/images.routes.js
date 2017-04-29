routes.$inject = ['$stateProvider']

export default function routes($stateProvider) {
  $stateProvider
    .state('images', {
      url: '/images',
      template: require('./images.pug')()
    })
}
