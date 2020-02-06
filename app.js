"use strict";
exports.__esModule = true;
var routing_1 = require("./routing");
var jwt = require("express-jwt");
var config_1 = require("./config");
var fs = require('fs');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.disable('etag');
var pgp = require('pg-promise')({
    error: function (err, e) {
        if (e.cn) {
            fs.writeFile('db.log.txt', "DB ERROR: " + err + e + e.cn, function (err) {
                if (err) {
                    return console.log(err);
                }
            });
            console.log('E: ', err, e, e.cn);
        }
    }
});
app.get("/", function (req, res) {
    res.send('hello world');
});
var _a = process.env, PORT = _a.PORT, DB_HOST = _a.DB_HOST, DB_PORT = _a.DB_PORT, DB_USER = _a.DB_USER, DB_PASS = _a.DB_PASS, DB_DATABASE = _a.DB_DATABASE;
var db = pgp({
    user: DB_USER,
    password: DB_PASS,
    host: DB_HOST,
    port: DB_PORT,
    database: DB_DATABASE
});
app.use(jwt({ secret: config_1["default"].auth.secret }).unless({
    path: [
        { url: '/auth', methods: ['POST'] },
        { url: '/health', methods: ['GET'] },
        { url: '/users', methods: ['POST', 'GET'] },
    ]
}));
app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).send('invalid token...');
    }
});
var preparedRouting = routing_1.routing(db, config_1["default"].secret);
Object.keys(preparedRouting).forEach(function (item) {
    app.use('/', preparedRouting[item]);
});
app.listen(PORT, function () { return console.log("Running on " + PORT); });
