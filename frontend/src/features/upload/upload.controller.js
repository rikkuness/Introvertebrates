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

    $scope.change = function (evt) {
      console.log("firing")
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
