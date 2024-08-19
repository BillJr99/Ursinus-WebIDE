/*******************************************************************************
 * shBrushXlnxUcf.js
 * --------------
 * Minimal skeleton for a UCF file with
 *     NET "signal" LOC="pin" # Comment.
 *
 * Since the UCF supports case insensitive keywords, this script covers the cases
 * for lowercase or uppercase, but not for mixed (WHILE and while are colored,
 * but While, WhIle, or others will not be).
 ******************************************************************************/

SyntaxHighlighter.brushes.XlnxUcf = function(){
    var keywordsMin  = 'net inst pin loc period';
    var keywords = keywordsMin + ' ' + keywordsMin.toUpperCase();
    
    this.regexList = [
        { regex: /#.*$/gm,                                      css: 'comments' },
        { regex: SyntaxHighlighter.regexLib.doubleQuotedString, css: 'color1' },
        { regex: SyntaxHighlighter.regexLib.singleQuotedString, css: 'color1' },
        { regex: new RegExp(this.getKeywords(keywords),  'gm'), css: 'keyword' },
    ];
};

SyntaxHighlighter.brushes.XlnxUcf.prototype = new SyntaxHighlighter.Highlighter();
SyntaxHighlighter.brushes.XlnxUcf.aliases  = ['xlnxucf', 'xlnx-ucf'];