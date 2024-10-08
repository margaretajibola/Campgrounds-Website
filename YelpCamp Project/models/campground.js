const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');

const CamgroundSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

CamgroundSchema.post('findOneAndDelete', async function (doc) {
    if(doc){
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        }) 
    }
})
module.exports = mongoose.model('Campground', CamgroundSchema);