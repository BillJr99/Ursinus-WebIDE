---
layout: exercise
permalink: /Modules/Prolog/Warmup/Exercise
title: "CS374: Principles of Programming Languages - Warmup with Prolog"
language: "prolog"

info:
  points: 3
  instructions: "Run this prolog program."
  goals:
    - To write a Scheme statement
    
canvasasmtid: "181953"   
canvaspoints: 3
  
processor:  
  correctfeedback: "Correct!!" 
  incorrectfeedback: "Try again"
  submitformlink: false
  feedbackprocess: | 
    var pos = feedbackString.toString();
  correctcheck: |
    pos.toLowerCase().includes("yes")
 
files:
  - filename: "first.pl"
    name: first
    ismain: false
    isreadonly: false
    isvisible: true
    code: | 
      ?-take_before(CS173, CS374). 
  - filename: "main.pl"
    ismain: true
    name: main
    isreadonly: true
    isvisible: true
    code: |
      course(CS173).
      course(CS174).
      course(CS374).
      course(CS475).
     
      prereq(CS174, CS173).
      prereq(CS374, CS174).
             
      take_before(X, Y) :- prereq(Z, Y), take_before(X, Z). 
---