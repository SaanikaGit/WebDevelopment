// import axios from 'axios';
// const Product = require('../models/productModel');
const searchProducts = async (searchStr ) => {
    try {
            const loc = '/Search/' + searchStr;
            if ( searchStr) {
                // alert('diverting to [' +loc + ']');
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

document.querySelector('.midMainNav').addEventListener('submit', (e) => {
    e.preventDefault();
    // alert('JS - search' );
    const searchStr = document.getElementById('navSearchStr').value;
    // alert('from PUG Searching for [' + searchStr + ']' );
    searchProducts(searchStr);
});
