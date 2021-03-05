const express = require('express');
const router = express.Router();

var dbPool = require("./DB");
var sql = require('mariadb');

module.exports = router;