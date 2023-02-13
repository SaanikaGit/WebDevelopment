const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A Product must have a Name'],
        unique: true,
        trim: true,
    },
    category: {
        type: String,
        required: [true, 'A Product must have a Category'],
        trim: true,
    },
    subject: {
        type: String,
        required: [true, 'A Product must have a Subject'],
        trim: true,
    },
    grade: {
        type: String,
        required: [true, 'A Product must have a Grade'],
        trim: true,
    },
    isbn: {
        type: String,
        trim: true,
    },
    imageCover: {
        type: String,
        required: [true, 'A Product must have a cover image'],
    },
    vendors: [
        {
            vname: String,
            vemail: String,
            datePurchased: Date,
            condition: String,
            costPrice: Number,
            sellingPrice: Number,
            vendorImage: String,
            listingDate: {
                type: Date,
                default: Date.now(),
            },
            requested: Boolean,
            sold: Boolean,
        },
    ],
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
