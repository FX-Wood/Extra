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
        console.log('POST /cards')
        db.collection.findAll({
            where: {userId: req.user.id}
        }).then(collections => {
            let ownership = false
            for (collection of collections.map(collection => collection.get({plain: true}))) {
                if (collection.id == req.body.collectionId) {
                    ownership = true;
                }
            }
            if (ownership) {
                let cards = req.body.cards.map(card => {
                        return Object.assign(card, {collectionId: req.body.collectionId})
                    })
                db.card.bulkCreate(cards)
                .spread((affectedCount, badPostgres) => {
                    res.send('done')
                })
            } else {
                throw Error('Unauthorized attempt to modify collection')
            }
        }).catch(err => {
            res.status(500).send(err)
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