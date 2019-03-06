const express = require('express');
const db = require('../db/models')
const isLoggedIn = require('../middleware/isLoggedIn');
const router = express.Router();

router.use(isLoggedIn);

// routes for collection

router.route('/')
    // GET index
    .get((req,res) => {
        db.user.findOne({
            where: {id: req.user.id},
            include: [{
                model: db.collection,
                order: ['updatedAt', 'ASC']
            }],
        })
        .then(user => {
            res.render('collections/collections-index', {user});
        }).catch(err => {
            console.log(err)
            res.status(500).send('There was a server-side error!')
        })
    })
    // POST new collection
    .post((req,res) => {
        db.collection.create({
            name: "New Collection",
            description: "New, undescribed collection.",
            userId: req.user.id
        })
        .then(collection => {
            res.send(collection)
    }).catch(err => {
        console.log(err)
        res.status(500).send('There was a server-side error!')
    })

})

router.route('/:id([0-9]+)')
    // GET one collection
    .get((req,res) => {
        db.collection.findByPk(req.params.id,{
            include: [db.card]
        }).then(collection => {
            res.render('collections/collections-show', {collection})
        }).catch(err => {
            console.log(err)
            res.status(500).send('There was a server-side error!')
        })
    })
    // PUT edit one collection
    .put((req,res) => {
        db.collection.findByPk(req.params.id)
            .then(collection => {
                collection.name = req.body.title;
                collection.description = req.body.description;
                return collection.save()
            })
            .then(collection => {
                res.send(collection);
            })
            .catch(err => {
                console.log(err)
                res.status(500).send('There was a server-side error!')
            })
    })
    // DELETE one collection
    .delete((req,res) => {
        db.collection.destroy({
            where: {id: req.params.id}
        }).then(result => {
            console.log('User deleted collection #' + req.params.id)
            console.log('this was returned from the db:', result)
            res.send('You deleted collection #', req.params.id)
        }).catch(err => {
            console.log(err)
        })
    })
router.get('/new', (req,res) => {
    res.send('this is a new collection form')
})
module.exports = router;