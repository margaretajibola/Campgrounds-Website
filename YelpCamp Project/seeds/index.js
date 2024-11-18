const mongoose = require('mongoose');
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers');
const Campground = require('../models/campground');

main().catch(err => console.log(err));

async function main(){
    try{
        await mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');
        console.log("Database Connected!");
        // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled

    }
    catch(e){
        console.log("Error!");
        console.log(e);
    }
}

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for(let i = 0; i < 50; i++){
        const random1000 = Math.floor(Math.random() * 1000);
        const price =  Math.floor(Math.random() * 20) + 101;
        const camp = new Campground({
            author: '6730cc5a8df4334c0fd806f0',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Tempore ratione laudantium provident dolore magnam eos! Facere cum a porro tempore explicabo dolor ab fugit quidem. Quam ratione ex fuga amet?',
            price: price,
            images: [
                {
                  url: 'https://res.cloudinary.com/devv0cyul/image/upload/v1731942937/YelpCamp/u8ctmd9snxgnid3zzjqv.jpg',
                  filename: 'YelpCamp/u8ctmd9snxgnid3zzjqv',
                },
                {
                  url: 'https://res.cloudinary.com/devv0cyul/image/upload/v1731942937/YelpCamp/ru6muxncx4acxdm5jvkr.jpg',
                  filename: 'YelpCamp/ru6muxncx4acxdm5jvkr',
                }
              ]

        });
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});