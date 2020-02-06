"use strict";
exports.__esModule = true;
var users_1 = require("./users");
function routing(db, secret) {
    var routing = {
        usersRouting: users_1.usersRouting(db, secret)
    };
    return routing;
}
exports.routing = routing;
;
