const express = require("express");
const Partner = require('../models/partner');
const partnerRouter = express.Router();

partnerRouter.route("/")
    .get((req, res, next) => {
        Partner.find()
        .then(partner => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(partner);
        })
        .catch(err => next(err));
    })
    .post((req, res, next) => {
        Partner.create(req.body)
        .then(partner => {
            console.log('Partner Created ', partner);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(partner);
        })
        .catch(err => next(err));
    })
    .put((req, res) => {
        res.statusCode = 403;
        res.end("PUT operation not supported on /partners");
    })
    .delete((req, res, next) => {
        Partner.deleteMany()
        .then(response => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(response);
        })
        .catch(err => next(err));
    });

    // http://localhost:3000/partners/63416a5acc65a0a3ffcf0d49
partnerRouter
    .route("/:partnerId")
    .get((req, res, next) => {
        Partner.findById(req.params.partnerId)
        .then(partner => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(partner);
        })
        .catch(err => next(err));
    })
    .post((req, res) => {
        res.statusCode = 403;
        res.end(
            `POST operation not supported on /partners/${req.params.partnerId}`
        );
    })
    .put((req, res, next) => {
        Partner.findByIdAndUpdate(req.params.partnerId, {
            $set: req.body
        }, { new: true })
        .then(partner => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(partner);
        })
        .catch(err => next(err));
    })
    .delete((req, res, next) => {
        Partner.findByIdAndDelete(req.params.partnerId)
        .then(response => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(response);
        })
        .catch(err => next(err));
    });
module.exports = partnerRouter;
