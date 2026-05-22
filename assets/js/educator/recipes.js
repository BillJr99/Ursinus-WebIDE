// Snippets injected into code-field ACE editors when an educator picks
// a "Recipe". Keyed by (fieldId, language) where fieldId names which
// editor they're targeting. Recipes are templates only — once injected,
// the editor holds plain editable code.

// Each recipe entry: { id, label, language?: '*' | <lang>, value: string }
// language === '*' means it works for any language (correctness checks
// almost always do, since they operate on `feedbackString` from the
// captured console output).

export const RECIPES = {
  feedbackprocess: [
    {
      id: 'trim',
      label: 'Trim the console output',
      language: '*',
      value: 'let ans = feedbackString.trim();'
    },
    {
      id: 'split-delim',
      label: 'Split output by delimiter',
      language: '*',
      value: 'let ans = feedbackString.split("-");'
    },
    {
      id: 'lines',
      label: 'Split output into lines',
      language: '*',
      value: 'let lines = feedbackString.trim().split("\\n");'
    },
    {
      id: 'tonum',
      label: 'Parse the last token as a number',
      language: '*',
      value: 'let tokens = feedbackString.trim().split(/\\s+/);\nlet ans = parseFloat(tokens[tokens.length - 1]);'
    },
    {
      id: 'json',
      label: 'Parse the output as JSON',
      language: '*',
      value: 'let ans;\ntry { ans = JSON.parse(feedbackString); } catch (e) { ans = null; }'
    }
  ],

  correctcheck: [
    {
      id: 'equals-string',
      label: 'Output equals exact string',
      language: '*',
      value: 'feedbackString.trim() === "EXPECTED"'
    },
    {
      id: 'matches-regex',
      label: 'Output matches a regex',
      language: '*',
      value: '/^\\d+\\s+primes$/.test(feedbackString.trim())'
    },
    {
      id: 'contains',
      label: 'Output contains a substring',
      language: '*',
      value: 'feedbackString.indexOf("EXPECTED") !== -1'
    },
    {
      id: 'tokens-equal',
      label: 'Tokens after splitting equal values',
      language: '*',
      value: 'ans[0] === "7" && ans[1] === "25"'
    },
    {
      id: 'n-lines',
      label: 'Output contains N lines',
      language: '*',
      value: 'feedbackString.trim().split("\\n").length === 5'
    }
  ],

  incorrectcheck: [
    {
      id: 'one-token',
      label: 'Student produced only one token',
      language: '*',
      value: 'ans.length === 1'
    },
    {
      id: 'empty',
      label: 'Output was empty',
      language: '*',
      value: 'feedbackString.trim() === ""'
    },
    {
      id: 'wrong-number',
      label: 'Output is a number outside expected range',
      language: '*',
      value: 'typeof ans === "number" && (ans < 0 || ans > 100)'
    }
  ],

  testcode: [
    {
      id: 'call-and-assert-equal',
      label: 'Call function and assert equality',
      language: '*',
      value: 'console.log(myFunction(3));'
    },
    {
      id: 'no-throw',
      label: 'Call function (just verify it does not throw)',
      language: '*',
      value: 'myFunction(0);'
    },
    {
      id: 'python-call',
      label: 'Call function and print',
      language: 'python',
      value: 'print(my_function(3))'
    },
    {
      id: 'pyodide-call',
      label: 'Call function and print (Pyodide)',
      language: 'pyodide',
      value: 'print(my_function(3))'
    },
    {
      id: 'java-call',
      label: 'Invoke driver method',
      language: 'java',
      value: 'System.out.println(MyClass.myMethod(3));'
    }
  ],

  filecode: [
    {
      id: 'java-skeleton',
      label: 'Java: class skeleton with TODO',
      language: 'java',
      value: 'public class MyClass {\n    public static int myMethod(int n) {\n        /* TODO: implement */\n        return 0;\n    }\n}'
    },
    {
      id: 'java-driver',
      label: 'Java: Driver with main()',
      language: 'java',
      value: 'public class Driver {\n    public static void main(String[] args) {\n        System.out.println(MyClass.myMethod(3));\n    }\n}'
    },
    {
      id: 'js-skeleton',
      label: 'JavaScript: function skeleton',
      language: 'javascript',
      value: 'function myFunction(n) {\n    // TODO: implement\n    return 0;\n}'
    },
    {
      id: 'python-skeleton',
      label: 'Python: function skeleton',
      language: 'python',
      value: 'def my_function(n):\n    # TODO: implement\n    return 0'
    },
    {
      id: 'pyodide-skeleton',
      label: 'Pyodide: function skeleton',
      language: 'pyodide',
      value: 'def my_function(n):\n    # TODO: implement\n    return 0'
    },
    {
      id: 'cpp-skeleton',
      label: 'C++: function skeleton',
      language: 'cpp',
      value: '#include <iostream>\n\nint myFunction(int n) {\n    // TODO: implement\n    return 0;\n}'
    },
    {
      id: 'sql-skeleton',
      label: 'SQL: SELECT skeleton',
      language: 'sql',
      value: '-- TODO: write your query\nSELECT * FROM students;'
    }
  ]
};

// Filter the recipes for a field down to those that apply to the
// current language. Recipes with language === '*' are always included.
export function recipesFor(fieldId, language) {
  const all = RECIPES[fieldId] || [];
  return all.filter(r => r.language === '*' || r.language === language);
}
