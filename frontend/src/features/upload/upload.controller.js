export default class UploadController {
  constructor($http, $scope) {
    $scope.loading = true
    this._http = $http

    console.log($scope)
    var self = $scope
    var button_ng = angular.element(document).ready(function () {

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
          console.log("heleo")
          console.log(self)
          $scope.$apply(function () {
            self.lat = position.coords.latitude
            self.long = position.coords.longitude
            self.loading = false

          })

        }, function (err) {
          console.log("Geolocation failed")
          $scope.$apply(function () {
            self.loading = false
            //$scope.loadingError = "Failed to get device geolocation"

          })
        })
      } else {
        $scope.$apply(function () {
          self.loading = false

        })
        console.log("Geolocation is not supported by this browser.")

      }
    })

    $scope.change = function (evt) {
      //bring selected photo in
      //get files captured through input
      var fileInput = evt.target.files;

      if (fileInput.length > 0) {
        //get the file
      }

      //window url 
      var windowURL = $scope.window.URL || $scope.window.webkitURL;

      //picture url
      var picURL = windowURL.createObjectURL(fileInput[0]);

      //get canvas
      var photoCanvas = angular.element("capturedPhoto");

      var ctx = photoCanvas.getContext("2d");

      //create image
      var photo = new Image();

      photo.onload = function () {
        //draw photo into canvas when ready
        ctx.drawImage(photo, 0, 0, 500, 400);
      };

      //load photo into canvas
      photo.src = picURL;
      //release object url
      windowURL.revokeObjectURL(picURL);


    }

  }
}
