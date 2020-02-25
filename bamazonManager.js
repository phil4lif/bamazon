//global variable requires
var mysql = require("mysql");
var inquirer = require("inquirer");
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

function runApp() {
    inquirer.prompt(
        {
            name: "menu",
            type: "list",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product","Exit"],
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
            case "Exit":
                connection.end();
                break;


        }
    })
}
function displayItems() {
    console.log("Retrieving Product Database...\n")
    var query = connection.query(
        `SELECT * FROM products`, function (err, res) {
            if (err) throw err;
            for (var i = 0; i < res.length; i++) {
                var log = "-------\nProduct ID: " + res[i].id + "\nName: " + res[i].product_name + "\nPrice: " + res[i].price;
                console.log(log);
            }
        runApp();
        }
    )
};
function viewLowInventory() {
    console.log("Retrieving Low Inventory...\n")
    var query = connection.query(
        `SELECT * FROM products WHERE stock_quantity < 5`, function (err, res) {
            if (err) throw err;
            console.log("We have fewer than 5 in stock of the following...\n")
            for (var i = 0; i <res.length; i++){
                var log = res[i].product_name;
                console.log(log + "\n");
            }
            runApp();
        }
    )
};
function addToInventory() {
    inquirer.prompt([
        {
            name:"whichItem",
            message:"Please enter the id of the number that you would like to add to the inventory",
            type: "input"
        },
        {
            name:"howmany",
            message:"Please enter the quantity that you would like to add to the existing inventory",
            type:"input"
        }
    ]).then(function (answer){
        var what = answer.whichItem;
        var howMany = answer.howmany;
        var newInventory ;
        var query = connection.query(`SELECT * FROM products WHERE id = '${what}'`, function (err, res){
            if (err) throw err;
            console.log(res[0].stock_quantity);
            newInventory = res[0].stock_quantity + howMany;
        })
        var query = connection.query(
            `UPDATE products SET stock_quantity = '${newInventory}' WHERE id = '${what}'`,
            function (err, res) {
                if (err) throw err;
                console.log(res.affectedRows + " products updated!\n");
                runApp();
            }
        );
    })
}