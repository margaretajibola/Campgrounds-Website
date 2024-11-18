if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const engine = require('ejs-mate')
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User =  require('./models/user');

const campgroundsRoutes = require('./routes/campgrounds');
const reviewsRoutes = require('./routes/reviews');
const usersRoutes = require('./routes/users');

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
app.use(express.static(path.join(__dirname, 'public')));

const sessionConfig = {
    secret: 'thishouldbeabettersecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session()); // should be used after session
passport.use(new LocalStrategy(User.authenticate())); //use the local strategy to authenticate

passport.serializeUser(User.serializeUser()); //how to store user in session
passport.deserializeUser(User.deserializeUser()); //how to unstore user in session

app.engine('ejs', engine); // use ejs-mate instead of ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use((req, res, next) => {
    // console.log(req.session)
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

// app.get('/fakeUser', async(req, res) => {
//     const user = new User({email: 'mags56@yahoo.com', username: 'mags'});
//     const newUser = await User.register(user, 'solana');
//     res.send(newUser);
// })


app.use('/', usersRoutes);
app.use('/campgrounds', campgroundsRoutes)
app.use('/campgrounds/:id/reviews', reviewsRoutes)

app.get('/', (req, res) => {
    res.render('home');
})

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