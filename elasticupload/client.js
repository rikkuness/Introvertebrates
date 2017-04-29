var elasticsearch=require('elasticsearch');

var client = new elasticsearch.Client( {
  hosts: [
    'https://user:spaceapps2017@e392e7556915b57b7106b1efaf1b4cf3.eu-west-1.aws.found.io:9243/'
  ]
});
module.exports = client;
