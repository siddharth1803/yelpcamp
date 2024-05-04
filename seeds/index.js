const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors, images } = require('./seedHelpers');
const Campground = require("../models/campground")

mongoose.connect('mongodb://localhost:27017/yelp-camp',).then(() => {
    console.log("connected to db")
}).catch((error) => {
    console.error("Error connecting to MongoDB:", error);
})

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 100; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const random6 = Math.floor(Math.random() * 6);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: "66332cf2a5359714c0b51b92",
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            price,
            geometry: {
                type: "Point",
                coordinates: [cities[random1000].longitude, cities[random1000].latitude]
            },
            images: images[random6]
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})