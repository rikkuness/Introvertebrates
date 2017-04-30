routes.$inject = ['$stateProvider']

export default function routes($stateProvider) {
  $stateProvider
    .state('home', {
      url: '/',
      template: require('./home.pug')()
    })
    .state('about', {
      url: '/about',
      template: require('./about.pug')()
    })
}
