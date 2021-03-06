const Recipe = require('../models/recipe');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require("../cloudinary");


module.exports.index = async (req, res) => {
    const recipes = await Recipe.find({}).populate('popupText');
    res.render('recipes/index', { recipes })
}

module.exports.renderNewForm = (req, res) => {
    res.render('recipes/new')
}

module.exports.createRecipe = async (req, res, next) => {
    // if(!req.body.campground) throw new ExpressError('Invalid Recipe Data', 400);
    const geoData = await geocoder.forwardGeocode({
        query: req.body.recipe.location,
        limit: 1
    }).send()
    const recipe = new Recipe(req.body.recipe);
    recipe.geometry = geoData.body.features[0].geometry;
    recipe.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    recipe.author = req.user._id;
    await recipe.save();
    console.log(recipe);
    req.flash('success', 'Successfully made a new recipe!')
    res.redirect(`/recipes/${recipe._id}`);
}

module.exports.showRecipe = async (req, res) => {
    const recipe = await Recipe.findById(req.params.id).populate({
        path:'reviews',
        populate: { path: 'author'
        }
    })
    .populate('author');
    if(!recipe){
        req.flash('error', 'Cannot find that recipe!')
        return res.redirect('/recipes');
    }
    res.render('recipes/show', { recipe })
}

module.exports.renderEditForm = async(req, res) => {
    const { id } = req.params;
    const recipe = await Recipe.findById(id)
    if(!recipe){
        req.flash('error', 'Cannot find that recipe!')
        return res.redirect('/recipes');
    }
    res.render('recipes/edit', { recipe });
}

module.exports.updateRecipe = async (req, res) => {
    const { id } = req.params;
    console.log(req.body);
    const recipe = await Recipe.findByIdAndUpdate(id, { ...req.body.recipe });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    recipe.images.push(...imgs);
    await recipe.save();
    if (req.body.deleteImages) {
        for(let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await recipe.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
        console.log(recipe)
    }
    req.flash('success', "successfully updated recipe!")
    res.redirect(`/recipes/${recipe._id}`)
}

module.exports.deleteRecipe = async (req, res) => {
    const { id } =req.params;
    await Recipe.findByIdAndDelete(id);
    req.flash('success', "successfully deleted recipe!")
    res.redirect('/recipes');
}