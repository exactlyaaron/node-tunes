'use strict';

var fs = require('fs');
var multiparty = require('multiparty');
var _ = require('lodash');

var albums = global.nss.db.collection('albums');
var artists = global.nss.db.collection('artists');

exports.index = (req, res)=>{
  albums.find().toArray((err,albums)=>{

    artists.find().toArray((err,artists)=>{

      albums = albums.map(ablum =>{
          artist.name = _(artists).find(nameString =>

            nameString._id.toString() === artist.priorityId.toString());
          return task;
      });
      res.render('tasks/index', {artists: artists, albums:ablums, title: 'Task List'});

    });
  });


exports.create = (req, res)=>{
  var form = new multiparty.Form();

  form.parse(req, (err,fields,files)=>{
    var album = {};
    album.name = fields.name[0];
    album.artistId = Mongo.ObjectID(album.priorityId)
    album.photo = files.albumPhoto[0];

    if (fs.existsSync(`${__dirname}/../static/img/${album.name}`)){
      fs.renameSync(album.photo.path,`${__dirname}/../static/img/${album.name}/${album.photo.originalFilename}`);
    }
    else{
      fs.mkdirSync(`${__dirname}/../static/img/${album.name}`);
      fs.renameSync(album.photo.path,`${__dirname}/../static/img/${album.name}/${album.photo.originalFilename}`);
    }
    albums.save(album, ()=>res.redirect('/albums'));

  });
};
