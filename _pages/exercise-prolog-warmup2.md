---
layout: exercise
permalink: /Modules/Prolog/Warmup/Exercise2
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
      assert(male(john)).
      assert(male(david)).
      assert(male(michael)).
      assert(male(james)).

      assert(female(susan)).
      assert(female(linda)).
      assert(female(elizabeth)).
      assert(female(anna)).

      assert(parent(john, michael)).
      assert(parent(john, linda)).
      assert(parent(susan, michael)).
      assert(parent(susan, linda)).
      assert(parent(david, james)).
      assert(parent(elizabeth, james)).
      assert(parent(michael, anna)).

      % Enter rules
      assert((father(X, Y) :- male(X), parent(X, Y))).
      assert((mother(X, Y) :- female(X), parent(X, Y))).
      assert((sibling(X, Y) :- parent(Z, X), parent(Z, Y), X \= Y)).
      assert((grandparent(X, Y) :- parent(X, Z), parent(Z, Y))).

---