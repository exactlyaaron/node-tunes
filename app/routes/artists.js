/* jshint unused:false */

'use strict';

var fs = require('fs');
var multiparty = require('multiparty');
var _ = require('lodash');
var Mongo = require('mongodb');

var albums = global.nss.db.collection('albums');
var artists = global.nss.db.collection('artists');

exports.index = (req, res)=>{
  artists.find().toArray((err, records)=>{
    res.render('artists/index', {artists: records, title: 'Artist Page'});
  });
};

exports.create = (req, res)=>{
  var form = new multiparty.Form();

  form.parse(req, (err,fields,files)=>{
    var artist = {};
    artist.name = fields.name[0];
    artist.photo = files.artistPhoto[0];

    if (fs.existsSync(`${__dirname}/../static/img/${artist.name}`)){
      fs.renameSync(artist.photo.path,`${__dirname}/../static/img/${artist.name}/${artist.photo.originalFilename}`);
    }
    else{
      fs.mkdirSync(`${__dirname}/../static/img/${artist.name}`);
      fs.renameSync(artist.photo.path,`${__dirname}/../static/img/${artist.name}/${artist.photo.originalFilename}`);
    }
    artists.save(artist, ()=>res.redirect('/artists'));
  });
};

exports.show = (req, res)=>{
  var _id = Mongo.ObjectID(req.params.id);
  artists.find({_id:_id}).toArray((err, artist)=>{
    albums.find().toArray((err, albums)=>{
      albums = _.filter(albums,(album)=>{
        return _id.toString() === album.artistId.toString();
      });
      res.render('artists/show', {albums:albums, artists: artist, title: 'NodeTunes: Artist Profile'});
    });
  });
};
