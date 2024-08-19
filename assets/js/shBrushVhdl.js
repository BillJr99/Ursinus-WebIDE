/*******************************************************************************
 * shBrushVhdl.js
 * --------------
 * Adaptation of the GeSHi syntax, written by Alexander 'E-Razor' Krause,
 * available at:
 * http://peej.github.com/phpdoctor/examples/geshi/source/geshi/vhdl.php.html
 *
 * Since VHDL supports case insensitive keywords, this script covers the cases
 * for lowercase or uppercase, but not for mixed (WHILE and while are colored,
 * but While, WhIle, or others will not be).
 ******************************************************************************/

SyntaxHighlighter.brushes.Vhdl = function(){
    var keywordsMin  = 'access after alias all assert attribute architecture begin block body buffer bus case component configuration constant disconnect downto else elsif end entity exit file for function generate generic group guarded if impure in inertial inout is label library linkage literal loop map new next null of on open others out package port postponed procedure process pure range record register reject report return select severity signal shared subtype then to transport type unaffected units until use variable wait when while with note warning error failure and or xor not nor used memory segments dff dffe help_id mod info latch rising_edge falling_edge';
    var keywords = keywordsMin + ' ' + keywordsMin.toUpperCase();
    
    var datatypesMin =  'bit bit_vector character boolean integer real time string severity_level positive natural signed unsigned line text std_logic std_logic_vector std_ulogic std_ulogic_vector qsim_state qsim_state_vector qsim_12state qsim_12state_vector qsim_strength mux_bit mux_vector reg_bit reg_vector wor_bit wor_vector work ieee std_logic_signed std_logic_1164 std_logic_arith numeric_std';
    var datatypes = datatypesMin + ' ' + datatypesMin.toUpperCase();
    
    
    this.regexList = [
        { regex: /--.*$/gm,                                css: 'comments' },
        { regex: SyntaxHighlighter.regexLib.doubleQuotedString, css: 'color1' },
        { regex: SyntaxHighlighter.regexLib.singleQuotedString, css: 'color1' },
        { regex: new RegExp(this.getKeywords(keywords),  'gm'), css: 'keyword' },
        { regex: new RegExp(this.getKeywords(datatypes), 'gm'), css: 'string' }
    ];
};

SyntaxHighlighter.brushes.Vhdl.prototype = new SyntaxHighlighter.Highlighter();
SyntaxHighlighter.brushes.Vhdl.aliases  = ['vhdl'];