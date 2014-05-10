'use strict';

var fs = require('fs');
var multiparty = require('multiparty');
var _ = require('lodash');

var Mongo = require('mongodb');

var albums = global.nss.db.collection('albums');
var artists = global.nss.db.collection('artists');

// exports.index = (req, res)=>{
//   albums.find().toArray((err, records)=>{
//     res.render('albums/index', {albums: records, title: 'NodeTunes: Artists'});
//   });
// };

exports.index = (req, res)=>{
  albums.find().toArray((err, albums)=>{
    artists.find().toArray((err, artists)=>{

      albums = albums.map(album => {
        album.artist = _(artists).find(a => {
          return a._id.toString() === album.artistId.toString();
        });

        return album;

        // var al = _(albms).find(a=>a._id.toString() === s.albumId.toString());
        // var ar = _(artsts).find(a=>a._id.toString() === s.artistId.toString());
        // s.album = al;
        // s.artist = ar;
        // return s;
        //

      });

      console.log(albums);
      res.render('albums/index', {albums: albums, artists: artists, title: 'NodeTunes: Albums'});
    });
  });
};


    // if(!fs.existsSync(`${__dirname}/../static/img/album`)) {
    //   fs.mkdirSync(`${__dirname}/../static/img/album`);
    // }
    // if(!fs.existsSync(`${__dirname}/../static/img/album/${album.name}`)) {
    //   fs.mkdirSync(`${__dirname}/../static/img/album/${album.name}`);
    // }
    // if(!fs.existsSync(`${__dirname}/../static/img/album/${album.name}/${album.cover}`)) {
    //   fs.renameSync(files.cover[0].path, `${__dirname}/../static/img/album/${album.name}/${album.cover}`);
    //   albums.save(album, ()=> res.redirect('/albums'));
    // }
    // else {
    //   res.redirect('/albums');
    // }


exports.create = (req, res)=>{

  var form = new multiparty.Form();

  form.parse(req, (err, fields, files)=>{
    var album = {};
    album.name = fields.name[0];
    album.photo = files.albumPhoto[0];
    album.artistId = Mongo.ObjectID(fields.artistId[0]);

    if(fs.existsSync(`${__dirname}/../static/img/${album.name}`)){
      fs.renameSync(album.photo.path, `${__dirname}/../static/img/${album.name}/${album.photo.originalFilename}`);
    } else {
      fs.mkdirSync(`${__dirname}/../static/img/${album.name}`);
      fs.renameSync(album.photo.path, `${__dirname}/../static/img/${album.name}/${album.photo.originalFilename}`);
    }

    albums.save(album, ()=>{
      res.redirect('/albums');
      console.log(album);
    });
  });
};
