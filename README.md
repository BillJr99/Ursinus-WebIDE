Ursinus WebIDE

## Basic Configuration

In `config.yml`, set:

```
publickey: |  
  YOUR PUBLIC KEY HERE
```

`canvascourseid: courseid1, courseid2, courseid3`  

`formlink: LINK TO GOOGLE SHEET FOR FORM PROCESSING HERE`  

If desired, these variables can be overrided on a per-assignment or per-page basis from the global values configured here:

* `publickey` can be overridden in the layout 
* `canvascourseid` can be overridden in the exercise page
* `formlink` can be overriden in the layout 

## Backend Form Processor for Posting Grades
Use with formprocessor backend to pull from google sheets

## Assignment Specific Notes

### Pyodide Modules

In the markdown files for the modules you're creating, be sure to specify the <code>packages</code> field nested under <code>info</code> to load the packages that are necessary for the module.  For instance, for a module that creates a plot in matplotlib, you'd say

<code>
packages: "numpy,matplotlib"
</code>

After creating a plot, use the built-in method <code>save_figure_js()</code> in your main code in python to save the figure to the figure area.  You can also then look at the string <code>audioStr</code> in the command line to extract the base64 binary code for the image to create reference solutions

When creating an audio module, use the built-in method 

<code>save_audio_js(y, sr)</code>

which takes in an array of samples and a sample rate.  Then check the global string <code>audioStr</code> for the base64 binary to create reference solutions


### Graphics Modules

The graphics modules are a bit complicated.  My recommendation is to look at the examples exercise-shader-lambertian and exercise-view-orthographic for examples, and to build off of those examples.

As with the pyodide plots, you can do correctness checks by comparing a base64 encoded version of what's rendered to some reference base64 string.  The current output is in the variable <code>canvasStr</code>.  So, for example, if I wanted to compare the current output to some string called <code>correctStr</code>, then I could say the following in <code>feedbackprocess</code>

<code>let isCorrect = await pngImagesEqualTol(canvasStr, correctStr, DEFAULT_TOL, "correctCheck");</code>

Then, my correctcheck could simply be

<code>correctcheck: isCorrect</code>

One thing that's different here from a direct comparison is that, due to slight variations in graphics hardware, the results will be slightly different pixel to pixel.  Therefore, the method <code>pngImagesEqualTol</code> actually does a pixel by pixel Euclidean distance calculation between the two images, and it will return <code>true</code> as long as the distance is less than some tolerance (specified as the third argument).  You can change this tolerance, but I've provided a value <code>DEFAULT_TOL</code> that I found worked well for students in the past.

#### Other notes:
Be sure that the relative paths for all meshes in assets/js/ggslac/meshes are correct based on how deep the module is.  For example, in the homer mesh in exercise1-orthographic, we say

"filename":"../../assets/js/ggslac/meshes/homer.off"

since that module is in /Modules/Graphics/OrthographicView

## Example Exercises

This repository contains examples for various programming languages. Each example is linked below, organized by language.

### CS1 and CS2

