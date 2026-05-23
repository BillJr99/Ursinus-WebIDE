// One entry per exercise in _pages/Ursinus-Exercises/.
//
// Each entry:
//   {
//     label:    short human label
//     url:      page URL (relative to BASE_URL)
//     files:    { editableFilename: solutionCode, ... }
//     opts?:    { warmupMs, runTimeoutMs, ... } — overrides for slow runtimes
//     skip?:    "reason" — exclude with explanation (separate layouts, etc.)
//   }

// Java drill exercises — small single-method functions.

const arrayUtilsHeader = `public class ArrayUtils {\n`;
const printArrayBody = `
            public static void printArray(int[] arr) {
              for (int i = 0; i < arr.length; i++) {
                System.out.print(arr[i]);
                if (i < arr.length-1) System.out.print(",");
              }
            }
`;

export const EXERCISES = [

    // ===================== JavaScript =====================
    {
        label: 'JS MinIndex',
        url: '/Modules/Javascript/MinIndex.html',
        files: {
            'student.js': `
function getMinIndex(arr) {
    if (!arr || arr.length === 0) return 0;
    let best = 0;
    for (let i = 1; i < arr.length; i++) if (arr[i] < arr[best]) best = i;
    return best;
}
`,
        },
    },

    // ===================== Java drills =====================
    {
        label: 'Java drill Array3Sort',
        url: '/ArrayDrills/Array3Sort.html',
        files: {
            'ArrayUtils.java': `
public class ArrayUtils {
    public static int[] sort3Elements(int a, int b, int c) {
        int[] arr = {a, b, c};
        for (int i = 0; i < 2; i++)
            for (int j = i+1; j < 3; j++)
                if (arr[j] < arr[i]) { int t = arr[i]; arr[i] = arr[j]; arr[j] = t; }
        return arr;
    }
    public static void printArray(int[] arr) {
        for (int i = 0; i < arr.length; i++) {
            System.out.print(arr[i]);
            if (i < arr.length-1) System.out.print(",");
        }
    }
}
`,
        },
    },
    {
        label: 'Java drill ArrayInsert',
        url: '/ArrayDrills/ArrayInsert.html',
        files: {
            'ArrayUtils.java': `
public class ArrayUtils {
    public static int[] insertElement(int[] arr, int index, int element) {
        int[] out = new int[arr.length + 1];
        for (int i = 0; i < index; i++) out[i] = arr[i];
        out[index] = element;
        for (int i = index; i < arr.length; i++) out[i + 1] = arr[i];
        return out;
    }
    public static void printArray(int[] arr) {
        for (int i = 0; i < arr.length; i++) {
            System.out.print(arr[i]);
            if (i < arr.length-1) System.out.print(",");
        }
    }
}
`,
        },
    },
    {
        label: 'Java drill ArrayMean',
        url: '/ArrayDrills/ArrayMean.html',
        skip: 'broken exercise definition in Ursinus-Exercises submodule: missing ismain "Excerpt from Main.java" file (see tests/exercises/REPORT.md)',
        files: {
            'ArrayUtils.java': `
public class ArrayUtils {
    public static double getMean(int[] arr) {
        if (arr.length == 0) {
            return 0.0;
        }
        double sum = 0.0;
        for (int i = 0; i < arr.length; i++) {
            sum = sum + arr[i];
        }
        return sum / arr.length;
    }
}
`,
        },
    },
    {
        label: 'Java drill ArrayMinIndex',
        url: '/ArrayDrills/ArrayMinIndex.html',
        files: {
            'ArrayUtils.java': `
public class ArrayUtils {
    public static int getMinIndex(double[] arr) {
        if (arr.length == 0) return 0;
        int best = 0;
        for (int i = 1; i < arr.length; i++) if (arr[i] < arr[best]) best = i;
        return best;
    }
}
`,
        },
    },
    {
        label: 'Java drill ArrayReverse',
        url: '/ArrayDrills/ArrayReverse.html',
        files: {
            'ArrayUtils.java': `
public class ArrayUtils {
    public static int[] getReverseArray(int[] arr) {
        int[] out = new int[arr.length];
        for (int i = 0; i < arr.length; i++) out[i] = arr[arr.length - 1 - i];
        return out;
    }
    public static void printArray(int[] arr) {
        for (int i = 0; i < arr.length; i++) {
            System.out.print(arr[i]);
            if (i < arr.length-1) System.out.print(",");
        }
    }
}
`,
        },
    },
    {
        label: 'Java drill ArraySep',
        url: '/ArrayDrills/ArraySep.html',
        files: {
            'ArrayPrinter.java': `
public class ArrayPrinter {
    public static void printArray(int[] arr) {
        for (int i = 0; i < arr.length; i++) {
            System.out.print(arr[i]);
            if (i < arr.length-1) System.out.print(", ");
        }
    }
}
`,
        },
    },
    {
        label: 'Java drill ArrayZeroes',
        url: '/ArrayDrills/ArrayZeroes.html',
        files: {
            'ArrayZeroes.java': `
public class ArrayZeroes {
    public static int countZeroes(int[] arr) {
        int c = 0;
        for (int i = 0; i < arr.length; i++) if (arr[i] == 0) c++;
        return c;
    }
}
`,
        },
    },
    {
        label: 'Java drill StringVowels',
        url: '/MiscDrills/StringVowels.html',
        files: {
            'StringUtils.java': `
public class StringUtils {
    public static int countVowels(String s) {
        int c = 0;
        String lower = s.toLowerCase();
        for (int i = 0; i < lower.length(); i++) {
            char ch = lower.charAt(i);
            if (ch == 'a' || ch == 'e' || ch == 'i' || ch == 'o' || ch == 'u') c++;
        }
        return c;
    }
}
`,
        },
    },

    // ===================== Java intro modules =====================
    {
        label: 'Java IDE Hello',
        url: '/Modules/IDE/Exercise.html',
        files: {
            'MyFirstProgram.java': `
public class MyFirstProgram {
    public static void main(String[] args) {
        System.out.println("Hello Claude");
    }
}
`,
        },
    },
    {
        label: 'Java Expressions',
        url: '/Modules/Expressions/Exercise.html',
        files: {
            'Driver.java': `
public class Driver {
    public static void main(String[] args) {
        final double C = 3e8;
        double m = 2.3;
        double E = m * C * C;
        System.out.println(E);
    }
}
`,
        },
    },
    {
        label: 'Java Expressions2',
        url: '/Modules/Expressions/Exercise2.html',
        files: {
            'Driver.java': `
public class Driver {
    public static void main(String[] args) {
        double g = 9.80665;
        double time = 5.0;
        double distance = 0.5 * g * time * time;
        System.out.println(distance);
    }
}
`,
        },
    },
    {
        label: 'Java Boolean',
        url: '/Modules/Boolean/Exercise.html',
        files: {
            'Driver.java': `
public class Driver {
    public static void main(String[] args) {
        float diameter = 6.5f;
        float pi = 3.14159f;
        double circumference = pi * diameter;
        System.out.println(circumference);
        boolean isApproximatelyEqual = circumference > 20.42 && circumference < 20.43;
        System.out.println(isApproximatelyEqual);
    }
}
`,
        },
    },
    {
        label: 'Java Conditionals',
        url: '/Modules/Conditionals/Exercise.html',
        files: {
            'GradePrinter.java': `
public class GradePrinter {
    public static void printGrade(double grade) {
        if (grade >= 96) System.out.println("A+");
        else if (grade >= 92) System.out.println("A");
        else if (grade >= 89) System.out.println("A-");
        else if (grade >= 87) System.out.println("B+");
        else if (grade >= 83) System.out.println("B");
        else if (grade >= 80) System.out.println("B-");
        else if (grade >= 77) System.out.println("C+");
        else if (grade >= 73) System.out.println("C");
        else if (grade >= 70) System.out.println("C-");
        else if (grade >= 60) System.out.println("D");
        else System.out.println("F");
    }
}
`,
        },
    },
    {
        label: 'Java Iteration',
        url: '/Modules/Iteration/Exercise.html',
        files: {
            'Driver.java': `
public class Driver {
    public static void main(String[] args) {
        int principal = 1;
        double interest = 1;
        int years = 1;
        int compoundTimesPerYear = 365;
        double compoundFactor = 1 + (interest / compoundTimesPerYear);
        double totalInterestRate = compoundFactor;
        for (int i = 1; i < compoundTimesPerYear * years; i++) {
            totalInterestRate = totalInterestRate * compoundFactor;
        }
        double finalBalance = principal * totalInterestRate;
        System.out.println(finalBalance);
        System.out.println(totalInterestRate);
    }
}
`,
        },
    },
    {
        label: 'Java Iteration2',
        url: '/Modules/Iteration/Exercise2.html',
        files: {
            'ThreeXPlusOne.java': `
public class ThreeXPlusOne {
    public static int threeXPlusOne(int x) {
        int iter = 0;
        while (x != 1) {
            if (x % 2 == 0) x = x / 2;
            else x = 3 * x + 1;
            iter++;
        }
        return iter;
    }
}
`,
        },
    },
    {
        label: 'Java Strings',
        url: '/Modules/Strings/Exercise.html',
        files: {
            'CompareStrings.java': `
public class CompareStrings {
    public static boolean compare(String str1, String str2) {
        if (str1.length() != str2.length()) return false;
        for (int i = 0; i < str1.length(); i++) {
            if (str1.charAt(i) != str2.charAt(i)) return false;
        }
        return true;
    }
}
`,
        },
    },
    {
        label: 'Java Strings2 PigLatin',
        url: '/Modules/Strings/Exercise2.html',
        files: {
            'PigLatin.java': `
public class PigLatin {
    public static boolean isVowel(String input, int idx) {
        char c = input.toLowerCase().charAt(idx);
        return c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u';
    }
    public static int firstVowelLocation(String input) {
        for (int i = 0; i < input.length(); i++) if (isVowel(input, i)) return i;
        return -1;
    }
    public static String pigLatin(String input) {
        int idx = firstVowelLocation(input);
        if (idx == 0) return input + "yay";
        if (idx > 0) return input.substring(idx) + input.substring(0, idx) + "ay";
        return input + "ay";
    }
}
`,
        },
    },
    {
        label: 'Java Functions',
        url: '/Modules/Functions/Exercise.html',
        files: {
            'Driver.java': `
public class Driver {
    public static double quadraticRoots(int a, int b, int c) {
        double disc = Math.sqrt(b*b - 4.0*a*c);
        return (-b + disc) / (2.0 * a);
    }
    public static void main(String[] args) {
        double result = quadraticRoots(1, -1, -6);
        System.out.println(result);
    }
}
`,
        },
    },
    {
        label: 'Java Arrays ClosestValue',
        url: '/Modules/Arrays/Exercise.html',
        files: {
            'ClosestValue.java': `
public class ClosestValue {
    public static int closestWithoutGoingOver(double[] values, double key) {
        int best = -1;
        double bestDiff = 1e18;
        for (int i = 0; i < values.length; i++) {
            if (values[i] <= key) {
                double diff = key - values[i];
                if (diff < bestDiff) { bestDiff = diff; best = i; }
            }
        }
        return best;
    }
}
`,
        },
    },
    {
        label: 'Java ArrayLists Primes',
        url: '/Modules/ArrayLists/Exercise.html',
        files: {
            'PrimeArray.java': `
import java.util.ArrayList;
public class PrimeArray {
    public static boolean isPrime(int val) {
        if (val < 2) return false;
        for (int i = 2; i <= Math.sqrt(val); i++) {
            if (val % i == 0) return false;
        }
        return true;
    }
    public static ArrayList<Integer> buildArrayOfPrimes(int n) {
        ArrayList<Integer> primes = new ArrayList<Integer>();
        for (int i = 2; i <= n; i++) {
            if (isPrime(i)) primes.add(i);
        }
        return primes;
    }
}
`,
        },
    },
    {
        label: 'Java Recursion ReverseString',
        url: '/Modules/Recursion/Exercise.html',
        files: {
            'Recursion.java': `
public class Recursion {
    public String reverseString(String s) {
        String result = "";
        if (s.length() > 0) {
            result = s.charAt(s.length()-1) + reverseString(s.substring(0, s.length()-1));
        }
        return result;
    }
}
`,
        },
    },
    {
        label: 'Java EpochTime',
        url: '/Modules/EpochTime/Exercise.html',
        files: {
            'EpochTimeOverflow.java': `
public class EpochTimeOverflow {
    public static void main(String[] args) {
        final int MAX_INT = 2147483647;
        int epochStartYear = 1970;
        double secondsPerYear = 365.25 * 24 * 60 * 60;
        double yearsFromStart = MAX_INT / secondsPerYear;
        int overflowYear = (int)Math.floor(epochStartYear + yearsFromStart);
        System.out.println(overflowYear);
    }
}
`,
        },
    },
    {
        label: 'Java InsertionSort swap',
        url: '/Modules/InsertionSort/Exercise.html',
        files: {
            'InsertionSort.java': `
public class InsertionSort {
    public static void swap(int[] arr, int i, int j) {
        int tmp = arr[i];
        arr[i] = arr[j];
        arr[j] = tmp;
    }
    public static void insertionSort(int[] arr) {
        for (int i = 1; i < arr.length; i++) {
            int j = i;
            while (j >= 1 && arr[j] < arr[j-1]) {
                swap(arr, j, j-1);
                j--;
            }
        }
    }
}
`,
        },
    },
    {
        label: 'Java MergeSort merge',
        url: '/Modules/MergeSort/Exercise.html',
        files: {
            'MergeSort.java': `
public class MergeSort {
    public static int MIN_LENGTH = 5;
    public static int[] mergeSort(int[] arr) {
        int[] result = {};
        if (arr.length < 5) {
            result = ArrayUtilities.cloneArray(arr);
            ArrayUtilities.insertionSort(result);
        } else {
            result = new int[arr.length];
            int halfway = (int)(arr.length / 2);
            int[] list1 = ArrayUtilities.cloneArrayPart(arr, 0, halfway);
            int[] list2 = ArrayUtilities.cloneArrayPart(arr, halfway, arr.length);
            list1 = mergeSort(list1);
            list2 = mergeSort(list2);
            int i1 = 0;
            int i2 = 0;
            int i = 0;
            while (i1 < list1.length && i2 < list2.length && i < result.length) {
                if (list1[i1] < list2[i2]) {
                    result[i] = list1[i1];
                    i1++;
                } else {
                    result[i] = list2[i2];
                    i2++;
                }
                i++;
            }
            while (i1 < list1.length) {
                result[i] = list1[i1];
                i1++;
                i++;
            }
            while (i2 < list2.length) {
                result[i] = list2[i2];
                i2++;
                i++;
            }
        }
        return result;
    }
}
`,
        },
    },
    {
        label: 'Java DynamicProgramming Fib',
        url: '/Modules/DynamicProgramming/Exercise.html',
        files: {
            'Recursion.java': `
import java.util.HashMap;
public class Recursion {
    private HashMap<Integer, Integer> fibMem;
    public static int counts = 0;
    public static void resetCounts() { counts = 0; }
    public Recursion() { fibMem = new HashMap<Integer, Integer>(); }
    public int fib(Integer N) {
        counts++;
        if (fibMem.containsKey(N)) return fibMem.get(N);
        Integer result = 1;
        if (N > 1) result = fib(N-1) + fib(N-2);
        fibMem.put(N, result);
        return result;
    }
}
`,
        },
    },
    {
        label: 'Java FourInARow',
        url: '/Modules/FourInARow/Exercise.html',
        files: {
            'FourInARow.java': `
public class FourInARow {
    public static int checkWinning(int[][] board) {
        int winner = 0;
        for (int j = 0; j < board[0].length; j++) {
            int count1 = 0, count2 = 0;
            for (int i = 0; i < board.length; i++) {
                if (board[i][j] == 1) { count1++; count2 = 0; }
                else if (board[i][j] == 2) { count2++; count1 = 0; }
                else { count1 = 0; count2 = 0; }
                if (count1 == 4) winner = 1;
                if (count2 == 4) winner = 2;
            }
        }
        return winner;
    }
}
`,
        },
    },
    {
        label: 'Java TicTacToe',
        url: '/Modules/TicTacToe/Exercise.html',
        files: {
            'TicTacToe.java': `
public class TicTacToe {
    public static boolean checkWinningTicTacToe(char[][] board) {
        int n = board.length;
        // Rows
        for (int i = 0; i < n; i++) {
            int count = 0;
            for (int j = 0; j < n; j++) if (board[i][j] == board[i][0] && board[i][j] != '-') count++;
            if (count == n) return true;
        }
        // Cols
        for (int j = 0; j < n; j++) {
            int count = 0;
            for (int i = 0; i < n; i++) if (board[i][j] == board[0][j] && board[i][j] != '-') count++;
            if (count == n) return true;
        }
        // Diagonals
        int d1 = 0, d2 = 0;
        for (int i = 0; i < n; i++) {
            if (board[i][i] == board[0][0] && board[i][i] != '-') d1++;
            if (board[i][n-1-i] == board[0][n-1] && board[i][n-1-i] != '-') d2++;
        }
        if (d1 == n || d2 == n) return true;
        return false;
    }
}
`,
        },
    },

    // ===================== C++ =====================
    {
        label: 'C++ Intro DivisibleBy6',
        url: '/Modules/Cpp/CppIntro.html',
        opts: { runTimeoutMs: 90000, warmupMs: 8000 },
        files: {
            'student.cpp': `
#include <stdio.h>
void printDivisibleBy6(int max) {
    for (int i = 6; i <= max; i++) {
        if (i % 2 == 0 && i % 3 == 0) printf("%d ", i);
    }
}
`,
        },
    },
    {
        label: 'C++ PointerSwap',
        url: '/Modules/Cpp/PointerSwap.html',
        opts: { runTimeoutMs: 90000, warmupMs: 8000 },
        files: {
            'student.cpp': `
#include <stdio.h>
void swap(int* x, int* y) {
    int t = *x;
    *x = *y;
    *y = t;
}
`,
        },
    },
    {
        label: 'C++ Inheritance',
        url: '/Modules/Cpp/Inheritance1.html',
        opts: { runTimeoutMs: 90000, warmupMs: 8000 },
        files: {
            'student.cpp': `
#include <stdio.h>
#include <string>
using namespace std;
class Person {
    protected:
        string name;
        int age;
    public:
        Person(string name, int age) { this->name = name; this->age = age; }
        void celebrateBirthday() { age++; }
        int getAge() { return age; }
};
class Button: public Person {
    public:
        Button(string name, int age):Person(name, age){}
        void celebrateBirthday() { age--; }
};
`,
        },
    },
    {
        label: 'C++ Polymorphism',
        url: '/Modules/Cpp/Polymorphism.html',
        opts: { runTimeoutMs: 90000, warmupMs: 8000 },
        files: {
            'student.cpp': `
#include <stdio.h>
#include <string>
using namespace std;
class Person {
    protected:
        string name;
        int age;
    public:
        Person(string name, int age) { this->name = name; this->age = age; }
        virtual void celebrateBirthday() { age++; }
        int getAge() { return age; }
};
class Button: public Person {
    public:
        Button(string name, int age):Person(name, age){}
        void celebrateBirthday() { age--; }
};
`,
        },
    },
    {
        label: 'C++ BinarySearch',
        url: '/Modules/Cpp/BinarySearch.html',
        opts: { runTimeoutMs: 90000, warmupMs: 8000 },
        files: {
            'student.cpp': `
#include <stdio.h>
int binarySearch(int* x, int i1, int i2, int value) {
    int index = -1;
    if (i1 == i2) {
        if (x[i1] == value) index = i1;
    } else {
        int mid = (i1 + i2) / 2;
        if (x[mid] < value) index = binarySearch(x, mid + 1, i2, value);
        else                index = binarySearch(x, i1, mid, value);
    }
    return index;
}
`,
        },
    },
    {
        label: 'C++ TreeInorder',
        url: '/Modules/Cpp/TreeInorder.html',
        opts: { runTimeoutMs: 90000, warmupMs: 8000 },
        files: {
            'student.cpp': `
#include <stdio.h>
class TreeNode {
    public:
        int value;
        TreeNode* left;
        TreeNode* right;
        TreeNode(int value) { this->value = value; left = NULL; right = NULL; }
};
void inorder(TreeNode* node) {
    if (node == NULL) return;
    if (node->left != NULL)  inorder(node->left);
    printf("%i ", node->value);
    if (node->right != NULL) inorder(node->right);
}
class BinaryTree {
    public:
        TreeNode* root;
        BinaryTree() { root = NULL; }
        ~BinaryTree() { cleanup(root); }
        void cleanup(TreeNode* N) {
            if (N != NULL) { cleanup(N->left); cleanup(N->right); delete N; }
        }
};
TreeNode* makeLeftSubtree() {
    TreeNode* node = new TreeNode(7);
    node->left = new TreeNode(3);
    node->right = new TreeNode(9);
    node->right->left = new TreeNode(8);
    return node;
}
TreeNode* makeRightSubtree() {
    TreeNode* node = new TreeNode(15);
    node->left = new TreeNode(12);
    node->right = new TreeNode(20);
    node->left->right = new TreeNode(14);
    node->left->right->left = new TreeNode(13);
    return node;
}
BinaryTree* makeTree() {
    BinaryTree* T = new BinaryTree();
    T->root = new TreeNode(10);
    T->root->left = makeLeftSubtree();
    T->root->right = makeRightSubtree();
    return T;
}
`,
        },
    },
    {
        label: 'C++ LinkedList addFirst',
        url: '/Modules/Cpp/LinkedListAddFirst.html',
        opts: { runTimeoutMs: 90000, warmupMs: 8000 },
        files: {
            'student.cpp': `
#include <stdio.h>
class Printable {
    public:
        virtual void print()=0;
};
class IntWrapper: public Printable {
    public:
        int x;
        IntWrapper(int x) { this->x = x; }
        void print() { printf("%i ", x); }
};
class LinkedNode {
    public:
        Printable* obj;
        LinkedNode* next;
        LinkedNode(Printable* obj) { this->obj = obj; next = NULL; }
};
class LinkedList {
    private:
        LinkedNode* head;
    public:
        LinkedList() { head = NULL; }
        ~LinkedList() {
            LinkedNode* node = head;
            while (node != NULL) { LinkedNode* next = node->next; delete node; node = next; }
        }
        void addFirst(Printable* obj) {
            LinkedNode* node = new LinkedNode(obj);
            node->next = head;
            head = node;
        }
        void printList() {
            LinkedNode* it = head;
            while (it != NULL) { it->obj->print(); it = it->next; }
        }
};
`,
        },
    },
    {
        label: 'C++ Merge',
        url: '/Modules/Cpp/Merge.html',
        opts: { runTimeoutMs: 90000, warmupMs: 8000 },
        files: {
            'student.cpp': `
#include <stdio.h>
#include <cstring>
void printArray(float* x, int N) {
    for (int i = 0; i < N; i++) printf("%g ", x[i]);
    printf("\\n");
}
void merge(float* A, int M, float* B, int N, float* y) {
    int i = 0, j = 0, k = 0;
    while (i < M && j < N) {
        if (A[i] <= B[j]) y[k++] = A[i++];
        else              y[k++] = B[j++];
    }
    while (i < M) y[k++] = A[i++];
    while (j < N) y[k++] = B[j++];
}
void mergeSortRec(float* x, int N, float* y) {
    if (N > 1) {
        int mid = N/2;
        float* A = x;
        float* B = A + mid;
        mergeSortRec(A, mid, y);
        mergeSortRec(B, N - mid, y);
        merge(A, mid, B, N - mid, y);
        memcpy(x, y, N * sizeof(float));
    }
}
void mergeSort(float* x, int N) {
    float* y = new float[N];
    mergeSortRec(x, N, y);
    delete[] y;
}
`,
        },
    },
    {
        label: 'C++ STL list reverse',
        url: '/Modules/Cpp/STLList.html',
        opts: { runTimeoutMs: 90000, warmupMs: 8000 },
        files: {
            'student.cpp': `
#include <stdio.h>
#include <list>
using namespace std;
class IntWrapper {
    public:
        int x;
        IntWrapper(int x) { this->x = x; }
};
void copyRev(list<IntWrapper*>& arr, list<IntWrapper*>& arrRev) {
    list<IntWrapper*>::iterator it;
    for (it = arr.begin(); it != arr.end(); it++) {
        arrRev.push_front(*it);
    }
}
`,
        },
    },

    // ===================== Python (Brython) =====================
    {
        label: 'Python Quadratic',
        url: '/Modules/Python/Warmup/Exercise.html',
        files: {
            'quadratic.py': `import math
def get_quadratic_roots(a, b, c):
    return (-b + math.sqrt(b**2 - 4*a*c)) / (2*a)
`,
        },
    },
    {
        label: 'Python ThreeXPlusOne',
        url: '/Modules/Python/Iteration/Exercise.html',
        files: {
            'ThreeXPlusOne.py': `def threeXPlusOne(x):
    n = 0
    while x != 1:
        if x % 2 == 0:
            x = x // 2
        else:
            x = 3 * x + 1
        n += 1
    return n
`,
        },
    },
    {
        label: 'Python Slice',
        url: '/Modules/Python/Slice/Exercise.html',
        files: {
            'student.py': `def convert_format(filename):
    return filename[:-4] + ".png"
`,
        },
    },

    // ===================== Pyodide =====================
    // These compare student output against pre-baked reference audio /
    // images. We can't easily reproduce the references; verify the
    // solution runs without error and produces SOME output.
    {
        label: 'Pyodide SquareWave',
        url: '/Modules/Pyodide/AudioSquareWave.html',
        skip: 'broken exercise definition in Ursinus-Exercises submodule: correctcheck references undefined audioRef (see tests/exercises/REPORT.md)',
        opts: { runTimeoutMs: 180000, warmupMs: 12000 },
        files: {
            'student.py': `import numpy as np
t = np.arange(int(44100 * 0.5)) / 44100
y = np.sign(np.cos(2 * np.pi * 660 * t))
save_audio_js(y.tolist(), 44100)
`,
        },
    },
    {
        label: 'Pyodide PlotTenHeads',
        url: '/Modules/Pyodide/PlotTenHeads.html',
        skip: 'broken exercise definition in Ursinus-Exercises submodule: correctcheck references undefined imageRef (see tests/exercises/REPORT.md)',
        opts: { runTimeoutMs: 180000, warmupMs: 12000 },
        files: {
            'student.py': `import random
import numpy as np
import matplotlib.pyplot as plt
num_trials = 1000
trials = np.zeros(num_trials)
for trial in range(num_trials):
    flips_in_a_row = 0
    num_flips = 0
    while flips_in_a_row < 10:
        flip = random.randint(0, 1)
        num_flips += 1
        if flip == 1:
            flips_in_a_row += 1
        else:
            flips_in_a_row = 0
    trials[trial] = num_flips
plt.hist(trials, bins=50)
plt.xlabel('Number of flips')
plt.ylabel('Frequency')
save_figure_js()
`,
        },
    },

    // ===================== SQL =====================
    {
        label: 'SQL Warmup',
        url: '/Modules/SQL/Warmup/Exercise.html',
        files: {
            'MyFirstStatement.sql': `INSERT INTO mytable (a) VALUES (42);
SELECT a FROM mytable;
`,
        },
    },
    {
        label: 'SQL Join',
        url: '/Modules/SQL/Join/Exercise.html',
        files: {
            'MyJoins.sql': `SELECT P.FirstName, P.LastName, H.Address
FROM PERSON P
JOIN HOUSEHOLDMEMBER HM ON HM.PersonID = P.ID
JOIN HOUSE H ON H.ID = HM.HouseID
WHERE H.ZIP = '19426';

SELECT H.Address, AVG(P.Salary) AS HouseholdSalary
FROM HOUSE H
JOIN HOUSEHOLDMEMBER HM ON HM.HouseID = H.ID
JOIN PERSON P ON P.ID = HM.PersonID
GROUP BY H.Address
ORDER BY HouseholdSalary DESC;

SELECT Zip, AVG(HouseholdSalary) AS HouseholdSalary FROM (
    SELECT H.Zip, SUM(P.Salary) AS HouseholdSalary
    FROM HOUSE H
    JOIN HOUSEHOLDMEMBER HM ON HM.HouseID = H.ID
    JOIN PERSON P ON P.ID = HM.PersonID
    GROUP BY H.ID, H.Zip
) GROUP BY Zip
ORDER BY HouseholdSalary DESC;
`,
        },
    },
    {
        label: 'SQL Aggregation',
        url: '/Modules/SQL/Aggregation/Exercise.html',
        files: {
            'Aggregation.sql': `SELECT SUM(Quantity) AS NumGrocery FROM INVENTORY WHERE ProductType = 'Grocery';

SELECT ProductType, SUM(Quantity) AS NumItems FROM INVENTORY
GROUP BY ProductType ORDER BY NumItems ASC;

SELECT AVG(Price) AS AvgCostProduce FROM INVENTORY WHERE ProductType = 'Produce';

SELECT ProductType, AVG(Price) AS AvgCost FROM INVENTORY
GROUP BY ProductType ORDER BY AvgCost DESC;
`,
        },
    },

    // ===================== Scheme =====================
    {
        label: 'Scheme Square',
        url: '/Modules/Scheme/Warmup/Exercise.html',
        files: {
            'first.scm': `(define square (lambda (a)
    (* a a)
))
`,
        },
    },

    // ===================== Prolog =====================
    {
        label: 'Prolog Warmup',
        url: '/Modules/Prolog/Warmup/Exercise.html',
        files: {
            'first.pl': `take_before(cs173, cs374).
take_before(X, cs374).
take_before(cs173, X).
take_before(X, Y).
`,
        },
    },
    {
        label: 'Prolog Warmup2',
        url: '/Modules/Prolog/Warmup/Exercise2.html',
        files: {
            'first.pl': `father(john, michael).
father(david, james).
mother(susan, linda).
sibling(michael, linda).
grandparent(john, anna).
grandparent(susan, anna).
`,
        },
    },

    // ===================== Graphics =====================
    // No autograder check. Verify page loads + Run executes; visual
    // correctness needs manual inspection.
    {
        label: 'Graphics ViewOrthographic',
        url: '/Modules/Graphics/ViewOrthographic.html',
        skip: 'graphics_view layout has no auto-grader check (visual output only)',
    },
    {
        label: 'Graphics Lambertian Shader',
        url: '/Modules/Graphics/IlluminationLambertian.html',
        skip: 'graphics_shader layout has no auto-grader check (visual output only)',
    },
];
