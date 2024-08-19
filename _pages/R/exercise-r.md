---
layout: exercise_r
permalink: /Modules/R/TutorialExercise
title: "CS173: Intro to Computer Science - R"
language: "r"

info:
  points: 0
  instructions: "Use the terminal below to print Hello World to yourself, without any punctuation."
  goals:
    - To write a program using the R programming language
  
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
    pos.includes("Hello World")
        
---

<!-- permalink was /Modules/R/; permalink once had to be /assets/js/R/ to allow loading of associated assets from the current directory -->
