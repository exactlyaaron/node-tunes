'use strict';

var fs = require('fs');
var multiparty = require('multiparty');
var _ = require('lodash');
var Mongo = require('mongodb');
var rimraf = require('rimraf');

var albums = global.nss.db.collection('albums');
var artists = global.nss.db.collection('artists');
var songs = global.nss.db.collection('songs');


exports.index = (req, res)=>{
  albums.find().toArray((err,albums)=>{
    artists.find().toArray((err, artists)=>{
      albums = albums.map(album => {
        album.artist = _(artists).find(artist =>{
          return artist._id.toString()=== album.artistId.toString();
        });
        return album;
      });
      res.render('albums/index', {artists: artists, albums:albums, title: 'Task List'});
    });
  });
};

exports.create = (req, res)=>{
  var form = new multiparty.Form();

  form.parse(req, (err,fields,files)=>{
    var album = {};
    album.name = fields.name[0];
    album.artistId = Mongo.ObjectID(fields.artistId[0]);
    console.log(album.artistId);
    album.photo = files.albumPhoto[0];

    if (fs.existsSync(`${__dirname}/../static/img/${album.name}`)){
      fs.renameSync(album.photo.path,`${__dirname}/../static/img/${album.name}/${album.photo.originalFilename}`);
    }
    else{
      fs.mkdirSync(`${__dirname}/../static/img/${album.name}`);
      // fs.mkdirSync(`${__dirname}/../static/audios/${album.name}`);
      fs.renameSync(album.photo.path,`${__dirname}/../static/img/${album.name}/${album.photo.originalFilename}`);
    }
    albums.save(album, ()=>res.redirect('/albums'));

  });
};

exports.show = (req, res)=>{
  var _id = Mongo.ObjectID(req.params.id);
  albums.find({_id:_id}).toArray((err, album)=>{
    songs.find().toArray((err, songs)=>{
      songs = _.filter(songs,(song)=>{
        return _id.toString() === song.albumId.toString();
      });
      res.render('albums/show', {songs: songs, ablums: album, title: 'NodeTunes: Artist Profile'});
    });
  });
};

exports.destroy = (req, res)=>{
  var _id = Mongo.ObjectID(req.params.id);

  albums.find({_id:_id}).toArray((err, album)=>{
    var imgPath = `${__dirname}/../static/img/${album[0].name}`;
    var audioPath = `${__dirname}/../static/audios/${album[0]._id}`;
    rimraf.sync(imgPath);
    rimraf.sync(audioPath);
  });
    songs.findAndRemove({_id:_id},()=>res.redirect('/songs'));
};
