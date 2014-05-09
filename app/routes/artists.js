'use strict';

var fs = require('fs');
var artists = global.nss.db.collection('artists');
var multiparty = require('multiparty');

exports.index = (req, res)=>{
  artists.find().toArray((e,r)=>{
    res.render('artists/index', {artists: r, title: 'Artists Index'});
  });
};

exports.create = (req, res)=>{
  var form = new multiparty.Form();

  form.parse(req, (err, fields, files)=>{
    var artist = {};
    artist.name = fields.name[0];
    artist.photo = files.artistPhoto[0];

    if(fs.existsSync(`${__dirname}/../static/img/${artist.name}`)){
      fs.renameSync(artist.photo.path, `${__dirname}/../static/img/${artist.name}/${artist.photo.originalFilename}`);
    }else{
      fs.mkdirSync(`${__dirname}/../static/img/${artist.name}`);
      fs.renameSync(artist.photo.path, `${__dirname}/../static/img/${artist.name}/${artist.photo.originalFilename}`);
    }

    artists.save(artist, ()=>{
      res.redirect('/artists');
    });
  });
};
