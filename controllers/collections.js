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
        res.send('you are at collections/show for a single collection' + req.params.id);
    })
    // PUT edit one collection
    .put((req,res) => {
        db.collection.findByPk(req.params.id)
            .then(collection => {
                console.log('this is the first then block')
                console.log('this is what was returned:', collection)
                collection.name = req.body.title;
                collection.description = req.body.description;
                return collection.save()
            })
            .then(collection => {
                console.log('in the last then')
                console.log('this is what was returned:', collection)
                res.send(collection);
            })


    })
    // DELETE one collection
    .delete((req,res) => {
        res.send('you have deleted a collection' + req.params.id);
    })
router.get('/new', (req,res) => {
    res.send('this is a new collection form')
})
module.exports = router;