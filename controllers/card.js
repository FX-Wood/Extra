const express = require('express');
const router = express.Router();
const db = require('../db/models');
const isLoggedIn = require('../middleware/isLoggedIn');

router.use(isLoggedIn)
// GET /collections
router.route('/')
    .get((req,res) => {
        res.send('you are at the collections page, this will show an index of collections')
    })
    .post((req,res) => {
        res
    })


module.exports = router;