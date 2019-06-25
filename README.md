# hypechat
Trabajo práctico de taller de programación II, grupo 1. Facultad de Ingeniería - Universidad de Buenos Aires.
[![Coverage Status](https://coveralls.io/repos/github/LeoCenturion/hypechat/badge.svg?branch=master)](https://coveralls.io/github/LeoCenturion/hypechat?branch=master)

## Requerimientos
Para poder ejecutar este servidor es necesario tener instalado **git** (github), **docker** y **docker-compose**.<br />

## Instalacion
Se deben descargar los archivos del repositorio git. Para realizar esto abir una terminal en donde se desea descargar una carpeta con los archivos y ejecutar:<br />
$ git clone https://github.com/LeoCenturion/hypechat.git <br />

## Ejecución
Para ejecutar el servidor, abrir una terminal dentro de la carpeta descargada en la instalacion y poner:<br />
$ sudo docker-compose build<br />
$ sudo docker-compose up server<br />
<br />
Para ejecutar las pruebas, abrir una terminal dentro de la carpeta descargada en la instalacion y poner:<br />
$ sudo docker-compose build<br />
$ sudo docker-compose up test<br />

## Configuracion
Los parametros configurables se encuentran en el archivo "config.js" dentro de la carpeta descargada en la instalacion.<br />
Parametros:<br />
* port: puerto donde se ejecutara el servidor<br />
* db: url de la base de datos mongo que utiliza el servidor<br />
* SECRET_TOKEN: string que sirve para generar tokens<br />
* logLevel: nivel del logger<br />

## API
Para transformar la documentacion en .yaml a .md se utiliza swagger-markdown disponible en npm.<br />
Instalar del siguiente modo: <br />
$ npm install swagger-markdown<br />
Para ejecutarlo: <br />
$ ./node_modules/swagger-markdown/bin/index.js -i swagger.yaml<br />


[API](swagger.md)
