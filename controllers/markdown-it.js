const md = require('markdown-it')()
const express = require('express');
const db = require('../db/models');
const isLoggedIn = require('../middleware/isLoggedIn');
const router = express.Router()

router.use(isLoggedIn)

router.post('/', (req, res) => {
    console.log('hit the route')
    console.log(req.body)
    console.log('--------------------->', md.render(req.body.md))
    res.send(md.render(req.body.md))
})

module.exports = router