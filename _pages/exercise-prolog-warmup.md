---
layout: exercise
permalink: /Modules/Prolog/Warmup/Exercise
title: "CS374: Principles of Programming Languages - Warmup with Prolog"
language: "prolog"

info:
  points: 3
  instructions: "Run this prolog program."
  goals:
    - To read a Prolog statement
    
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
      take_before(cs173, cs374). 
      take_before(X, cs374).
      take_before(cs173, X).
      take_before(X, Y).
      
  - filename: "main.pl"
    ismain: true
    name: main
    isreadonly: true
    isvisible: true
    code: |
      % Enter facts
      assertz(course(cs173)).
      assertz(course(cs174)).
      assertz(course(cs374)).
      assertz(course(cs475)).

      % Prerequisite relationships
      assertz(prereq(cs173, cs174)).
      assertz(prereq(cs174, cs374)).

      % Base case: Direct prerequisite relationship
      assertz((take_before(X, Y) :- prereq(X, Y))).

      % Recursive case: X must be taken before Y if X is a prerequisite of Z and Z must be taken before Y
      assertz((take_before(X, Y) :- prereq(X, Z), take_before(Z, Y))).

---