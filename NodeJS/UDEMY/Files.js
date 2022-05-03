const fs = require('fs');

const fileName = "watch.txt";

const printFile = (source) => {
    fs.readFile(fileName, (err, data) => {
        if (err) {
            console.log(err);
        }
        if (source == 1) {
            console.log("MSG Type 2.1: Output File Original-> -----------------")
        }
        else {
            console.log("MSG Type 2.2: Output File Changed-> ------------------")
        }
        console.log(data.toString());
        console.log("------------------------------------------------------")
    });
};

// Demonstrating Async execution 
printFile(1);
fs.watch(fileName, () => { console.log("MSG Type 1: File changed... "); printFile(2); });

console.log("MSH Type 3: Generally Waiting...");