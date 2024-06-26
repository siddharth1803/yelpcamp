const express = require("express")
const router = express.Router()
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isCampOwner, validateCampground } = require("../middleware");
const campgrounds = require("../controllers/campgrounds")
const multer = require('multer')
const { storage } = require("../cloudinary/index")
const upload = multer({ storage })
const { campgroundSchema } = require('../schemas');



router.route("/")
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, upload.array("images"), campgroundSchema, validateCampground, catchAsync(campgrounds.createCampground));

router.get("/page/:pno", campgrounds.index)

router.get("/findCampground/:page", catchAsync(campgrounds.index))

router.get("/getCampgroundsByUser/:username/:pno", campgrounds.index)

router.get("/new", isLoggedIn, campgrounds.renderNewForm);

router.route("/:id")
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isCampOwner, upload.array("images"), campgroundSchema, validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isCampOwner, catchAsync(campgrounds.deleteCampground));

router.get("/:id/edit", isLoggedIn, isCampOwner, catchAsync(campgrounds.renderEditForm));

module.exports = router;