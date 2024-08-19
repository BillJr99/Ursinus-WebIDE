/**
* Scheme brush for SyntaxHighlighter
*
* @copyright
* Copyright (C) 2010 Adam Foltzer.
*
* Modified by tome@tomesoft.net
*/
;(function()
{
    // CommonJS
    typeof(require) != 'undefined' ? SyntaxHighlighter = require('shCore').SyntaxHighlighter : null;

    function Brush()
    {
        // Expressions and Program structure (Chapter 4 and 5 of R5RS)
        // http://www.schemers.org/Documents/Standards/R5RS
        var keywords_R5RS =
            'quote ' + // 4.1.2
            'lambda ' + // 4.1.4
            'if ' + // 4.1.5
            'set! ' + // 4.1.6
            'cond else case and or ' + // 4.2.1
            'let let* letrec ' + // 4.2.2
            'begin ' + // 4.2.3
            'do ' + // 4.2.4
            'delay ' + // 4.2.5
            'quosiquote unquote unquote-splicing ' + // 4.2.6
            'let-syntax letrec-syntax ' + // 4.3.1
            'syntax-rules ' + // 4.3.2
            'define ' + // 5.2
            'define-syntax ' + // 5.3
            '';

        // R6RS keywords http://www.r6rs.org/final/
        // includes mainly suggested as 'Syntax' in the spec.
        var keywords_R6RS =
            '=> ' + // 11.4.5
            'letrec* let-values let*-values ' + // 11.4.6
            'identifier-syntax ' + // 11.19
            'endianness ' + // lib 2.2
            'when unless case-lambda ' + // lib 5
            'define-record-type ' + // lib 6.2
            'fields mutable immutable parent protocol sealed opaque ' +
            'nongenerative parent-rtd ' +
            'guard ' + // lib 7.1
            'define-condition-type ' + // lib 7.2.1
            'file-options ' + // lib 8.2.2
            'buffer-mode ' + // lib 8.2.3
            'eol-style error-handling-mode ' + // lib 8.2.4
            'syntax-case _ ... syntax ' + // lib 12.4
            'with-syntax quasisyntax unsyntax unsyntax-splicing ' + // lib 12.8
            'define-enumeration ' + // lib 14
            '';
        
        // combined keywords
        var keywords = keywords_R5RS + ' ' + keywords_R6RS;

        // R6RS condition types
        var condition_types = '' +
            '&condition &message &warning &error &serious &violation &assertion ' +
            '&irritants &who &non-continuable &implement-restriction ' +
            '&lexical &syntax &undefined ' +
            '&i/o &i/o-read &i/o-write &i/o-invalid-position &i/o-filename ' + // lib 8.1
            '&i/o-file-protection &i/o-file-is-read-only &i/o-file-already-exists ' +
            '&i/o-file-does-not-exist &i/o-port ' +
            '&i/o-decoding &i/o-encoding ' + // lib 8.2.4
            '&no-infinities &no-nans ' +
            '';

        // Standard procedures (Chapter 6 of R5RS)
        // http://www.schemers.org/Documents/Standards/R5RS
        var standard_procedures_R5RS = 
            'eq? eqv? equal? ' + // 6.1
            'number? complex? real? rational? integer? ' + // 6.2.5
            'exact? inexact? ' +
            '= < > <= >= ' +
            'zero? positive? negative? odd? even? ' +
            'max min ' +
            '+ * - / ' +
            'abs quotient reminder modulo ' +
            'gcd lcm numerator denominator ' +
            'floor ceiling truncate round rationalize ' +
            'exp log sin cos tan asin acos atan ' +
            'sqrt expt ' +
            'make-rectangular make-polar real-part imag-part magnitude angle ' +
            'exact->inexact inexact->exact ' +
            'number->string string->number ' + // 6.2.6
            'not boolean? ' + // 6.3.1
            'pair? cons car cdr set-car! set-cdr! ' + // 6.3.2
            'caar cadr cdar cddr ' +
            'caaar caadr cadar caddr cdaar cdadr cddar cdddr ' +
            'caaaar caaadr caadar caaddr cadaar cadadr caddar cadddr ' +
            'cdaaar cdaadr cdadar cdaddr cddaar cddadr cdddar cddddr ' +
            'null? list? list length append reverse list-tail list-ref ' +
            'memq memv member assq assv assoc ' +
            'symbol? symbol->string string->symbol ' + // 6.3.3
            'char? char=? char<? char>? char<=? char>=? ' + // 6.3.4
            'char-ci=? char-ci<? char-ci>? char-ci<=? char-ci>=? ' +
            'char-alphabetic? char-numeric? char-whitespace? ' +
            'char-upper-case? char-lower-case? ' +
            'char->integer integer->char ' +
            'char-upcase char-downcase ' +
            'string? make-string string string-length string-ref string-set! ' + // 6.3.5
            'string=? string<? string>? string<=? string>=? ' +
            'string-ci=? string-ci<? string-ci>? string-ci<=? string-ci>=? ' +
            'substring string-append string->list list->string ' +
            'string-copy string-fill! ' +
            'vector? make-vector vector vector-length vector-ref vector-set! ' + // 6.3.6
            'vector->list list->vector vector-fill! ' +
            'procedure? apply map for-each force ' + // 6.4
            'call-with-current-continuation call/cc ' +
            'values call-with-values dynamic-wind ' +
            'eval scheme-report-environment null-environment ' + // 6.5
            'interaction-environment ' +
            'call-with-input-file call-with-output-file ' + // 6.6.1
            'port? ' + // in 3.2
            'input-port? output-port? current-input-port? current-output-port? ' +
            'with-input-from-file with-output-to-file ' +
            'open-input-file open-output-file close-input-file close-output-file ' +
            'read read-char peek-char eof-object? char-ready? ' + // 6.6.2
            'write display newline write-char ' + // 6.6.3
            'load transcript-on transcript-off ' + // 6.6.4
            '';
        
        // R6RS procedures http://www.r6rs.org/final/
        // includes mainly suggested as 'Procedure' in the spec.
        var standard_procedures_R6RS = '' +
            'real-valued? rational-valued? integer-valued? ' + // 11.7.4
            'inexact exact finite? infinite? nan? ' +
            'exact-integer-sqrt ' +
            'symbol=? ' + // 11.10
            'string-for-each ' + // 11.12
            'vector-map vector-for-each ' + // 11.13
            'error assertion-violation ' +
            'char-titlecase char-foldcase char-title-case? char-general-category ' + // lib 1.1
            'string-titlecase string-foldcase ' + // lib 1.2
            'string-normalize-nfd string-normalize-nfkd ' +
            'string-normalize-nfc string-normalize-nfkc ' +
            'native-endianness bytevector? make-bytevector ' + // lib 2.2
            'bytevector-length bytevector=? bytevector-fill! ' +
            'bytevector-copy! bytevector-copy ' +
            'bytevector-u8-ref bytevector-s8-ref ' + // lib 2.3
            'bytevector-u8-set! bytevector-s8-set! ' +
            'bytevector->u8-list u8-list->bytevector ' +
            'bytevector-uint-ref bytevector-sint-ref ' + // lib 2.4
            'bytevector-uint-set! bytevector-sint-set! ' +
            'bytevector->uint-list uint-list->bytevector ' +
            'bytevector->sint-list sint-list->bytevector ' +
            'bytevector-u16-ref bytevector-s16-ref ' + // lib 2.5
            'bytevector-u16-native-ref bytevector-s16-native-ref ' +
            'bytevector-u16-set! bytevector-s16-set! ' +
            'bytevector-u16-native-set! bytevector-s16-native-set! ' +
            'bytevector-u32-ref bytevector-s32-ref ' + // lib 2.6
            'bytevector-u32-native-ref bytevector-s32-native-ref ' +
            'bytevector-u32-set! bytevector-s32-set! ' +
            'bytevector-u32-native-set! bytevector-s32-native-set! ' +
            'bytevector-u64-ref bytevector-s64-ref ' + // lib 2.7
            'bytevector-u64-native-ref bytevector-s64-native-ref ' +
            'bytevector-u64-set! bytevector-s64-set! ' +
            'bytevector-u64-native-set! bytevector-s64-native-set! ' +
            'bytevector-ieee-single-ref bytevector-ieee-double-ref ' + // lib 2.8
            'bytevector-ieee-single-native-ref bytevector-ieee-double-native-ref ' +
            'bytevector-ieee-single-set! bytevector-ieee-double-set! ' +
            'bytevector-ieee-single-native-set! bytevector-ieee-double-native-set! ' +
            'string->utf8 string->utf16 string->utf32 ' + // lib 2.9
            'utf8->string utf16->string utf32->string ' +
            'find for-all exists filter partition fold-left fold-right ' + //lib 3
            'remp remove remv remq memp assp cons* ' +
            'list-sort vector-sort vector-sort! ' + // lib 4
            'make-record-type-descriptor record-type-descriptor? ' + // lib 6.3
            'make-record-constructor-descriptor record-constructor ' +
            'record-predicate record-accessor record-mutator ' +
            'record? record-rtd record-type-name record-type-parent ' + // lib 6.4
            'record-type-uid record-type-generative? record-type-sealed? ' +
            'record-type-opaque? record-type-field-names record-field-mutable? ' +
            'with-exception-handler raise raise-continuable ' + // lib 7.1
            'condition simple-conditions condition? condition-predicate ' + // lib 7.2.1
            'condition-accessor ' +
            'make-message-condition message-condition? condition-message ' + // lib 7.3
            'make-warning warning? ' +
            'make-serious-condition serious-condition? ' +
            'make-error error? ' +
            'make-violation violation? ' +
            'make-assertion-violation assertion-violation? ' +
            'make-irritants-condition irritants-condition? condition-irritants ' +
            'make-who-condition who-condition? condition-who ' +
            'make-non-continuable-violation non-continuable-violation? ' +
            'make-implement-restriction-violation implement-restriction-violation? ' +
            'make-lexical-violation lexical-violation? ' +
            'make-syntax-violation syntax-violation? ' +
            'syntax-violation-form syntax-violation-subform ' +
            'make-undefined-violation undefined-violation? ' +
            'make-i/o-error i/o-error? ' + // lib 8.1
            'make-i/o-read-error i/o-read-error? ' +
            'make-i/o-write-error i/o-write-error? ' +
            'make-i/o-invalid-position-error i/o-invalid-position-error? i/o-error-position ' +
            'make-i/o-filename-error i/o-filename-error? i/o-error-filename ' +
            'make-i/o-file-protection-error i/o-file-protection-error? ' +
            'make-i/o-file-is-read-only-error i/o-file-is-read-only-error? ' +
            'make-i/o-file-already-exists-error i/o-file-already-exists-error? ' +
            'make-i/o-file-does-not-exist-error i/o-file-does-not-exist-error? ' +
            'make-i/o-port-error i/o-port-error? i/o-error-port ' +
            'buffer-mode? ' + // lib 8.2.3
            'latin-1-codec utf-8-codec utf-16-codec ' + // lib 8.2.4
            'native-eol-style ' +
            'make-i/o-decoding-error i/o-decoding-error? ' +
            'make-i/o-encoding-error i/o-encoding-error? ' +
            'native-transcoder ' +
            'transcoder-codec transcoder-eol-style transcoder-error-handling-mode ' +
            'bytevector->string string->bytevector ' +
            'eof-object ' + // lib 8.2.5
            'port-transcoder textual-port? binary-port? transcode-port  ' + // lib 8.2.6
            'port-has-port-position? port-position ' +
            'port-has-set-port-position!? set-port-position! ' +
            'close-port call-with-port ' +
            'port-eof? open-file-input-port open-bytevector-input-port ' + // lib 8.2.7
            'open-string-input-port standard-input-port current-input-port ' +
            'make-custom-binary-input-port make-custom-textual-input-port ' +
            'get-u8 lookahead-u8 get-bytevector-n get-bytevector-n! ' + // lib 8.2.8
            'get-bytevector-some get-bytevector-all ' +
            'get-char lookahead-char get-string-n get-string-n! get-string-all ' + // lib 8.2.9
            'get-line get-datum ' +
            'flush-output-port output-port-buffer-mode open-file-output-port ' + // lib 8.2.10
            'open-bytevector-output-port call-with-bytevector-output-port ' +
            'open-string-output-port call-with-string-output-port ' +
            'standard-output-port standard-error-port ' +
            'current-output-port current-error-port ' +
            'make-custom-binary-output-port make-custom-textual-output-port ' +
            'put-u8 put-bytevector ' + // lib 8.2.11
            'put-char put-string ' + // lib 8.2.12
            'open-file-input/output-port make-custom-binary-input/output-port ' + // lib 8.2.13
            'make-custom-textual-input/output-port ' +
            'close-input-port close-output-port ' + // lib 8.3
            'file-exists? delete-file ' + // lib 9
            'command-line exit ' + // lib 10
            'fixnum? fixnum-width least-fixnum greatest-fixnum ' + // lib 11.2
            'fx=? fx>? fx<? fx>=? fx<=? ' +
            'fxzero? fxpositive? fxnegative? fxodd? fxeven? ' +
            'fxmax fxmin fx+ fx* fx- ' +
            'fxdiv-and-mod fxdiv fxmod fxdiv0-and-mod0 fxdiv0 fxmod0 ' +
            'fx+/carry fx-/carry fx*/carry fxnot fxand fxior fxxor fxif fxbit-count fxlength' +
            'fxfirst-bit-set fxbit-set? fxcopy-bit fxbit-field fxcopy-bit-field ' +
            'fxarithmetic-shift fxarithmetic-shift-left fxarithmetic-shift-right ' +
            'fxrotate-bit-field fxreverse-bit-field' +
            'flonum? real->flonum ' + // lib 11.3
            'fl=? fl<? fl<=? fl>? fl>=? ' +
            'flinteger? flzero? flpositive? flnegative? flodd? fleven? ' +
            'flfinite? flinfinite? flnan? ' +
            'flmax flmin fl+ fl* fl- fl/ flabs ' +
            'fldiv-and-mod fldiv flmod fldiv0-and-mod0 fldiv0 flmod0 ' +
            'flnumerator fldenominator flfloor flceiling fltruncate flround ' +
            'flexp fllog flsin flcos fltan flasin flacos flatan flsqrt flexpt ' +
            'make-no-infinities-violation no-infinities-violation? ' +
            'make-no-nans-violation no-nans-violation? ' +
            'fixnum->flonum ' +
            'bitwise-not bitwise-and bitwise-ior bitwise-xor bitwise-if ' + // lib 11.4
            'bitwise-bit-count bitwise-length bitwise-first-bit-set bitwise-bit-set? ' +
            'bitwise-copy-bit bitwise-bit-field bitwise-copy-bit-field ' +
            'bitwise-arithmetic-shift ' +
            'bitwise-arithmetic-shift-left bitwise-arithmetic-shift-right ' +
            'bitwise-rotate-bit-field bitwise-reverse-bit-field ' +
            'make-variable-transformer ' + // lib 12.2
            'identifier? bound-identifier=? free-identifier=? ' // lib 12.5
            'syntax->datum datum->syntax ' + // lib 12.6
            'generate-temporaries ' + // lib 12.7
            'syntax-violation ' + // lib 12.9
            'make-eq-hashtable make-eqv-hashtable make-hashtable ' + // lib 13.1
            'hashtable? hashtable-size hashtable-ref hashtable-set! ' + // lib 13.2
            'hashtable-delete! hashtable-contains? hashtable-update! ' +
            'hashtable-copy hashtable-clear! hashtable-keys hashtable-entries ' +
            'hashtable-equivalence-function hashtable-hash-function ' + // lib 13.3
            'hashtable-mutable? ' +
            'equal-hash string-hash string-ci-hash symbol-hash ' + // lib 13.4
            'make-enumeration enum-set-universe enum-set-indexer ' + // lib 14
            'enum-set-constructor enum-set->list ' +
            'enum-set-member? enum-set-subset? enum-set=? ' +
            'enum-set-union enum-set-intersection enum-set-difference ' +
            'enum-set-complement enum-set-projection ' +
            'environment ' + // lib 16
            '';

        // combined standard procedures
        var standard_procedures = standard_procedures_R5RS + ' ' + standard_procedures_R6RS;

        function makeEscape(str) {
            // {/:\\/, ?:\\?, +:\\+, *:\\*, .:\\., <:&lt;, >:&gt;}
            return str.replace(/([.?*+\/])/g, '\\$1').
                replace(/</g, '(?:<\|&lt;)').replace(/>/g, '(?:>|&gt;)')
        }

        function buildPattern(src) {
            var re = new RegExp();
            var escaped = makeEscape(src);
            re.compile('^(' + escaped.replace(/ /g, '|') + ')$')
            return re;
        }

        var compiled_kwds_pattern = null; // for cache
        var compiled_procs_pattern = null; // for cache
        var compiled_conds_pattern = null; // for condition

        function fixKeywordOrProcedure(match, regexInfo)
        {
            var result = [];
            if (compiled_kwds_pattern == null) {
                compiled_kwds_pattern = buildPattern(keywords);
            }
            if (compiled_procs_pattern == null) {
                compiled_procs_pattern = buildPattern(standard_procedures);
            }
            if (compiled_conds_pattern == null) {
                compiled_conds_pattern = buildPattern(condition_types);
            }
            if (match[1].match(compiled_kwds_pattern) != null) {
                result.push(new SyntaxHighlighter.Match(match[1], match.index, 'keyword'));
            } else if (match[1].match(compiled_procs_pattern) != null) {
                result.push(new SyntaxHighlighter.Match(match[1], match.index, 'functions'));
            } else if (match[1].match(compiled_conds_pattern) != null) {
                result.push(new SyntaxHighlighter.Match(match[1], match.index, 'constants bold'));
            }
            return result;
        }

        function fixLineComment(match, regexInfo)
        {
            var result = [];
            if (match[0][0] != '&' && match[0][0] != '#') {
                result.push(new SyntaxHighlighter.Match(match[0], match.index, 'comments'))
            }
            return result;
        }

        function makeNestedSExpressionPattern(nlevel)
        {
            // a pattern is a combination of elements
            // like s1+c+e1  s2+c+s1+c+e1+c+e2 ... 
            var s1 = '\\(';
            var s2 = '\\[';
            var c = '[^\\(\\)\\[\\]]*';
            var e1 = '\\)';
            var e2 = '\\]';
            if (nlevel == 0) { return c; }
            var L = new Array(c);
            if (nlevel > 1) {
                var first = [s1+c+e1, s2+c+e2];
                var L2 = new Array(first);
                for (i=0; i < nlevel-2; i++) {
                    var L3 = new Array();
                    var v = L2[L2.length-1];
                    for (j=0; j < v.length; j ++) {
                        L3.push([s1,c].concat(v[j]).concat([c,e1]).join(''));
                        L3.push([s2,c].concat(v[j]).concat([c,e2]).join(''));
                    }
                    L2.push(L3);
                }
                for (i=0; i < L2.length; i ++) {
                    L.push(L2[i].join('\|'));
                }
            }
            var pat = L.join('\|');
            //alert(pat);
            return pat;
            //var pattern = s1 + '(?:' + pat + ')*' + e1 + '\|' + s2 + '(?:' + pat + ')*' + e2;
            //return pattern;
        }

        var nested_s_expression_pattern = null; // cache
        function getNestedSExpressionPattern()
        {
            //TODO:consider about the nesting level
            // '10' not work on Firefox 3.6 (maybe too long).
            //  To avoid this limitation, it has to be split short
            if (nested_s_expression_pattern == null) {
                nested_s_expression_pattern = makeNestedSExpressionPattern(9);
            }
            return nested_s_expression_pattern;
        }

        function makeNestedBlockCommentPattern(nlevel)
        {
            var s = '#\\|';
            var c1 = '[\\s\\S]*?';
            var c2 = '[\\s\\S](?!#\\|)*?';
            var e = '\\|#';
            if (nlevel <= 0) return '';
            var onelevel = [s, c1, e].join('');
            var L = new Array(onelevel);
            for (i = 0; i < nlevel-1; i ++) {
                var pat = [s, '(?:', c2, L[L.length-1], c1,'\|', c1, ')*?', e].join('');
                L.push(pat);
            }
            var pattern = L.reverse().join('\|');
            //alert(pattern);
            return pattern;
        }

        //var nested_block_comment_pattern = null; // cache
        function getNestedBlockCommentPattern()
        {
            // TODO:consider about the nesting level
            // this is not so important, typically comments have not so many nesting.
            //if (nested_block_comment_pattern == null) {
            //    nested_block_comment_pattern = makeNestedBlockCommentPattern(5);
            //}
            //return nested_block_comment_pattern;
            return makeNestedBlockCommentPattern(5);
        }

        function fixNumber(match, regexInfo)
        {
            var result = [];
            if (match[0].match(/^[\s\(\)\[\]]/) != null) {
                if (match[1].match(/^(?:[+-]inf\.0|\+nan\.0)$/) != null) {
                    result.push(new SyntaxHighlighter.Match(match[1], match.index+1, 'value bold'));
                } else {
                    result.push(new SyntaxHighlighter.Match(match[1], match.index+1, 'value'))
                }
            }
            return result;
        }

        this.regexList = [
            // S-expression comment (R6RS, SRFI-62)
            { regex : new RegExp('#;[\']?(?:\\((?:' + getNestedSExpressionPattern() + ')*\\))', 'gm'), css: 'color1'},
            { regex : new RegExp('#;[\']?(?:\\[(?:' + getNestedSExpressionPattern() + ')*\\])', 'gm'), css: 'color1'},
            { regex : new RegExp('#;[^\\s\\(\\)\\[\\]]+', 'gm'), css: 'color1'},
            // one line comment (fixed problem with &gt;)
            { regex: /(((?:#|&(?:\w+|#\d+));)|(;.*))/g, func: fixLineComment },
            // block comment nested (R6RS, SRFI-30)
            { regex: new RegExp('(?:' + getNestedBlockCommentPattern() + ')', 'gm'), css: 'color1' },
            // symbols
            { regex: new RegExp('\'[^\(\\]\\)\|\\s\)]+', 'g'), css: 'constants' },
            // #-preceded constant
            { regex: /#\\[\(|\) ]|#(?![\|;bodxei])[^(\]\)|\s)]+/g, css: 'constants' },
            // strings
            { regex: SyntaxHighlighter.regexLib.doubleQuotedString, css: 'string' },
            // numbers
            { regex: new RegExp('[\\s\\S]([-+]inf\\.0|\\+nan\\.0)\\b', 'gi'), func: fixNumber },
            { regex: new RegExp('[\\s\\S]([-+]?(?:[\\d]+/[\\d]+|[\\d]+(\\.[sfdl\\d]+)?))\\b', 'gi'), func: fixNumber },
            { regex: new RegExp('[\\s\\S](#[dei][-+]?(?:[\\d]+/[\\d]+|[\\d]+(\\.[sfdl\\d]+)?))\\b', 'gi'), func: fixNumber },
            { regex: new RegExp('[\\s\\S](#b[-+]?(?:[01]+/[01]+|[01]+(\\.[01]+)?))\\b', 'gi'), func: fixNumber },
            { regex: new RegExp('[\\s\\S](#o[-+]?(?:[0-7]+/[0-7]+|[0-7]+(\\.[0-7]+)?))\\b', 'gi'), func: fixNumber },
            { regex: new RegExp('[\\s\\S](#x[-+]?(?:[a-f\\d]+/[a-f\\d]+|[a-f\\d]+(\\.[a-f\\d]+)?))\\b', 'gi'), func: fixNumber },
            // keyword and procedures (R5RS, R6RS)
            { regex: /([^\s\[\]\(\)]+)/gm, func: fixKeywordOrProcedure },
        ];

    }

    Brush.prototype = new SyntaxHighlighter.Highlighter();
    Brush.aliases = ['scheme'];

    SyntaxHighlighter.brushes.Scheme = Brush;

    // CommonJS
    typeof(exports) != 'undefined' ? exports.Brush = Brush : null;
})();