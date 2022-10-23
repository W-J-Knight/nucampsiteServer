const express = require("express");
const Favorite = require("../models/favorite");
const authenticate = require("../authenticate");
const cors = require("./cors");

const favoriteRouter = express.Router();

favoriteRouter
    .route("/")
    .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
    // user access piont
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        Favorite.find({ user: req.user._id })
            .populate("user")
            .populate("campsite")
            .then((favorite) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(favorite);
            })
            .catch((err) => next(err));
    })

    // user access point
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOne({ user: req.user._id })
            .then((favorite) => {
                if (favorite) {
                    Favorite.findOne({ user: req.user._id })
                        .then((favorite) => {
                            if (favorite) {
                                req.body.forEach((fav) => {
                                    if (
                                        !favorite.campsites.includes(
                                            favorite._id
                                        )
                                    ) {
                                        favorite.campsites.push(favorite._id);
                                    }
                                });
                                favorite.save().then((favorite) => {
                                    res.statusCode = 200;
                                    res.setHeader(
                                        "Content-Type",
                                        "application/json"
                                    );
                                    res.json(favorite);
                                });
                            }
                        })
                        .catch((err) => next(err));
                } else {
                    Favorite.create({ user: req.user._id })
                        .then((favorite) => {
                            if (favorite) {
                                req.body.forEach((fav) => {
                                    if (
                                        !favorite.campsites.includes(
                                            favorite._id
                                        )
                                    ) {
                                        favorite.campsites.push(favorite._id);
                                    }
                                });
                                favorite.save().then((favorite) => {
                                    res.statusCode = 200;
                                    res.setHeader(
                                        "Content-Type",
                                        "application/json"
                                    );
                                    res.json(favorite);
                                });
                            }
                        })
                        .catch((err) => next(err));
                }
            })
            .catch((err) => next(err));
    })
    //not supported
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
        res.statusCode = 403;
        res.end("PUT operation not supported on /campsites");
    })
    // user access point
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOneAndDelete({ user: req.user._id })
            .then((favorite) => {
                res.statusCode = 200;
                if (favorite) {
                    res.setHeader("Content-Type", "application/json");
                    res.json(favorite);
                } else {
                    res.setHeader("Content-Type", "application/json");
                    res.json(favorite);
                }
            })
            .catch((err) => next(err));
    });

favoriteRouter
    .route("/:campsiteId")
    .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
    // user access point
.get(cors.cors, authenticate.verifyUser, (req, res) => {
        res.statusCode = 403;
        res.end(`GET operation not supported on /favorites/${req.params.campsiteId}`);
    })

    // user access point
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOne({user: req.user._id })
        .then(favorite => {
            if(favorite) {      
                res.statusCode = 200;         
                if(!favorite.campsites.includes(req.params.campsiteId)) {                                         
                    favorite.campsites.push(req.params.campsiteId);
                    favorite.save()
                    .then(favorite => {
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favorite);
                    })
                    .catch(err => next(err));                      
                } else {
                    res.setHeader('Content-Type', 'text/plain');
                    res.end('That campsite is already in the list of favorites!');
                }    
            } else {
                Favorite.create({ user: req.user._id, campsites: [ req.params.campsiteId ]})
                .then(favorite => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                })
                .catch(err => next(err));
            }                
        })
        .catch(err => next(err));
    })
    //  not support
    .put(
        cors.corsWithOptions,
        authenticate.verifyUser,
        authenticate.verifyAdmin,
        (req, res) => {
            res.statusCode = 403;
            res.end("PUT operation not supported on /campsites");
        }
    )
    // user access point

    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOne({ user: req.user._id })
            .then((favorite) => {
                res.statusCode = 200;
                if (favorite) {
                    const index = favorite.campsites.indexOf(
                        req.params.campsiteId
                    );
                    if (index >= 0) {
                        favorite.campsites.splice(index, 1);
                    }
                    favorite
                        .save()
                        .then((favorite) => {
                            res.setHeader("Content-Type", "application/json");
                            res.json(favorite);
                        })
                        .catch((err) => next(err));
                } else {
                    res.setHeader("Content-Type", "text/plain");
                    res.end("You do not have any favorites to delete");
                }
            })
            .catch((err) => next(err));
    });

module.exports = favoriteRouter;
