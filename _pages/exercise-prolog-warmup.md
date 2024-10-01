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
      % Enter facts
      assertz(course(cs173)).
      assertz(course(cs174)).
      assertz(course(cs374)).
      assertz(course(cs475)).

      % Prerequisite relationships
      assertz(prereq(cs174, cs173)).
      assertz(prereq(cs374, cs174)).

      % Base case: X must be taken before Y if X is a direct prerequisite for Y.
      assertz((take_before(X, Y) :- prereq(X, Y))).

      % Recursive case with an accumulator to track visited courses.
      assertz((take_before(X, Y) :- take_before_recursive(X, Y, []))).

      % Helper predicate with accumulator to avoid cycles
      % Z must not be in the list of already visited courses
      assertz((take_before_recursive(X, Y, Visited) :- prereq(Z, Y), \+ member(Z, Visited), take_before_recursive(X, Z, [Y | Visited]))).

      % Base case for the recursive helper
      assertz((take_before_recursive(X, Y, _) :- prereq(X, Y))).


---