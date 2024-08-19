---
layout: exercise_r
permalink: /Modules/R/QuadraticExercise
title: "CS173: Intro to Computer Science - R Quadratic Equation"
language: "r"

info:
  points: 0
  instructions: "Use the terminal below to print the roots of a quadratic polynomial with coefficients a=1, b=2, and c=1."
  goals:
    - To write a program using the R programming language
    - To write mathematical expressions using the R programming language
  
canvascourseid: "12345"
canvasasmtid: ""
canvaspoints: 0
  
processor:  
  correctfeedback: "Correct!!" 
  incorrectfeedback: "Try again"
  submitformlink: false
  feedbackprocess: | 
    var pos = feedbackString.trim();
  correctcheck: |
    pos.includes("-1 -1")
        
---

<!-- permalink was /Modules/R/; permalink once had to be /assets/js/R/ to allow loading of associated assets from the current directory -->
