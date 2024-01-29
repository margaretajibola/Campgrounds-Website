const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const engine = require('ejs-mate')
const catchAsync = require('./utils/catchAsync')
const ExpressError = require('./utils/ExpressError')
const methodOverride = require('method-override');
const Campground = require('./models/campground')

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

const app = express();

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

app.engine('ejs', engine); // use ejs-mate instead of ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.get('/', (req, res) => {
    res.render('home');
})

app.get('/campgrounds', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}))

app.get('/campgrounds/new', async (req, res) => {
    res.render('campgrounds/new');
})

app.post('/campgrounds', catchAsync(async (req, res, next) => {
    if(!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
    const newCampground = new Campground(req.body.campground);
    await newCampground.save();
    res.redirect(`/campgrounds/${newCampground._id}`);
    
}))

app.get('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/show', { campground });
}))

app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit', { campground });
}))

app.put('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground});
    res.redirect(`/campgrounds/${campground._id}`);

}))

app.delete('/camPgrounds/:id', catchAsync(async(req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}))

app.all('*', (res, req, next) => {
    next(new ExpressError('Page Not Found', 404));
})  

app.use((err, req, res, next) => {
    const{ statusCode = 500} = err;
    if(!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err }); 
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
})