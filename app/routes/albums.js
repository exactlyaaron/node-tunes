'use strict';

var fs = require('fs');
var albums = global.nss.db.collection('albums');
var artists = global.nss.db.collection('artists');
var multiparty = require('multiparty');
var _ = require('lodash');
var Mongo = require('mongodb');

exports.index = (req, res)=>{
  albums.find().toArray((e,albums)=>{
    artists.find().toArray((e,artists)=>{

      albums = albums.map(album => {
        album.artist = _(artists).find(x =>x._id.toString() === album.artistId.toString());
        return album;
      });

      res.render('albums/index', {artists: artists, albums: albums, title: 'Album List'});
    });
  });
};

exports.create = (req, res)=>{
  var form = new multiparty.Form();

  form.parse(req, (err, fields, files)=>{
    var album = {};
    album.name = fields.name[0];
    album.photo = files.albumPhoto[0];
    album.artistId = Mongo.ObjectID(album.artistId);

    if(fs.existsSync(`${__dirname}/../static/img/${album.name}`)){
      fs.renameSync(album.photo.path, `${__dirname}/../static/img/${album.name}/${album.photo.originalFilename}`);
    }else{
      fs.mkdirSync(`${__dirname}/../static/img/${album.name}`);
      fs.renameSync(album.photo.path, `${__dirname}/../static/img/${album.name}/${album.photo.originalFilename}`);
    }

    albums.save(album, ()=>{
      res.redirect('/albums');
    });
  });
};
