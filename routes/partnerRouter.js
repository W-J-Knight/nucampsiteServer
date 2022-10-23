const express = require("express");
const Partner = require('../models/partner');
const partnerRouter = express.Router();
const authenticate = require('../authenticate');
const cors = require('./cors');

partnerRouter.route("/")
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
// for anyone admin, member, vistors
    .get(cors.cors, (req, res, next) => {
        Partner.find()
        .then(partner => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(partner);
        })
        .catch(err => next(err));
    })
    //  admin-only access point
    .post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
        Partner.create(req.body)
        .then(partner => {
            console.log('Partner Created ', partner);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(partner);
        })
        .catch(err => next(err));
    })
    // not supported
    .put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req, res) => {
        res.statusCode = 403;
        res.end("PUT operation not supported on /partners");
    })
    // admin-only access point
    .delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
        Partner.deleteMany()
        .then(response => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(response);
        })
        .catch(err => next(err));
    });

partnerRouter
    .route("/:partnerId")
    .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
    // for anyone admin, members, vistors
    .get(cors.cors, (req, res, next) => {
        Partner.findById(req.params.partnerId)
        .then(partner => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(partner);
        })
        .catch(err => next(err));
    })
    // not supported 
    .post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req, res) => {
        res.statusCode = 403;
        res.end(
            `POST operation not supported on /partners/${req.params.partnerId}`
        );
    })
    // admin-only access point
    .put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
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
    // admin-only access point
    .delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
        Partner.findByIdAndDelete(req.params.partnerId)
        .then(response => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(response);
        })
        .catch(err => next(err));
    });
module.exports = partnerRouter;
