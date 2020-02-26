DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
  id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(45) NOT NULL,
  department_name VARCHAR(45) NOT NULL,
  price DECIMAL(10,2) NULL,
  stock_quantity INTEGER(10) NOT NULL,
  PRIMARY KEY (id)
  );
  
CREATE TABLE departments (
id INT NOT NULL AUTO_INCREMENT,
department_name VARCHAR(30) NOT NULL,
over_head_costs INTEGER(10) NOT NULL,
PRIMARY KEY (id)
);

SELECT * FROM departments;

ALTER TABLE departments
ADD product_sales INTEGER(10);

SELECT * FROM products;

