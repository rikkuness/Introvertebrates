export default class UploadController {
  constructor($http, $scope) {
    $scope.loading = true
    this._http = $http

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
            self.loading=false
            
          })

        }, function(err) {
          console.log("Geolocation failed")
            $scope.$apply(function(){
          self.loading=false
          //$scope.loadingError = "Failed to get device geolocation"

            })
        })
      } else {
         $scope.$apply(function(){
          self.loading=false

            })
        console.log("Geolocation is not supported by this browser.")

      }
    })
  
  }
}
