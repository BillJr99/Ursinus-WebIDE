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
    pos.toLowerCase().includes("true")
 
files:
  - filename: "first.pl"
    name: first
    ismain: false
    isreadonly: false
    isvisible: true
    code: | 
      take_before(CS173, CS374). 
	  take_before(X, CS374).
	  take_before(CS173, X).
	  take_before(X, Y).
	  
  - filename: "main.pl"
    ismain: true
    name: main
    isreadonly: true
    isvisible: true
    code: |
      assert(course(CS173)).
      assert(course(CS174)).
      assert(course(CS374)).
      assert(course(CS475)).
     
      assert(prereq(CS174, CS173)).
      assert(prereq(CS374, CS174)).
             
      assert(take_before(X, Y) :- prereq(Z, Y), take_before(X, Z)). 
---