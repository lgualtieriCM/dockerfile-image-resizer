'use strict';

var express, app, ir, env, Img, streams;

express = require('express');
app     = express();
ir      = require('image-resizer-wjordan');
env     = ir.env;
Img     = ir.img;
streams = ir.streams;

app.directory = __dirname;
ir.expressConfig(app);

app.get('/favicon.ico', function (request, response) {
  response.sendStatus(404);
});

/**
 Return the modifiers map as a documentation endpoint
 */
app.get('/modifiers.json', function(request, response){
  response.json(ir.modifiers);
});


/*
 Return an image modified to the requested parameters
 - request format:
 /:modifers/path/to/image.format:metadata
 eg: https://my.cdn.com/s50/sample/test.png
 */
app.get('/*?', function(request, response){
  var image = new Img(request);

  image.getFile()
    .pipe(new streams.identify())
    .pipe(new streams.resize())
    .pipe(new streams.filter())
    .pipe(new streams.optimize())
    .pipe(streams.response(request, response));
});


/**
 Start the app on the listed port
 */
app.listen(app.get('port'));
