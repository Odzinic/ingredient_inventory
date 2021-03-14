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

// Retrieve ingredient values
router.get('/api/values/', async(req, res) => {

    if (Object.entries(req.query).length == 0){
        res.status(500)
    }
    else{
        let ingredReq = req.query.ingred;

        let statement = `SELECT fat_cont, fibre_cont, sugr_cont, prot_cont, carb_cont FROM ingredient_db.Ingredients WHERE ingred_name = "${ingredReq}"`;

        try {
            let pool = await dbPool;
            let result = await pool.query(statement);
            res.status(200).send(result);
        } catch (err) {
            res.status(500).send(err);
        }
    }

})

module.exports = router;