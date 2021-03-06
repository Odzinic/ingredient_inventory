const express = require('express');
const router = express.Router();

let dbPool = require("./DB");
let sql = require('mariadb');

// Retrieve ingredients
router.get('/api/ingredients/', async(req, res) => {

    let statement = "SELECT ingredient_db.Ingredients.ingred_name AS items FROM ingredient_db.Ingredients";

    try {
        let pool = await dbPool;
        let result = await pool.query(statement);
        res.status(200).send(result);
    } catch (err) {
        res.status(500).send(err);
    }
})

module.exports = router;