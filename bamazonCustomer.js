var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon"
});
connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    displayItems();
});

function displayItems() {
    console.log("Retrieving Product Database...\n")
    var query = connection.query(
        `SELECT * FROM products`, function (err, res) {
            if (err) throw err;
            for (var i = 0; i < res.length; i++) {
                var log = "Product ID: " + res[i].id + "\nName: " + res[i].product_name + "\nPrice: " + res[i].price;
                console.log(log);
            }
            // connection.end();

            inquirer.prompt([
                {
                    name: "what",
                    type: "input",
                    message: "Please enter the id number of the item that you would like to purchase"
                },
                {
                    name: "howmany",
                    type: "input",
                    message: "How many of this item would you like to buy?"
                }
            ]).then(function (answer) {
                var what = answer.what;
                var howMany = answer.howmany;
                var query = connection.query(`SELECT * FROM products WHERE id = '${what}'`, function (err, res) {
                    if (err) throw err;
                    // console.log(res);
                    // console.log(res[0].product_name)
                    // console.log(res[0].stock_quantity + "  " +howMany)
                    var availProd = res[0].stock_quantity
                    if (howMany > availProd) {
                        console.log("Insufficient Quantity")
                    }
                    connection.end()
                }
                )
            })
        })
};