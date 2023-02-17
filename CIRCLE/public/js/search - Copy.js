// import axios from 'axios';
// const Product = require('../models/productModel');
const searchProductsTT = async (searchStr ) => {
    try {
            const loc = '/tt/' + searchStr;
            if ( searchStr) {

                window.setTimeout(() => {
                    location.assign(loc);
                }, 1500);
            }
            else {
                alert( 'No search criterion provided');
            }

        
    } catch (err) {
        console.log(err);
        alert(err);
        alert(err.response.data.message);
    }
};


const searchProducts = async (searchStr ) => {
    try {
        // console.log(email, password);
        alert('searching products matching ->[' + searchStr + ']' );
        const res = await axios({
            method: 'POST',
            url: 'http://localhost:4000/Search',
            data: {
                searchStr,
            },
        });
        alert('after axios call');
        console.log('after axios call');
        // alert( res);
        // alert(res.locals.products.lenght);
        if (res.data.status === 'success') {
            alert('Search Done - about to display');
            window.setTimeout(() => {
                location.assign('/');
            }, 1500);
        }
    } catch (err) {
        console.log(err);
        alert(err);
        alert(err.response.data.message);
    }
};

const searchProductsInternal = async (searchStr ) => {
    try {
        // const products = await Product.find({grade: {$regex: new RegExp(searchStr,'i' )}});
        const products = await Product.find({$or: [
            {name: {$regex: new RegExp(searchParam,'i' )}},
            {subject: {$regex: new RegExp(searchParam,'i' )}}]});
        alert ('Search found results ')
        res.status(400).render('overview', {
            title: 'Search REsults',
            products,
        });

    } catch (err) {
        console.log(err);
        alert('Unable to GET product info-> ' + err);
        // next(new AppError('Unable to GET product info-> ' + err, 400));
    }
};

document.querySelector('.midMainNav').addEventListener('submit', (e) => {
    e.preventDefault();
    alert('JS - search' );
    const searchStr = document.getElementById('navSearchStr').value;
    alert('from PUG Searching for [' + searchStr + ']' );
    searchProductsTT(searchStr);
});
