function sum( a, b ){
    return a+b;
}

// Arrow Funtion type 1
const suma = ( a,b) =>{
    return a+b;
}

// Arrow Funtion type 2
exports.sumb = (a,b)=>a+b;
exports.sum = sum;
exports.suma = suma;

// /Exporting Functions...
// module.exports = {
//     sum,
//     suma    
// };

console.log(process)