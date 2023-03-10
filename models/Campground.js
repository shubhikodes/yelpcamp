const mongoose=require('mongoose')
const Review=require('./reviews')
const Schema=mongoose.Schema

const ImageSchema = new Schema({
    url : String,
    filename : String
})

ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload','/upload/w_300,h_300');
})

const opts = { toJSON: { virtuals : true} };

const CampgroundSchema = new Schema({
    title:String,
    images:[ImageSchema],
    geometry: {
        type:{
            type:String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price:Number,
    description:String,
    location:String,
    author:{
        type : Schema.Types.ObjectId,
        ref : 'User'
    },
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:'Review'
    }]
}, opts)


CampgroundSchema.virtual('properties.popUpMarkup').get(function(){
  
    return `<strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>`;
})


CampgroundSchema.post('findOneAndDelete', async function(campground){
    if(campground)
    {
        await Review.deleteMany({
            _id:{
                $in:campground.reviews
            }
        })
    }
})

const Campground=mongoose.model('Campground',CampgroundSchema)

module.exports = Campground








