export default class UploadController {
  constructor($http, $scope) {
    $scope.loading = true
    this._http = $http
    let scope = $scope

    angular.element(document).ready(function () {

      if (navigator.geolocation) {

        navigator.geolocation.getCurrentPosition(function (position) {
          $scope.$apply(function () {
            scope.lat = position.coords.latitude
            scope.long = position.coords.longitude
            scope.loading = false
          })
        }, function (err) {
          console.log("Geolocation failed")
          $scope.$apply(function () {
            scope.loading = false
            //scope.loadingError = "Failed to get device geolocation"
          })
        })

      } else {
        $scope.$apply(function () {
          scope.loading = false

        })
        console.log("Geolocation is not supported by this browser.")

      }
    })

  }
}
