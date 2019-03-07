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
        db.card.create({
            front: req.body.front,
            back: req.body.back,
            collectionId: req.body.collectionId
        }).then(card => {
            res.send(req.body)
        }).catch(err => {
            res.status(500).send('There was a server-side error')
        })
    })

router.get('/new/', (req,res) => {
    let referer = req.query.collectionId
    db.user.findByPk(req.user.id,{
        include: [db.collection]
    })
    .then(user => res.render('cards/cards-new', {user, referer}))
    .catch(error => {
        console.log(error)
    })
})

module.exports = router;