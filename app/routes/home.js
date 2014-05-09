'use strict';

exports.index = (req, res)=>{
  res.render('home/index', {title: 'Node Tunes'});
};

exports.about = (req, res)=>{
  res.render('home/about', {title: 'About Node-Tunes'});
};
