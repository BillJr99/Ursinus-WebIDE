---
layout: exercise
permalink: /Modules/SQL/Join/Exercise
title: "CS377: Database Design - SQL Joins"
language: "sql"

info:
  points: 3
  instructions: "Modify the MyFirstStatement.sql file to answer the database questions below."
  goals:
    - To write a SQL Join statement
    
canvasasmtid: "181959"   
canvaspoints: 3
  
processor:  
  correctfeedback: "Correct!!" 
  incorrectfeedback: "Try again"
  submitformlink: false
  feedbackprocess: | 
    var pos = feedbackString;
  correctcheck: |
    pos.toLowerCase().includes(String.raw`[{"columns":["FirstName","LastName","Address"],"values":[["Alex","Smith","123 Main Street"],["Susan","Smith","123 Main Street"],["Samantha","Lee","234 Main Street"],["Alex","Lee","234 Main Street"],["Steph","Lee","234 Main Street"]]}]`.toLowerCase()) && pos.toLowerCase().includes(String.raw`[{"columns":["Address","HouseholdSalary"],"values":[["234 Main Street",70000],["12 Third Street",40000],["123 Main Street",25000]]}]`.toLowerCase()) && pos.toLowerCase().includes(String.raw`[{"columns":["Zip","HouseholdSalary"],"values":[["19426",130000],["19406",40000]]}]`.toLowerCase())
 
files:
  - filename: "MyJoins.sql"
    name: myjoins
    ismain: false
    isreadonly: false
    isvisible: true
    code: | 
        -- TODO: list all people that live in the 19426 zip code
        -- HINT: The answer is [{"columns":["FirstName","LastName","Address"],"values":[["Alex","Smith","123 Main Street"],["Susan","Smith","123 Main Street"],["Samantha","Lee","234 Main Street"],["Alex","Lee","234 Main Street"],["Steph","Lee","234 Main Street"]]}]
        
        -- TODO: List the average household salary of the people living in each house (call this column HouseholdSalary), sorted in descending order by salary
        -- HINT: The answer is [{"columns":["Address","HouseholdSalary"],"values":[["234 Main Street",70000],["12 Third Street",40000],["123 Main Street",25000]]}]
        
        -- TODO: List the average total household salary (call this column HouseholdSalary) by zip code, in descending order by salary
        -- HINT: The answer is [{"columns":["Zip","HouseholdSalary"],"values":[["19426",130000],["19406",40000]]}]
        -- HINT: You will need a sum of salaries for the inner subquery, and then take the average of those by zip code!

  - filename: "Main.sql"
    ismain: true
    name: main
    isreadonly: true
    isvisible: true
    code: |
      CREATE TABLE PERSON (
        ID int, 
        FirstName text, 
        LastName text, 
        Age int,
        Salary float
      );

      CREATE TABLE HOUSE (
        ID int, 
        Address text, 
        City text, 
        State text,
        ZIP text
      );

      CREATE TABLE HOUSEHOLDMEMBER (
        ID int, 
        HouseID int,
        PersonID int
      );
     
      INSERT INTO PERSON VALUES (1, "Alex", "Smith", 20, 20000);
      INSERT INTO PERSON VALUES (2, "Susan", "Smith", 22, 30000);

      INSERT INTO PERSON VALUES (3, "Samantha", "Lee", 50, 100000);
      INSERT INTO PERSON VALUES (4, "Alex", "Lee", 49, 110000);
      INSERT INTO PERSON VALUES (5, "Steph", "Lee", 15, 0);

      INSERT INTO PERSON VALUES (6, "Stephen", "Johnson", 29, 40000);

      INSERT INTO HOUSE VALUES (1, "123 Main Street", "Collegeville", "PA", "19426");
      INSERT INTO HOUSE VALUES (2, "234 Main Street", "Collegeville", "PA", "19426");
      INSERT INTO HOUSE VALUES (3, "12 Third Street", "King of Prussia", "PA", "19406");

      INSERT INTO HOUSEHOLDMEMBER VALUES (1, 1, 1);
      INSERT INTO HOUSEHOLDMEMBER VALUES (2, 1, 2);

      INSERT INTO HOUSEHOLDMEMBER VALUES (3, 2, 3);
      INSERT INTO HOUSEHOLDMEMBER VALUES (4, 2, 4);
      INSERT INTO HOUSEHOLDMEMBER VALUES (5, 2, 5);

      INSERT INTO HOUSEHOLDMEMBER VALUES (6, 3, 6);
              
---
