const Campground = require("../models/campground")
const { cloudinary } = require("../cloudinary/index")
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding")
const mapBoxToken = process.env.MAPBOX_TOKEN
const geoCoder = mbxGeocoding({ accessToken: mapBoxToken })
const ExpressError = require("../utils/ExpressError")
const User = require("../models/user");

module.exports.index = async (req, res) => {

    const { pno = 1, username } = req.params
    const { query } = req.query
    let start = 0
    let originalUrl = req.originalUrl
    let campgrounds = ""
    if (query) {
        const { page = 1 } = req.params
        start = (page - 1) * 10
        const regex = new RegExp(query, 'i')
        campgrounds = await Campground.find({ $or: [{ title: regex }, { location: regex }] })
    }
    else {
        if (username) {
            start = (pno - 1) * 10
            let userData = await User.findOne({ username: username })
            if (userData == null)
                throw new ExpressError("user not found", 404)
            campgrounds = await Campground.find({ author: userData._id });
        }
        else {
            start = (pno - 1) * 10
            campgrounds = await Campground.find()
        }
    }
    const end = start + 10

    res.render("campgrounds/index", { campgrounds, start, end, originalUrl, username })
}

module.exports.renderNewForm = (req, res) => {
    res.render("campgrounds/new")
}

module.exports.renderEditForm = async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render("campgrounds/edit", { campground })
}

module.exports.createCampground = async (req, res) => {

    let geoData = await geoCoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()

    if (geoData.body.features.length === 0) {
        req.flash("error", "invalid location please try again")
        return res.redirect("/campgrounds/new")
    }

    const campground = new Campground(req.body.campground)
    campground.geometry = geoData.body.features[0].geometry
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    campground.author = req.user._id
    await campground.save()
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.updateCampground = async (req, res) => {
    const { id } = req.params
    let geoData = await geoCoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()

    if (geoData.body.features.length === 0) {
        req.flash("error", "invalid location please try again")
        return res.redirect(`/campgrounds/${id}/edit`)
    }
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground })
    const images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    campground.geometry = geoData.body.features[0].geometry
    campground.images.push(...images)
    await campground.save()
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename)
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully updated campground!');
    res.redirect("/campgrounds")
}

module.exports.showCampground = async (req, res) => {
    const campground = await Campground.findById(req.params.id)
        .populate({
            path: "reviews", populate: {
                path: "author"
            }
        })
        .populate("author")
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render("campgrounds/show", { campground })
}

