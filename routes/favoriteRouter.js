//Task 2 week-4: Implement the favoriteRouter and support the endpoints
const express = require('express');
const Favorite = require('../models/favorite');
const Campsite = require('../models/campsite');
const authenticate = require('../authenticate');
const cors = require('./cors');

const favoriteRouter = express.Router();

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))   
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorite.find({//queries database for all docs(that instantiated using Favorite Model)
        user: req.user._id
    }) 
    .populate('user')
    .populate('campsites')
    .then(favorites => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorites);   
    })
    .catch(err => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({
        user: req.user._id
    })
    .then(favorite => {
        if (favorite) {
            if (favorite.campsites.indexOf(favorite._id) === -1) {
                favorite.campsites.push(favorite._id)
                }
                favorite.save()
                    .then(favorite => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                    })
                    .catch(err => next(err));
                }
                else {
                Favorite.create({
                    user: req.user._id,
                    campsites: req.body
                })
                .then(favorite => {
                    console.log('Favorite Created ', favorite);
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                })
                .catch(err => next(err));
            }
        })
    .catch(err => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOneAndDelete({
        user: req.user._id
    })
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
})

favoriteRouter.route('/:campsiteId')
.get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('GET operation not supported on /favorites/:campsiteId');
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({
        user: req.user._id
    })
    .then(favorite => {
        if (favorite) {
            Campsite.findById(req.params.campsiteId).then(campsite => {
                if(favorite.campsites.filter(campsite => campsite._id.toString() === req.params.campsiteId).length == 0) {
                    favorite.campsites.push(campsite);
                    favorite.save()
                    .then(favorite => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favorite);
                    })
                } else {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'text/plain');
                    res.end(`That campsite is already a favorite!`);
                }
            })
            .catch(err => next(err));
        } else {
            Campsite.findById(req.params.campsiteId).then(campsite => {
                Favorite.create({
                    user: req.user._id,
                    campsites: campsite
                })
                .then(favorite => {
                    console.log('Favorite Created ', favorite);
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                })
            })
            .catch(err => next(err));
        }
    })
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites/:campsiteId');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({
        user: req.user._id
    })
    .then(favorite => {
        if (favorite) {
            favorite.campsites = favorite.campsites.filter(campsite => campsite._id.toString() !== req.params.campsiteId)
                favorite.save()
                .then(response => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(response);
                })
                .catch(err => next(err));
        } else {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/plain');
            res.end('There are no favorites to delete from this user');
        }
    })
    .catch(err => next(err));
});


module.exports = favoriteRouter;