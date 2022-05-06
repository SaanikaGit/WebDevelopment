// MOngo DB commands


// NOrmal DB -> MONGO
// Table -> Collection
// Rows -> collection

// Set current Database
use sansDance

// Insert 1 document in a collection called "items"
db.items.insertOne({name:"Samsung M32", price: 15000, rating:1, qty:100, sold:10})


// Insert Many documents - USer array notation
db.items.insertMany([{name:"Iphone 6", price: 75000, rating:1, qty:10, sold:5}, {name:"One Plus 6T", price: 35000, rating:5, qty:100, sold:50}])