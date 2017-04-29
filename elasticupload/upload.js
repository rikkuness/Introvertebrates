var GeoTIFF = require("geotiff");
var fs = require("fs");
var gdal = require("gdal");

var async = require('async');
var _ = require('underscore');

var client = require('./client.js');
const Queue = async.cargo((dataPoints, callback) => {
  console.log("upladoing:" + dataPoints.length);
  client.bulk({
    body: dataPoints
  }, (err, resp) => {
    console.log(err, resp);
    callback(err,resp);
  })
}, 200);



 var path = "/Users/steven/Downloads/LC_hd_global_2010.tif";

var mapping = fillMap();

var promise = readArray();
promise.then(function (array) {

  console.log("-----initializing TIFF geo image-------");
  var dataset = gdal.open(path);
  var f = 0;


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

var habitat = mapping[numb];
var date = new Date('2015 01 01');
Queue.push({
index: {
_index: 'geotiffdates1',
_type: 'pixels',
_id: numberfinal+Yline+Xpixel+habitat+Xgeo+Ygeo+date,
}});
Queue.push({
  year:new Date('2015 01 01'),
  number:numb,
  yline:Yline,
  xpixel:Xpixel,
  habitat:habitat,
  coordinates: {
    coordinates: [Xgeo, Ygeo]
  }
});



}
}

// var hund = batch.length / 100;
//
// for(i=0; i < hund; i ++) {
//   v = i;
//   var items = batch.slice(i, 100);
//   client.bulk({
//     body: items,
//   }, function (err, resp) {
//     // ...
//   });
//
//
// }
  console.log(f);
  });


  // async.eachSeries(_.range(20000), function (value, done) {
  //     client.create({index: 'tests', type: 'test', body: {something: true, value: value}}, done);
  // });







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
var image = tiff.getImage();

var array = image.readRasters({interleave: true});
resolve(array);

});
});

}
