const express = require('express');
const router = express.Router();
const wines =  require('../controllers/wines');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateWine } = require('../middleware');
const multer = require('multer')
const {storage} = require('../cloudinary');
const upload = multer({ storage });

const Wine = require('../models/wine');

router.route('/')
    .get(catchAsync(wines.index))
    .post(isLoggedIn, upload.array('image'), validateWine, catchAsync(wines.createWine));

    // .post(upload.array('image'), (req, res) => {
    //     console.log(req.body, req.files);
    //     res.send('itworked')
    // })

router.get('/new', isLoggedIn, wines.renderNewForm);

router.route('/:id')
    .get(catchAsync(wines.showWine))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateWine, catchAsync(wines.updateWine))
    .delete(isLoggedIn, isAuthor, catchAsync(Wines.deleteWine))


router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(wines.renderEditForm));



module.exports = router;