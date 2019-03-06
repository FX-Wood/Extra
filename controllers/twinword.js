const express = require('express');
const db = require('../db/models')
const isLoggedIn = require('../middleware/isLoggedIn');
const router = express.Router();
const request = require('request');

router.use(isLoggedIn);

router.get('/:word', (req, res) => {
    let options = {
        url: `https://wordsapiv1.p.rapidapi.com/words/${req.params.word}/definitions`,
        headers: {
            'X-RapidAPI-Key': process.env.X_RAPID_API_KEY
        }
    }
    let callback = function(error, response, body) {
        console.log(Object.keys(response))
        console.log(response.headers)
        console.log(process.env.X_RAPID_API_KEY)
        console.log(response.body)
        if (!error & response.statusCode === 200) {
            res.json(JSON.parse(body))
        } else {
            res.json(error)
        }
    }
    request(options, callback)
})

module.exports = router;