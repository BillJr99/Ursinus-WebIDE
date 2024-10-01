---
layout: exercise
permalink: /Modules/Prolog/Warmup/Exercise2
title: "CS374: Principles of Programming Languages - Warmup with Prolog"
language: "prolog"

info:
  points: 3
  instructions: "Run this prolog program."
  goals:
    - To read a Prolog statement
    
canvasasmtid: "181954"   
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
      father(john, michael).
      father(david, james).
      mother(susan, linda).
      sibling(michael, linda).
      grandparent(john, anna).
      grandparent(susan, anna).
      
  - filename: "main.pl"
    ismain: true
    name: main
    isreadonly: true
    isvisible: true
    code: |
      % Enter facts
      assertz(male(john)).
      assertz(male(david)).
      assertz(male(michael)).
      assertz(male(james)).

      assertz(female(susan)).
      assertz(female(linda)).
      assertz(female(elizabeth)).
      assertz(female(anna)).

      assertz(parent(john, michael)).
      assertz(parent(john, linda)).
      assertz(parent(susan, michael)).
      assertz(parent(susan, linda)).
      assertz(parent(david, james)).
      assertz(parent(elizabeth, james)).
      assertz(parent(michael, anna)).

      % Enter rules
      assertz((father(X, Y) :- male(X), parent(X, Y))).
      assertz((mother(X, Y) :- female(X), parent(X, Y))).
      assertz((sibling(X, Y) :- parent(Z, X), parent(Z, Y), X \= Y)).
      assertz((grandparent(X, Y) :- parent(X, Z), parent(Z, Y))).


---