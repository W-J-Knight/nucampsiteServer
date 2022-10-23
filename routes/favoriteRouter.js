const express = require("express");
const Favorite = require("../models/favorite");
const authenticate = require("../authenticate");
const cors = require("./cors");

const favoriteRouter = express.Router();

favoriteRouter
    .route("/")
    .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
    // user access point
    // pull up the favorite list
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        Favorite.find({ user: req.user._id })
            .populate("user")
            .populate("campsites")
            .then((favorite) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(favorite);
            })
            .catch((err) => next(err));
    })
    // user access point
    // add to the favorite list
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOne({ user: req.user._id })
            .then((favorite) => {
                // see if favorite list there than and the new favorite to the list
                if (favorite) {
                    req.body.forEach((fav) => {
                        if (!favorite.campsites.includes(fav._id)) {
                            favorite.campsites.push(fav._id);
                        }
                    });
                    favorite
                        .save()
                        .then((fav) => {
                            res.statusCode = 200;
                            res.setHeader("Content-Type", "application/json");
                            res.json(fav);
                        })
                        .catch((err) => next(err));
                }
                // no favorite list make one and the new favorite to the list
                else {
                    Favorite.create({ user: req.user._id, campsites: req.body })
                        .then((fav) => {
                            res.statusCode = 200;
                            res.setHeader("Content-Type", "application/json");
                            res.json(fav);
                        })
                        .catch((err) => next(err));
                }
            })
            .catch((err) => next(err));
    })
    //not supported
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
        res.statusCode = 403;
        res.end(`PUT operation not supported on /favorites/${req.params.campsiteId}`);
    })
    // user access point
    // delete everything in the favorite list
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOneAndDelete({ user: req.user._id })
            .then((favorite) => {
                // delete the favorite list send back that list
                if (favorite) {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(favorite);
                } 
                // let use know list is already empty
                else {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "text/plain");
                    res.end("You do not have any favorites to delete.");
                }
            })
            .catch((err) => next(err));
    });

favoriteRouter
    .route("/:campsiteId")
    .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
    // not support 
    .get(cors.corsWithOptions,authenticate.verifyUser,(req, res, next) => {
        res.statusCode = 403;
        res.end(`GET operation not supported on /favorites/${req.params.campsiteId}`);
    })
    // user access point
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOne({ user: req.user._id })
            .then((favorite) => {
                if (favorite) {
                    if (!favorite.campsites.includes(req.params.campsiteId)) {
                        favorite.campsites.push(req.params.campsiteId);
                        favorite
                            .save()
                            .then((fav) => {
                                res.statusCode = 200;
                                res.setHeader(
                                    "Content-Type",
                                    "application/json"
                                );
                                res.json(fav);
                            })
                            .catch((err) => next(err));
                    } else {
                        res.statusCode = 200;
                        res.setHeader("Content-Type", "text/plain");
                        res.end("This campsite is already in your favorites!");
                    }
                } else {
                    Favorite.create({
                        user: req.user._id,
                        campsites: [req.params.campsiteId],
                    })
                        .then((fav) => {
                            res.statusCode = 200;
                            res.setHeader("Content-Type", "application/json");
                            res.json(fav);
                        })
                        .catch((err) => next(err));
                }
            })
            .catch((err) => next(err));
    })
    //   not supported
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end(
            `PUT operation not supported on /favorites/${req.params.campsiteId}`
        );
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOne({ user: req.user._id })
            .then((favorite) => {
                // find the that one favorite and delete it
                if (favorite) {
                    if (favorite.campsites.includes(req.params.campsiteId)) {
                        const index = favorite.campsites.indexOf(
                            req.params.campsiteId
                        );
                        favorite.campsites.splice(index, 1);
                    }
                    favorite
                        .save()
                        .then((fav) => {
                            res.statusCode = 200;
                            res.setHeader("Content-Type", "application/json");
                            res.json(fav);
                        })
                        .catch((err) => next(err));
                } 
                // Not in favorite list
                else {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "text/plain");
                    res.end("Not in favorites. So cann't delete");
                }
            })
            .catch((err) => next(err));
    });

module.exports = favoriteRouter;
