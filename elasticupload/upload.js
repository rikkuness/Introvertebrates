var GeoTIFF = require("geotiff");
var fs = require("fs");
var gdal = require("gdal");

var async = require('async');
var _ = require('underscore');

var ElasticQueue = require('elastic-queue');
var batch = [];
//var Queue = new ElasticQueue();

var client = require('./client.js');
// Queue.host = "https://user:spaceapps2017@e392e7556915b57b7106b1efaf1b4cf3.eu-west-1.aws.found.io:9243/";
// Queue.on('task', function(batch) {
//   return console.log("task", batch);
// });
//
// Queue.on('batchComplete', function(resp) {
//   return console.log("batch complete", resp);
// });
//
// Queue.on('drain', function() {
//   console.log("\n\nQueue is Empty\n\n");
//   return Queue.close();
// });

//var client = require('./client.js');


 var path = "/Users/steven/Downloads/LC_hd_global_2012.tif";

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
clientUpload(f, Yline, Xpixel, habitat, Xgeo, Ygeo);


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


function clientUpload(id, yline, xpixel, habitat, xgeo, ygeo) {
  console.log(id+yline+xpixel+habitat+xgeo+ygeo);


  var elasticDocument;

elasticDocument = {
  index: 'geotiff4',
  type: 'pixels',
  id: id+yline+xpixel+habitat+xgeo+ygeo,
  body: {
    "yline":yline,
    "xpixel":xpixel,
    "habitat":habitat,
    "xgeo":xgeo,
    "ygeo":ygeo
  }
};

//Queue.push(elasticDocument);
batch.push(elasticDocument);

async.eachSeries(_.range(200), function (value, done) {
    client.create(elasticDocument, done);
});
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
