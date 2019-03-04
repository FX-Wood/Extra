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
            include: [db.collection]
        })
        .then(user => {
            res.render('collections/collections-index', {user});
        })
    })
    // POST new collection
    .post((req,res) => {
        db.collection.create({name: "New Collection"})
        .then(collection => {
            res.send(collection)
    })
})

router.route('/:id[0-9]+')
    // GET one collection
    .get((req,res) => {
        res.send('you are at collections/show for a single collection' + req.params.id);
    })
    // PUT edit one collection
    .put((req,res) => {
        res.send('you have edited a single collection' + req.params.id);
    })
    // DELETE one collection
    .delete((req,res) => {
        res.send('you have deleted a collection' + req.params.id);
    })
router.get('/new', (req,res) => {
    res.send('this is a new collection form')
})
module.exports = router;