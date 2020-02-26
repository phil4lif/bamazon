//global variable requires
var mysql = require("mysql");
var inquirer = require("inquirer");
require("console.table")
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
    runApp();
});
//the function that will rrun once the connection is made to the server
//this function prompts the manager with a what would you like to do list
function runApp() {
    inquirer.prompt(
        {
            name: "menu",
            type: "list",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"],
            message: "What would you like to do?"
        }
    ).then(function (answer) {
        var action = answer.menu;
        // console.log(answer);
        switch (action) {
            case "View Products for Sale":
                displayItems();
                break;
            case "View Low Inventory":
                viewLowInventory();
                break;
            case "Add to Inventory":
                addToInventory();
                break;
            case "Add New Product":
                addNewProduct();
                break;
            case "Exit":
                 connection.end();
                return      
        }
    })
}
//this function will show the manager all of the items in the database
function displayItems() {
    console.log("Retrieving Product Database...\n")
    var query = connection.query(
        `SELECT * FROM products`, function (err, res) {
            if (err) throw err;
            console.table(res);
            // for (var i = 0; i < res.length; i++) {
            //     var log = "-------\nProduct ID: " + res[i].id + "\nName: " + res[i].product_name + "\nPrice: " + res[i].price;
            //     console.log(log);
        // }
            //and then run the app again
            runApp();
}
    )
};
//this function will log all the items that have fewer than 5 left in the stock_quantity
function viewLowInventory() {
    console.log("Retrieving Low Inventory...\n")
    var query = connection.query(
        `SELECT * FROM products WHERE stock_quantity < 5`, function (err, res) {
            if (err) throw err;
            console.log("We have fewer than 5 in stock of the following...\n")
            for (var i = 0; i < res.length; i++) {
                var log = res[i].product_name;
                console.log(log + "\n");
            }
            //and run the app again
            runApp();
        }
    )
};
//this function allows the manager to restock the inventory of an item
function addToInventory() {
    inquirer.prompt([
        {
            name: "whichItem",
            message: "Please enter the id of the number that you would like to add to the inventory",
            type: "input"
        },
        {
            name: "howmany",
            message: "Please enter the quantity that you would like to add to the existing inventory",
            type: "input"
        }
    ]).then(function (answer) {
        var what = answer.whichItem;
        var howMany = answer.howmany;
        howMany = parseInt(howMany)
        var newInventory;
        var query = connection.query(`SELECT * FROM products WHERE id = '${what}'`, function (err, res) {
            if (err) throw err;
            // console.log(res[0].stock_quantity);
            newInventory = res[0].stock_quantity + howMany;
            // console.log(newInventory);
            var query = connection.query(
                `UPDATE products SET stock_quantity = '${newInventory}' WHERE id = '${what}'`,
                function (err, res) {
                    if (err) throw err;
                    console.log(res.affectedRows + " products updated!\n");
                    //and run the app again
                    runApp();
                }
            );
        })
    })
}
//this function will allow the manager to add a completely new product to the store
function addNewProduct() {
    inquirer.prompt([
        {
            name: "what",
            message: "What would you like to add to the store?",
            type: "input"
        },
        {
            name: "department",
            message: "Which department does this go in?",
            type: "input"
        },
        {
            name: "price",
            message: "How much is it for one?",
            type: "input"
        },
        {
            name: "inventory",
            message: "How many of these do we have available?",
            type: "input"
        }
    ]).then(function (answer) {
        var what = answer.what;
        var dept = answer.department;
        var price = answer.price;
        var inventory = answer.inventory;
        var query = connection.query(`INSERT INTO products (product_name, department_name, price, stock_quantity)
        VALUES ('${what}', '${dept}', '${price}', '${inventory}')`, function (err, res) {
            if (err) throw err;
            console.log("New product added to the database");
            //invoke the display items function so we can see that the new item has in fact been added to our database
            displayItems();
            runApp();
        })
    })

}


