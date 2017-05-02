export default class UploadController {
  constructor($http) {
    this._http = $http
    this.lat = 0
    this.long = 0

    var button_ng = angular.element(document).ready(function(){
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(this.showPosition);
      } else {
        console.log("Geolocation is not supported by this browser.")
      }
    }.bind(this))

    this.showPosition = function(position){
      this.lat = position.coords.latitude
      this.long = position.coords.longitude
    }
  }
}
