---
layout: exercise
permalink: /Modules/SQL/Aggregation/Exercise
title: "CS377: Database Design - SQL Aggregation"
language: "sql"

info:
  points: 3
  instructions: "Modify the Aggregation.sql file to answer the database questions below."
  goals:
    - To write a SQL statement performing an aggregated query
    
canvascourseid: "12345"
canvasasmtid: "181955"   
canvaspoints: 3
  
processor:  
  correctfeedback: "Correct!!" 
  incorrectfeedback: "Try again"
  submitformlink: false
  feedbackprocess: | 
    var pos = feedbackString;
  correctcheck: |
    pos.toLowerCase().includes(String.raw`[{"columns":["NumGrocery"],"values":[[7]]}]`.toLowerCase()) && pos.toLowerCase().includes(String.raw`[{"columns":["ProductType","NumItems"],"values":[["Grocery",7],["Produce",15],["Household",20]]}]`.toLowerCase()) && pos.toLowerCase().includes(String.raw`[{"columns":["AvgCostProduce"],"values":[[0.4]]}]`.toLowerCase()) && pos.toLowerCase().includes(String.raw`[{"columns":["ProductType","AvgCost"],"values":[["Grocery",3.25],["Household",1.75],["Produce",0.4]]}]`.toLowerCase())
 
files:
  - filename: "Aggregation.sql"
    name: aggregation
    ismain: false
    isreadonly: false
    isvisible: true
    code: | 
        -- TODO: How many grocery items are there (where type is Grocery)?  Call the column NumGrocery.  
        -- HINT: The answer is [{"columns":["NumGrocery"],"values":[[7]]}]
        
        -- TODO: How many of each item is there (use only one query!)?  Call the column NumItems, and sort in increasing order by the number of items.  Don't forget to include the ProductType column so you know which quantity goes with which type of item!  
        -- HINT: The answer is [{"columns":["ProductType","NumItems"],"values":[["Grocery",7],["Produce",15],["Household",20]]}]
        
        -- TODO: What is the average cost of produce items? Call the column AvgCostProduce. 
        -- HINT: The answer is [{"columns":["AvgCostProduce"],"values":[[0.4]]}]
        
        -- TODO: What is the average cost of each type of item (use only one query!)?  Call the column AvgCost and sort in decreasing order by the average cost.  Don't forget to include the ProductType column so you know which quantity goes with which type of item! 
        -- HINT: The answer is [{"columns":["ProductType","AvgCost"],"values":[["Grocery",3.25],["Household",1.75],["Produce",0.4]]}]

  - filename: "Main.sql"
    ismain: true
    name: main
    isreadonly: true
    isvisible: true
    code: |
      CREATE TABLE INVENTORY (
        ID int, 
        ProductType text,
        ProductName text, 
        Price float,
        Quantity int
      );
     
      INSERT INTO INVENTORY VALUES (1, "Produce", "Banana", 0.30, 5);             
      INSERT INTO INVENTORY VALUES (2, "Household", "Bleach", 2.50, 10);
      INSERT INTO INVENTORY VALUES (3, "Grocery", "Milk", 2.50, 3);
      INSERT INTO INVENTORY VALUES (4, "Grocery", "Orange Juice", 4, 4);
      INSERT INTO INVENTORY VALUES (5, "Produce", "Apple", 0.5, 10);
      INSERT INTO INVENTORY VALUES (6, "Household", "Legal Pad", 1.00, 10);
      
---
