# hypechat
Trabajo práctico de taller de programación II, grupo 1. Facultad de Ingeniería - Universidad de Buenos Aires.
[![Coverage Status](https://coveralls.io/repos/github/LeoCenturion/hypechat/badge.svg?branch=master)](https://coveralls.io/github/LeoCenturion/hypechat?branch=master)

## Requerimientos
Para poder ejecutar este servidor es necesario tener instalado **docker** y **docker-compose**.

## Ejecución
Para ejecutar el servidor poner en una terminal:<br />
$ sudo docker-compose build<br />
$ sudo docker-compose up

## API
Para transformar la documentacion en .yaml a .md se utiliza swagger-markdown disponible en npm.<br />
Instalar del siguiente modo: $ npm install swagger-markdown<br />
Para ejecutarlo: $ ./node_modules/swagger-markdown/bin/index.js -i swagger.yaml<br />


[API](swagger.md)
