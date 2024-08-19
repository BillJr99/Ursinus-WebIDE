---
layout: exercise
permalink: /Modules/Python/Iteration/Exercise
title: "CS377: Database Design - Iteration in Python"
language: "python"

info:
  points: 3
  instructions: "Modify the ThreeXPlusOne.py file to solve the 3x+1 problem using a loop and conditional."
  goals:
    - To use iteration to compute a discrete value
    - To use conditionals to make choices during each loop iteration
    
canvascourseid: "12345"
canvasasmtid: "125425"    
canvaspoints: 3
    
processor:  
  correctfeedback: "Correct!!" 
  incorrectfeedback: "Try again"
  submitformlink: false
  feedbackprocess: | 
    var pos = feedbackString;
  correctcheck: |
    pos.trim() === "5-111-12"
      
files:
  - filename: "ThreeXPlusOne.py"
    name: threexplusone
    ismain: false
    isreadonly: false
    isvisible: true
    code: | 
        def threeXPlusOne(x):
            # TODO - solve the 3x+1 problem here
            
            # while x is not 1, set x to half of itself if val is even, and to 3x+1 if it is odd
            # count and return the number of iterations you needed until x became 1

  - filename: "main.py"
    ismain: true
    name: main
    isreadonly: true
    isvisible: true
    code: |
        ans1 = threeXPlusOne(5)
        ans2 = threeXPlusOne(27)
        ans3 = threeXPlusOne(17)
        print(str(ans1) + "-" + str(ans2) + "-" + str(ans3))
        
---

## Trivia

This problem is part of the [Collatz Conjecture](https://en.wikipedia.org/wiki/Collatz_conjecture) which suggests that any value will eventually converge back to 1 after a finite number of iterations.  *We don't know if this is true!*
