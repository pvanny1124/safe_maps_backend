"use strict";
exports.__esModule = true;
var express = require('express');
var router = express.Router();
var repositories_1 = require("../repositories");
var handlers_1 = require("../handlers");
function usersRouting(db, secret) {
    var userRepository = new repositories_1.UserRepository(db, secret);
    router.post("/users", handlers_1.usersHandler.createAccountValidation, handlers_1.usersHandler.createAccount(userRepository));
    router.get("/users", handlers_1.usersHandler.authenticateAccountValidation, handlers_1.usersHandler.authenticateAccount(userRepository));
    return router;
}
exports.usersRouting = usersRouting;
