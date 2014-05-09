'use strict';

exports.index = (req, res)=>{
  res.render('songs/index', {title: 'Node.js: Home'});
};
