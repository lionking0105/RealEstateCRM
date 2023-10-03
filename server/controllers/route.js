const express = require('express');
const router = express.Router();

const contactRoute = require('./contact/_routes')
const propertyRoute = require('./property/_routes');
const leadRoute = require('./lead/_routes');
const taskRoute = require('./task/_routes');
const reportingRoute = require('./reporting/_routes');
const documentRoute = require('./document/_routes');
const userRoute = require('./user/_routes');

const emailRoute = require('./emailHistory/_routes');
const phoneCallRoute = require('./phoneCall/_routes');
const TextMsgRoute = require('./textMsg/_routes');
const meetingRoute = require('./meeting/_routes');
const paymentRoute = require('./payment/_routes');

//Api`s
router.use('/contact', contactRoute);
router.use('/property', propertyRoute)
router.use('/lead', leadRoute)
router.use('/task', taskRoute);
router.use('/document', documentRoute);
router.use('/reporting', reportingRoute);
router.use('/user', userRoute);
router.use('/payment', paymentRoute);

router.use('/email', emailRoute);
router.use('/phoneCall', phoneCallRoute);
router.use('/text-msg', TextMsgRoute);
router.use('/meeting', meetingRoute);

module.exports = router;