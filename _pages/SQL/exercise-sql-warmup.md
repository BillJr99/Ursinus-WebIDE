---
layout: exercise
permalink: /Modules/SQL/Warmup/Exercise
title: "CS377: Database Design - Introduction to Databases"
language: "sql"

info:
  points: 3
  instructions: "Modify the MyFirstStatement.sql file to insert the number 42 into the table, and then to retrieve it."
  goals:
    - To become familiar with the basic structure of a database
    - To write a SQL statement
    
canvasasmtid: "181953"   
canvaspoints: 3
  
processor:  
  correctfeedback: "Correct!!" 
  incorrectfeedback: "Try again"
  submitformlink: false
  feedbackprocess: | 
    var pos = feedbackString;
  correctcheck: |
    pos.toLowerCase().includes(String.raw`[{"columns":["a"],"values":[[42]]}]`.toLowerCase())
 
files:
  - filename: "MyFirstStatement.sql"
    name: myfirststatement
    ismain: false
    isreadonly: false
    isvisible: true
    code: | 
        -- TODO: insert a value into the mytable database table
        -- TODO: retrive the value from the table
        -- HINT: The answer is [{"columns":["a"],"values":[[42]]}]

  - filename: "Setup.sql"
    ismain: true
    name: main
    isreadonly: true
    isvisible: true
    code: |
        CREATE TABLE mytable (a int);
        
---
