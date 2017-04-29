var GeoTIFF = require("geotiff");
var fs = require("fs");

 var path = "/Users/steven/Downloads/LC_hd_global_2012.tif";

fs.readFile(path, function(err, data) {
  if (err) throw err;
  dataArray = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);
  var tiff = GeoTIFF.parse(dataArray);

console.log(tiff.getImageCount());
var image = tiff.getImage();
console.log(image.getWidth(), image.getHeight(), image.getSamplesPerPixel());


});
