// Normal way to Include MyModules. Entire module is available in MyModules CONST and individual functions can be accessed by doing MyModules.FN
// const MyModules = require( "./MyModules/helpers.js");


// let x = MyModules.sum( 2, 3 );
// console.log( x)

// let y = MyModules.suma( 3, 4 );
// console.log( y)

// let Z = MyModules.sumb( 4, 5 );
// console.log( Z)

// Object Destructuring : We dont need to explicitly give the name of the MOdule ( MyModules). Instead we "DeStructure" functions we need in a particualr module and call them direcctly.
const { sum, suma, sumb } = require("./MyModules/helpers");

    let x = sum( 2, 3 );
    console.log( x)

    let y = suma( 3, 4 );
    console.log( y)

    let Z = sumb( 4, 5 );
    console.log( Z)