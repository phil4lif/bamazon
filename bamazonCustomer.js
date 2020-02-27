//global variable requires
var mysql = require("mysql");
var inquirer = require("inquirer");
require("console.table");
//my sql connection
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
//this function runs as soon as the user runs the app
//it will log the full list of items and their respective id and price
function displayItems() {
    console.log("Retrieving Product Database...\n")
    var query = connection.query(
        `SELECT * FROM products`, function (err, res) {
            if (err) throw err;

            console.table(res)
            // for (var i = 0; i < res.length; i++) {
            //     var log = "-------\nProduct ID: " + res[i].id + "\nName: " + res[i].product_name + "\nPrice: " + res[i].price;
            //     console.log(log);
            // }
            //Now that the user has seen all of the available items, inquirer will ask them what they'd like to buy
            //and how many of that item they'd like to buy
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
                //saving user responses in variables
                var what = answer.what;
                var howMany = answer.howmany;
                //a new query to the database that is looking for the item they've selected to purchase
                var query = connection.query(`SELECT * FROM products WHERE id = '${what}'`, function (err, res) {
                    if (err) throw err;
                    
                    var deptName = res[0].department_name;
                    console.log(deptName)

                    // console.log(res);
                    // console.log(res[0].product_name)
                    // console.log(res[0].stock_quantity + "  " +howMany)

                    //new variable with the items available quantity
                    var availProd = res[0].stock_quantity
                    //check to see if there is enough avaliable
                    if (howMany > availProd) {
                        //if there is not enough
                        console.log("Insufficient Quantity")
                        displayItems();
                    } else {
                        var totalCost = howMany * res[0].price;
                        console.log("Your order comes to a grand total of: $" + totalCost);
                        var newStock = availProd - howMany;
                        // console.log(newStock);
                        //if there is enough the transaction will be approved the database stock_quantity must be updated
                        // console.log("updating quantities in database");
                        var query = connection.query(
                            `UPDATE products SET stock_quantity = '${newStock}' WHERE id = '${what}'`,
                            function (err, res) {
                                if (err) throw err;
                                var query = connection.query(
                                    `UPDATE departments SET product_sales = product_sales + '${totalCost}' WHERE department_name = '${deptName}'`, function(err, res){
                                        if (err) throw err;

                                        console.table(res)
                                    } 

                                )
                                console.log(query.sql)
                                // console.log(res.affectedRows + " products updated!\n");
                                displayItems();
                            }
                        );



                    }
                    // connection.end()
                }
                )
            })
        })

        console.log(query.sql)
};