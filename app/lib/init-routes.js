'use strict';

var traceur = require('traceur');
var dbg = traceur.require(__dirname + '/route-debugger.js');
var initialized = false;

module.exports = (req, res, next)=>{
  if(!initialized){
    initialized = true;
    load(req.app, next);
  }else{
    next();
  }
};

function load(app, fn){
  var home = traceur.require(__dirname + '/../routes/home.js');
  var artists = traceur.require(__dirname + '/../routes/artists.js');
  var albums = traceur.require(__dirname + '/../routes/albums.js');
  var songs = traceur.require(__dirname + '/../routes/songs.js');


  app.get('/', dbg, home.index);
  app.get('/about', dbg, home.index);
  app.get('/artists', dbg, artists.index);
  app.post('/artists', dbg, artists.create);
  app.get('/artists/:id', dbg, artists.show);
  app.get('/albums', dbg, albums.index);
  app.post('/albums', dbg, albums.create);
  app.get('/albums/:id', dbg, albums.show);
  app.delete('/albums/:id', albums.destroy);
  app.get('/songs', dbg, songs.index);
  app.post('/songs', dbg, songs.create);
  app.delete('/songs/:id', songs.destroy);
  app.get('/songs/filter/:genre', dbg, songs.filter);



  console.log('Routes Loaded');
  fn();
}
