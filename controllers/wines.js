const Wine = require('../models/wine');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require("../cloudinary");


module.exports.index = async (req, res) => {
    const wines = await Wine.find({}).populate('popupText');
    res.render('wines/index', { wines })
}

module.exports.renderNewForm = (req, res) => {
    res.render('wines/new')
}

module.exports.createWine = async (req, res, next) => {
    // if(!req.body.campground) throw new ExpressError('Invalid Wine Data', 400);
    const geoData = await geocoder.forwardGeocode({
        query: req.body.wine.location,
        limit: 1
    }).send()
    const wine = new Wine(req.body.wine);
    wine.geometry = geoData.body.features[0].geometry;
    wine.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    wine.author = req.user._id;
    await wine.save();
    console.log(wine);
    req.flash('success', 'Successfully made a new wine!')
    res.redirect(`/wines/${wine._id}`);
}

module.exports.showWine = async (req, res) => {
    const wine = await Wine.findById(req.params.id).populate({
        path:'reviews',
        populate: { path: 'author'
        }
    })
    .populate('author');
    if(!wine){
        req.flash('error', 'Cannot find that wine!')
        return res.redirect('/wines');
    }
    res.render('wines/show', { wine })
}

module.exports.renderEditForm = async(req, res) => {
    const { id } = req.params;
    const wine = await Wine.findById(id)
    if(!wine){
        req.flash('error', 'Cannot find that wine!')
        return res.redirect('/wines');
    }
    res.render('wines/edit', { wine });
}

module.exports.updateWine = async (req, res) => {
    const { id } = req.params;
    console.log(req.body);
    const wine = await Wine.findByIdAndUpdate(id, { ...req.body.wine });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    wine.images.push(...imgs);
    await wine.save();
    if (req.body.deleteImages) {
        for(let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await wine.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
        console.log(wine)
    }
    req.flash('success', "successfully updated wine!")
    res.redirect(`/wines/${wine._id}`)
}

module.exports.deleteWine = async (req, res) => {
    const { id } =req.params;
    await Wine.findByIdAndDelete(id);
    req.flash('success', "successfully deleted wine!")
    res.redirect('/wines');
}