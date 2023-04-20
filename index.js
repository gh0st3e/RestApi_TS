"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var process = require("process");
var app = (0, express_1.default)();
var port = process.env.PORT || 8000;
app.get("/", function (req, res) {
    res.send("It works");
});
app.listen(port, function () {
    console.log("Server is running on port: ".concat(port));
});
