var GeoTIFF = require("geotiff");
var fs = require("fs");
var gdal = require("gdal");

 var path = "/Users/steven/Downloads/LC_hd_global_2012.tif";



 //var mappingMap = fillMap();


var mapping = fillMap();

var promise = readArray();
promise.then(function (array) {
  //console.log(array[]);
  console.log("-----initializing TIFF geo image-------");
  var dataset = gdal.open(path);
  var f = 0;
  // console.log("number of bands: " + dataset.bands.count());
  // console.log("width: " + dataset.rasterSize.x);
  // console.log("height: " + dataset.rasterSize.y);
  // console.log("geotransform: " + dataset.geoTransform);
  // console.log("srs: " + (dataset.srs ? dataset.srs.toWKT() : 'null'));
for (i = 1; i <= 296; ++i) {
++f;
  for(v = 1; v <= 720; v ++) {
    ++f;
  var Xpixel = v;
  var Yline = i;

  width = 720;
  var GT = dataset.geoTransform;
  var Xgeo = GT[0] + Xpixel*GT[1] + Yline*GT[2];
  var Ygeo = GT[3] + Xpixel*GT[4] + Yline*GT[5];


var a = null;
  a = Yline - 1;
firstNumb = a * (720);

var numberfinal = firstNumb + Xpixel;
console.log("the line is " + Yline);
console.log("the xpixel is " + Xpixel);
console.log("the pixel is " + numberfinal);
var numb = array[numberfinal -1];
  console.log("the number is " + numb);
    console.log("the habitat is " + mapping[numb]);
  console.log("the x coord is :" +Xgeo);
  console.log("the y coord is :" + Ygeo);
  console.log("----end------");
}
}
console.log(f);
});


// var dataset = gdal.open(path);
// console.log("number of bands: " + dataset.bands.count());
// console.log("width: " + dataset.rasterSize.x);
// console.log("height: " + dataset.rasterSize.y);
// console.log("geotransform: " + dataset.geoTransform);
// console.log("srs: " + (dataset.srs ? dataset.srs.toWKT() : 'null'));
//
// var Xpixel = 720;
// var Yline = 296;
//
//
// var GT = dataset.geoTransform;
// var Xgeo = GT[0] + Xpixel*GT[1] + Yline*GT[2];
// var Ygeo = GT[3] + Xpixel*GT[4] + Yline*GT[5];
//
// console.log(Xgeo);
// console.log(Ygeo);
// console.log(GT);
//
//
//
// function returntype(number) {
//
//
// }
//
function fillMap() {
  var map = {};
  map[0]= "water";
  map[1]= "evergreen needleleaf forest";
  map[2]= "evergreen broadleaf forest";
  map[3]= "deciduous needleleaf forest";
  map[4]= "deciduous broadleaf forest";
  map[5]= "mixed forest";
  map[6]= "closed shrublands";
  map[7]= "open shrublands";
  map[8]= "woody savannas";
  map[9]= "savannas";
  map[10]= "grasslands";
  map[11]= "permanent wetlands";
  map[12]= "croplands";
  map[13]= "urban and built-up";
  map[14]= "Cropland/Natural vegetation mosaic";
  map[15]= "Snow and ice";
  map[16]= "Barren or sparsely vegetated";
  map[254]= "Unclassified";
  map[255]= "Fill Value";

  return map;

}



function readArray() {
  return new Promise(function(resolve, reject) { fs.readFile(path, function(err, data) {
  if (err) throw err;
  dataArray = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);
  var tiff = GeoTIFF.parse(dataArray);

//console.log(tiff.getImageCount());
var image = tiff.getImage();
 //var rasters = image.readRasters();

// var rasterWindow = [0, 25, 4, 26]; // left, top, right, bottom
//var samples = [0];
//var rasters = image.readRasters({window: rasterWindow, samples: samples});
//var rows = 296;
//var columns = 720;
//var mappingMap = (fillMap());
//var rowstart = -180;
//var columnstart = -640;
var array = image.readRasters({interleave: true});
resolve(array);

});

});

}
