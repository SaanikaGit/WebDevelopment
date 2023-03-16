// import axios from 'axios';


const addProductSettings = async (myName, myEmail, name, category, subject, grade, imageCover, condition, cp, purDate, sp ) => {
    try {
        // console.log(email, password);
        // alert('adding product final call... [' + myName + '][' + myEmail + '][' + name + '][' + category + '][' + grade + '][' + imageCover + ']['+ condition + '][' +cp + '][' + purDate + '][' + sp + ']' );
        // alert( 'other data [' + res.locals.user.name + ']' );
        const res = await axios({
            method: 'POST',
            url: 'http://localhost:4000/api/v1/products/create',
            data: {
                name : name,
                category : category,
                subject : subject,
                grade : grade,
                imageCover : imageCover,
                vendors :{
                    vname: myName,
                    vemail: myEmail,
                    datePurchased: purDate,
                    condition: condition,
                    costPrice: cp,
                    sellingPrice: sp,
                    sold: false,
                }
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



document.querySelector('.meSettingsAddProduct').addEventListener('submit', (e) => {
    e.preventDefault();
    const prodName = document.getElementById('productName').value;
    const prodCategory = document.getElementById('newProductCategory').value;
    const prodSubject = document.getElementById('newProductSubject').value;
    const prodGrade = document.getElementById('newProductGrade').value;
    const prodImage = document.getElementById('newProductImage').value;
    // alert('adding product stage1 Name..[' + prodName + ']' );
    const prodCondition = document.getElementById('newProductCondition').value;
    const prodCosrPrice = document.getElementById('newProductCostPrice').value;
    const prodPurchaseDate = document.getElementById('newProductPurchaseDate').value;
    const prodSellingPrice = document.getElementById('newProductSellingPrice').value;
    // alert('adding product stage1 Image..[' + prodImage + ']' );
    const prodMyName = document.getElementById('myName').innerHTML;
    // alert('from PUG name [' + prodMyName + ']' );
    const prodMyEmail = document.getElementById('myEmail').innerHTML;
    // alert('from PUG email [' + prodMyEmail + ']' );
    const filename =prodImage.replace(/^.*\\/, "");
    addProductSettings(prodMyName, prodMyEmail, prodName, prodCategory, prodSubject, prodGrade, filename, prodCondition, prodCosrPrice, prodPurchaseDate, prodSellingPrice );
});

document.querySelector('.signUp').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('signUpName').value;
    const email = document.getElementById('signUpEmail').value;
    const password = document.getElementById('signUpPassword').value;
    const passwordConfirm = document.getElementById(
        'signUpPasswordConfirm'
    ).value;
    signUp(name, email, password, passwordConfirm);
});

