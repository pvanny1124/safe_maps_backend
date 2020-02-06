"use strict";
exports.__esModule = true;
var jwt = require("jsonwebtoken");
var TokenService = /** @class */ (function () {
    function TokenService(secret) {
        this.secret = secret;
    }
    ;
    TokenService.prototype.sign = function (payload) {
        return jwt.sign(payload, this.secret);
    };
    return TokenService;
}());
exports["default"] = TokenService;
