var express = require('express');
var router = express.Router();
const requestIp = require('request-ip');
const { request } = require('http');
const { json } = require('body-parser');
const geoip = require('geoip-lite');
const db = require('../database');
const nodemailer = require('nodemailer')
require('dotenv').config();
var app = require('../app');

/* GET home page. */
router.get('/', function(req, res, next) {
  let name = 'Julian Sojo'
  res.render('index', {
    title: 'CV Julian',
    name:name,
  });
});

router.get('/login', function(req, res, next) {
  // res.render('login');
  res.render ('login', { error: false });

});

///////// Redireccion de datos al Login //////////////

router.post('/login', function(req, res, next) {
  let user = req.body.user
  let pass = req.body.pass
  if (user == process.env.ADMIN_USER && pass == process.env.ADMIN_PASS)  {
    db.select(function (rows) {
      // console.log(rows);
      res.render('contactos', {rows: rows});
    });
  } else {
    res.render('login', { error: 'Datos incorrectos' });
  }
})






router.post('/', function(req, res, next) {
  let name = req.body.name;
  let email = req.body.email;
  let message = req.body.message;
  let date = new Date();

  const geo = geoip.lookup("186.92.82.190");
  const clientIp = requestIp.getClientIp(req);
  const ip = clientIp;
  let now = date.toLocaleString();
  let locat = (geo.country);

  //let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  db.insert(name, email, message, date, ip, now, locat);

  console.log(req.body)
  console.log({name, email, message, date, ip, locat});
  console.log(geo);


  /////////       Transporte del Correo       ///////////
  var transporter = nodemailer.createTransport ({
    
    host: 'smtp.hostinger.com',
    port: 465,
    secure: true,
    // service: 'gmail',
    auth: {
      //user: process.env.EMAIL_USER,
      //pass: process.env.EMAIL_PASS
      user:'test009@arodu.dev',
      pass:'eMail.test009'

    }
  });

  // Opciones de correo
  var mailOptions = {
    nombre: name,
    from: 'test009@arodu.dev',
    //to: "programacion2ais@dispostable.com",
    to: email,
    subject: 'Contacto desde el formulario',

    text: "Enviado por " + name + "\nEmail: " + email + "\nMensaje: " + message + "\nIP: " + ip + "\nPais: " + locat
  };

  // Envio el Correo Electrónico con el transporte
  transporter.sendMail (mailOptions, function (error, info) {
    // Respuesta :V
    if (error) {
      console.log (error);
      res.send (' Error al Enviar el Correo.');
    } else {
      console.log ('Correo enviado: ' + info.response);
      res.send ('Correo Enviado');
    }
  });


  res.redirect('/contact');
});

router.get('/contact', function(req, res, next){
  db.select(function (rows){
    console.log(rows);
  });
  res.send('Todo Normal por Aqui');
});

module.exports = router;
