routes.$inject = ['$stateProvider']

export default function routes($stateProvider) {
  $stateProvider
    .state('upload', {
      url: '/upload',
      template: require('./upload.pug')(),
      controller: 'UploadController',
      controllerAs: 'upload'
    })
}
