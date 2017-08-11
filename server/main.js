var express = require('express');  
var app = express();  
var server = require('http').Server(app);  
var io = require('socket.io')(server);

var pdf = require('pdfkit');
var fs = require('fs');
var fecha =require('fecha');
const exec = require('child_process').exec;


app.use(function(req, res, next){
	res.header('Access-Control-Allow-Origin',"*");
	res.header('Access-Control-Allow-Methods','GET, PUT, POST, DELETE');
	res.header('Access-Control-Allow-Headers', 'Content-Type');
	next();
});

app.use(express.static('public'));

const log4js = require('log4js');

log4js.configure({
	appenders: { registro: { type: 'file', filename: 'registro.log' } },
	categories: { default: { appenders: ['registro'], level: 'info' } }
});

const logger = log4js.getLogger('registro');

io.on('connection', function(socket) 
{  
	//checar conexion
	console.log('Alguien se ha conectado con Sockets');

	//checar desconexion
	socket.on('disconnect', function(){
		console.log('Alguien se ha desconectado');
	});

	socket.on('turno', function(turno){
		console.log('La caja No. '+turno.caja+' a tomado el turno: '+turno.letra+''+ turno.turno+' y el asunto: '+turno.asunto);
		logger.info('La caja No. '+turno.caja+' a tomado el turno: '+turno.letra+''+ turno.turno+' y el asunto: '+turno.asunto);
		io.emit('turno', { caja: turno.caja, turno: turno.turno, asunto: turno.asunto, letra: turno.letra, tipo: turno.tipo });
	
	});
	socket.on('termino', function(turno){
		logger.info('La caja No. '+turno.caja+' termino el turno: '+turno.letra+''+ turno.turno+' y el asunto: '+turno.asunto);
	});
	socket.on('abandono',function(turno){
		logger.info('La caja No. '+turno.caja+' dio por abandonado el turno: '+turno.letra+''+ turno.turno+' y el asunto: '+turno.asunto);
	});
	socket.on('comercial',function(){
		logger.info('Nuevo comercial');
		io.emit('comercial');
	});
});
server.listen(8080, function() {  
 console.log("Servidor corriendo en http://localhost:3000");
});