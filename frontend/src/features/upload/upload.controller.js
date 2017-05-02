export default class UploadController {
  constructor($http, $scope) {
    this._http = $http
    $scope.lat = "lat"
    $scope.long = "long"

    console.log($scope)
    var self = $scope
    var button_ng = angular.element(document).ready(function(){

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position){
          console.log("heleo")
          console.log(self)
          $scope.$apply(function(){
            self.lat = position.coords.latitude
            self.long = position.coords.longitude
          })

        })
      } else {
        console.log("Geolocation is not supported by this browser.")
      }
    })
  
  }
}
