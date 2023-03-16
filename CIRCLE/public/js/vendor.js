// import axios from 'axios';


const addMeAsVendorForProduct = async (pId, myName, myEmail, condition, cp, purDate, sp ) => {
    try {
        // console.log(email, password);
        // alert('adding product final call... [' + pId + '][' + myName + '][' + myEmail + ']['+ condition + '][' +cp + '][' + purDate + '][' + sp + ']' );
        // alert( 'other data [' + res.locals.user.name + ']' );
        const res = await axios({
            method: 'POST',
            url: 'http://localhost:4000/api/v1/products/addVendor',
            data: {
                prodId : pId,
                vname: myName,
                vemail: myEmail,
                datePurchased: purDate,
                condition: condition,
                costPrice: cp,
                sellingPrice: sp,
                sold: false,
            },
        });

        console.log(res);
        if (res.data.status === 'success') {
            alert('New product created!!');
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



document.querySelector('.addMeAsVendor').addEventListener('submit', (e) => {
    e.preventDefault();
    const prodCondition = document.getElementById('newProductCondition').value;
    const prodCosrPrice = document.getElementById('newProductCostPrice').value;
    const prodPurchaseDate = document.getElementById('newProductPurchaseDate').value;
    const prodSellingPrice = document.getElementById('newProductSellingPrice').value;
    // alert('adding me as product vendor Stage 1' );
    const prodMyName = document.getElementById('myName').innerHTML;
    // alert('from PUG name [' + prodMyName + ']' );
    const prodMyEmail = document.getElementById('myEmail').innerHTML;
    // alert('from PUG email [' + prodMyEmail + ']' );
    const prodId = document.getElementById('productId').innerHTML;
    // alert('from PUG PID [' + prodId + ']' );
    addMeAsVendorForProduct(prodId, prodMyName, prodMyEmail, prodCondition, prodCosrPrice, prodPurchaseDate, prodSellingPrice);
});
