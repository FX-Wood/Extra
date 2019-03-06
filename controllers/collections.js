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
    })
})

router.route('/:id([0-9]+)')
    // GET one collection
    .get((req,res) => {
        db.collection.findByPk(req.params.id,{
            include: [db.card]
        }).then(collection => {
            res.render('collections/collections-show', {collection})
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
    })
    // DELETE one collection
    .delete((req,res) => {
        console.log('got a delete request')
        console.log('deleting collection number ' + req.params.id)
        res.redirect('/collections');
    })
router.get('/new', (req,res) => {
    res.send('this is a new collection form')
})
module.exports = router;