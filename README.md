# bamazon

This is a store front that runs from the command line.  There are three ways to run the app
as a customer, manager, or supervisor.

To run the app, type `node bamazoncustomer.js`, `bamazonmanager.js`, or `bamazonsupervisor.js`

Depending on which file is run the user will be prompted for some input.

The customer is able to select an item and quantity to purchase, and then will be shown their order total.

The Manager will have the option to view the table of everything for sale, to view products that are low on inventory, add to their inventory, or add an entirely new product to the database.

The supervisor file will allow the user to view sales by department, which will display a different table for the data base than the other users see, it also allows the supervisor to add a new departmet to the table.


This application uses node, mySQL, and inquirer.

Please see the following video for a walkthrough of the application
https://drive.google.com/file/d/1_9wW9gLrP1aYhMscTmvjzT2aCXyZ6ZCT/view