#### **Java**
- [CS173: Intro to Computer Science - ArrayLists](http://www.billmongan.com/Ursinus-WebIDE/Modules/ArrayLists/Exercise) ([source](https://raw.githubusercontent.com/BillJr99/Ursinus-Exercises/refs/heads/main/Java/exercise-arraylists.md))
- [CS173: Intro to Computer Science - Nearest Value in an Array without Going Over](http://www.billmongan.com/Ursinus-WebIDE/Modules/Arrays/Exercise) ([source](https://raw.githubusercontent.com/BillJr99/Ursinus-Exercises/refs/heads/main/Java/exercise-arrays.md))
- [CS173: Intro to Computer Science - Introduction to Boolean Expressions](http://www.billmongan.com/Ursinus-WebIDE/Modules/Boolean/Exercise) ([source](https://raw.githubusercontent.com/BillJr99/Ursinus-Exercises/refs/heads/main/Java/exercise-boolean.md))
- [CS173: Intro to Computer Science - Introduction to Conditionals](http://www.billmongan.com/Ursinus-WebIDE/Modules/Conditionals/Exercise) ([source](https://raw.githubusercontent.com/BillJr99/Ursinus-Exercises/refs/heads/main/Java/exercise-conditionals.md))
- [CS173: Intro to Computer Science - Dynamic Programming](http://www.billmongan.com/Ursinus-WebIDE/Modules/DynamicProgramming/Exercise) ([source](https://raw.githubusercontent.com/BillJr99/Ursinus-Exercises/refs/heads/main/Java/exercise-dynamicprogramming.md))
- [CS173: Intro to Computer Science - Epoch Time Overflow Calculator](http://www.billmongan.com/Ursinus-WebIDE/Modules/EpochTime/Exercise) ([source](https://raw.githubusercontent.com/BillJr99/Ursinus-Exercises/refs/heads/main/Java/exercise-epoch.md))
- [CS173: Intro to Computer Science - Introduction to Primitive Data Types and Expressions](http://www.billmongan.com/Ursinus-WebIDE/Modules/Expressions/Exercise) ([source](https://raw.githubusercontent.com/BillJr99/Ursinus-Exercises/refs/heads/main/Java/exercise-expressions.md))
- [CS173: Intro to Computer Science - Introduction to Primitive Data Types and Expressions Revisited](http://www.billmongan.com/Ursinus-WebIDE/Modules/Expressions/Exercise2) ([source](https://raw.githubusercontent.com/BillJr99/Ursinus-Exercises/refs/heads/main/Java/exercise-expressions.md))
- [CS173: Intro to Computer Science - Four in a Row](http://www.billmongan.com/Ursinus-WebIDE/Modules/FourInARow/Exercise) ([source](https://raw.githubusercontent.com/BillJr99/Ursinus-Exercises/refs/heads/main/Java/exercise-fourinarow.md))
- [CS173: Intro to Computer Science - Functions](http://www.billmongan.com/Ursinus-WebIDE/Modules/Functions/Exercise) ([source](https://raw.githubusercontent.com/BillJr99/Ursinus-Exercises/refs/heads/main/Java/exercise-functions.md))
- [CS173: Intro to Computer Science - Introduction to the NetBeans IDE](http://www.billmongan.com/Ursinus-WebIDE/Modules/IDE/Exercise) ([source](https://raw.githubusercontent.com/BillJr99/Ursinus-Exercises/refs/heads/main/Java/exercise-ide.md))
- [CS173: Intro to Computer Science - Insertion Sort](http://www.billmongan.com/Ursinus-WebIDE/Modules/InsertionSort/Exercise) ([source](https://raw.githubusercontent.com/BillJr99/Ursinus-Exercises/refs/heads/main/Java/exercise-insertionsort.md))
- [CS173: Intro to Computer Science - Introduction to Iteration](http://www.billmongan.com/Ursinus-WebIDE/Modules/Iteration/Exercise) ([source](https://raw.githubusercontent.com/BillJr99/Ursinus-Exercises/refs/heads/main/Java/exercise-iteration.md))
- [CS173: Intro to Computer Science - Iteration Revisited](http://www.billmongan.com/Ursinus-WebIDE/Modules/Iteration/Exercise2) ([source](https://raw.githubusercontent.com/BillJr99/Ursinus-Exercises/refs/heads/main/Java/exercise-iteration.md))
- [CS173: Intro to Computer Science - Merge Sort](http://www.billmongan.com/Ursinus-WebIDE/Modules/MergeSort/Exercise) ([source](https://raw.githubusercontent.com/BillJr99/Ursinus-Exercises/refs/heads/main/Java/exercise-mergesort.md))
- [CS173: Intro to Computer Science - Problets and Epplets](http://www.billmongan.com/Ursinus-WebIDE/Modules/Problets/Exercise) ([source](https://raw.githubusercontent.com/BillJr99/Ursinus-Exercises/refs/heads/main/Java/exercise-problets.md))
- [CS173: Intro to Computer Science - Recursion](http://www.billmongan.com/Ursinus-WebIDE/Modules/Recursion/Exercise) ([source](https://raw.githubusercontent.com/BillJr99/Ursinus-Exercises/refs/heads/main/Java/exercise-recursion.md))
- [CS173: Intro to Computer Science - Strings](http://www.billmongan.com/Ursinus-WebIDE/Modules/Strings/Exercise) ([source](https://raw.githubusercontent.com/BillJr99/Ursinus-Exercises/refs/heads/main/Java/exercise-strings.md))
- [CS173: Intro to Computer Science - Strings Revisited](http://www.billmongan.com/Ursinus-WebIDE/Modules/Strings/Exercise2) ([source](https://raw.githubusercontent.com/BillJr99/Ursinus-Exercises/refs/heads/main/Java/exercise-strings.md))
- [CS173: Intro to Computer Science - Tic-Tac-Toe](http://www.billmongan.com/Ursinus-WebIDE/Modules/TicTacToe/Exercise) ([source](https://raw.githubusercontent.com/BillJr99/Ursinus-Exercises/refs/heads/main/Java/exercise-tictactoe.md))
- [CS173: Intro to Computer Science - Horstmann Parsons Puzzle: Swap (from Horstmann)](http://www.billmongan.com/Ursinus-WebIDE/Modules/Horstmann/Swap/Exercise) ([source](https://raw.githubusercontent.com/BillJr99/Ursinus-Exercises/refs/heads/main/Horstmann/exercise-swap.md))
- [CS174: OOP - Drills - Array 3 Sort](http://www.billmongan.com/Ursinus-WebIDE/ArrayDrills/Array3Sort) ([source](https://raw.githubusercontent.com/BillJr99/Ursinus-Exercises/refs/heads/main/Java/exercise-drill-array3sort.md))
- [CS174: OOP - Drills - Array Insert](http://www.billmongan.com/Ursinus-WebIDE/ArrayDrills/ArrayInsert) ([source](https://raw.githubusercontent.com/BillJr99/Ursinus-Exercises/refs/heads/main/Java/exercise-drill-arrayinsert.md))
- [CS174: OOP - Drills - Computing the mean of arrays](http://www.billmongan.com/Ursinus-WebIDE/ArrayDrills/ArrayMean) ([source](https://raw.githubusercontent.com/BillJr99/Ursinus-Exercises/refs/heads/main/Java/exercise-drill-arraymean.md))
- [CS174: OOP - Drills - Array Min Index](http://www.billmongan.com/Ursinus-WebIDE/ArrayDrills/ArrayMinIndex) ([source](https://raw.githubusercontent.com/BillJr99/Ursinus-Exercises/refs/heads/main/Java/exercise-drill-arrayminindex.md))
- [CS174: OOP - Drills - Creating the reverse of an array](http://www.billmongan.com/Ursinus-WebIDE/ArrayDrills/ArrayReverse) ([source](https://raw.githubusercontent.com/BillJr99/Ursinus-Exercises/refs/heads/main/Java/exercise-drill-arrayreverse.md))
- [CS174: OOP - Drills - Printing array with commas](http://www.billmongan.com/Ursinus-WebIDE/ArrayDrills/ArraySep) ([source](https://raw.githubusercontent.com/BillJr99/Ursinus-Exercises/refs/heads/main/Java/exercise-drill-arraysep.md))
- [CS174: OOP - Drills - Counting Array Zeroes](http://www.billmongan.com/Ursinus-WebIDE/ArrayDrills/ArrayZeroes) ([source](https://raw.githubusercontent.com/BillJr99/Ursinus-Exercises/refs/heads/main/Java/exercise-drill-arrayzeroes.md))
- [CS174: OOP - Drills - Vowel Counting](http://www.billmongan.com/Ursinus-WebIDE/MiscDrills/StringVowels) ([source](https://raw.githubusercontent.com/BillJr99/Ursinus-Exercises/refs/heads/main/Java/exercise-drill-stringvowels.md))

#### **C++**
- [C++ Basics](http://www.billmongan.com/Ursinus-WebIDE/Modules/Cpp/CppIntro) ([source](https://raw.githubusercontent.com/BillJr99/Ursinus-Exercises/refs/heads/main/cpp/exercise-cppintro.md))

#### **Javascript**
- [Javascript Example Module: Array Min Index](http://www.billmongan.com/Ursinus-WebIDE/Modules/Javascript/MinIndex) ([source](https://raw.githubusercontent.com/BillJr99/Ursinus-Exercises/refs/heads/main/Javascript/exercise-minindex.md))

#### **Python**
- [CS377: Database Design - Iteration in Python](http://www.billmongan.com/Ursinus-WebIDE/Modules/Python/Iteration/Exercise) ([source](https://raw.githubusercontent.com/BillJr99/Ursinus-Exercises/refs/heads/main/Python/exercise-python-iteration.md))
- [CS377: Database Design - Quadratic Formula in Python](http://www.billmongan.com/Ursinus-WebIDE/Modules/Python/Warmup/Exercise) ([source](https://raw.githubusercontent.com/BillJr99/Ursinus-Exercises/refs/heads/main/Python/exercise-python-quadratic.md))
- [CS 271: Module 1: Python Basics Part 2](http://www.billmongan.com/Ursinus-WebIDE/Modules/Python/Slice/Exercise) ([source](https://raw.githubusercontent.com/BillJr99/Ursinus-Exercises/refs/heads/main/Python/exercise-python-slice.md))
- [CS 372: Module 2: Square Wave](http://www.billmongan.com/Ursinus-WebIDE/Modules/Pyodide/AudioSquareWave) ([source](https://raw.githubusercontent.com/BillJr99/Ursinus-Exercises/refs/heads/main/Pyodide/exercise-pyodide-audio-squarewave.md))
- [CS 477: Module 1: Numpy Exercise](http://www.billmongan.com/Ursinus-WebIDE/Modules/Pyodide/PlotTenHeads) ([source](https://raw.githubusercontent.com/BillJr99/Ursinus-Exercises/refs/heads/main/Pyodide/exercise-pyodide-plot-tenheads.md))

### Principles of Programming Languages
#### **Prolog**
- [CS374: Principles of Programming Languages - Warmup with Prolog](http://www.billmongan.com/Ursinus-WebIDE/Modules/Prolog/Warmup/Exercise) ([source](https://raw.githubusercontent.com/BillJr99/Ursinus-Exercises/refs/heads/main/Prolog/exercise-prolog-warmup.md))
- [CS374: Principles of Programming Languages - Warmup with Prolog](http://www.billmongan.com/Ursinus-WebIDE/Modules/Prolog/Warmup/Exercise2) ([source](https://raw.githubusercontent.com/BillJr99/Ursinus-Exercises/refs/heads/main/Prolog/exercise-prolog-warmup.md))

#### **Scheme**
- [CS374: Principles of Programming Languages - Warmup with Scheme](http://www.billmongan.com/Ursinus-WebIDE/Modules/Scheme/Warmup/Exercise) ([source](https://raw.githubusercontent.com/BillJr99/Ursinus-Exercises/refs/heads/main/Scheme/exercise-scheme-warmup.md))

### Statistics
#### **R**
- [CS173: Intro to Computer Science - R (from WebR)](http://www.billmongan.com/Ursinus-WebIDE/Modules/R/TutorialExercise) ([source](https://raw.githubusercontent.com/BillJr99/Ursinus-Exercises/refs/heads/main/R/exercise-r.md)]
- [CS173: Intro to Computer Science - R Quadratic Equation (from WebR)](http://www.billmongan.com/Ursinus-WebIDE/Modules/R/QuadraticExercise) ([source](https://raw.githubusercontent.com/BillJr99/Ursinus-Exercises/refs/heads/main/R/exercise-rquadratic.md))

### Database Systems with SQL
- [CS377: Database Design - SQL Aggregation](http://www.billmongan.com/Ursinus-WebIDE/Modules/SQL/Aggregation/Exercise) ([source](https://raw.githubusercontent.com/BillJr99/Ursinus-Exercises/refs/heads/main/SQL/exercise-sql-aggregation.md))
- [CS377: Database Design - SQL Joins](http://www.billmongan.com/Ursinus-WebIDE/Modules/SQL/Join/Exercise) ([source](https://raw.githubusercontent.com/BillJr99/Ursinus-Exercises/refs/heads/main/SQL/exercise-sql-join.md))
- [CS377: Database Design - Introduction to Databases](http://www.billmongan.com/Ursinus-WebIDE/Modules/SQL/Warmup/Exercise) ([source](https://raw.githubusercontent.com/BillJr99/Ursinus-Exercises/refs/heads/main/SQL/exercise-sql-warmup.md))

### **Computer Graphics**
- [CS 476: Computer Graphics - Module 10 Exercise 1](http://www.billmongan.com/Ursinus-WebIDE/Modules/Graphics/IlluminationLambertian) ([source](https://raw.githubusercontent.com/BillJr99/Ursinus-Exercises/refs/heads/main/Graphics/exercise-shader-lambertian.md))
- [CS 476: Computer Graphics - Object First Perspective/Viewing Exercise 1](http://www.billmongan.com/Ursinus-WebIDE/Modules/Graphics/ViewOrthographic) ([source](https://raw.githubusercontent.com/BillJr99/Ursinus-Exercises/refs/heads/main/Graphics/exercise-view-orthographic.md))
