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
    runApp();
});

function runApp() {
    inquirer.prompt(
        {
            name: "menu",
            type: "list",
            choices: ["View Product Sales By Department", "Create New Department", "Exit"],
            message: "What would you like to do?"
        }
    ).then(function (answer) {
        var action = answer.menu;
        switch (action) {
            case "View Product Sales By Department":
                salesByDept();
                break;
            case "Create New Department":
                newDepartment();
                break;
            case "Exit":
                connection.end();
                return
        }
    });
}
function salesByDept() {
    // var totalProfit;
    // var profitArr = []
    var query = connection.query(`SELECT * FROM departments`, function (err, res) {
        if (err) throw err;
        console.table(res)

        // for (var i = 0; i < res.length; i++) {
            // totalProfit = res[i].product_sales - res[i].over_head_costs
            // console.log(totalProfit)
            // profitArr.push(totalProfit);
        // }
        // console.log(profitArr)
        // var query = connection.query(`UPDATE departments SET total_profits = product_sales - over_head-costs`, function (err, res){
        //     if (err) throw err;
        //     console.table(res)
        // })

        // console.log(totalProfit)
        // var query = connection.query(`CREATE TEMPORARY TABLE profits(id AUTO INCREMENT NOT NULL PRIMARY KEY, total_profits)`, function (err, res) {
        //     if (err) throw err;
        //     console.table(res)
        //     var query = connection.query(`INSERT INTO profits(total_profits) VALUES= '${profitArr}' AS total_profit`, function (err, res) {
        //         if (err) throw err;
        //         // console.table(res)
        //         var query = connection.query(`SELECT * FROM departments INNER JOIN profits.total_profits`, function (err, res_){
        //             if (err) throw err;
        //             console.log("in")
        //             console.table(res);
        //         })
        //     })
        // })


        // console.table(res)
        runApp();
    });
}

function newDepartment() {
    inquirer.prompt([
        {
            name: "department_name",
            message: "What is the name of the new department?",
            type: "input"
        },
        {
            name: "over_head_costs",
            message: "What is the overhead of this new department?",
            type: "number"
        }
    ]).then(function (answer) {
        var deptName = answer.department_name;
        var overHead = answer.over_head_costs;
        var query = connection.query(`INSERT INTO departments (department_name, over_head_costs) VALUES('${deptName}', '${overHead}')`, function (err, res) {
            if (err) throw err;
            console.log("New Department Added to Table")
            salesByDept();
        })
    })
};