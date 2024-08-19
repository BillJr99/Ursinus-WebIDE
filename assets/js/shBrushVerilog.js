/*******************************************************************************
 * shBrushVerilog.js
 * --------------
 * This brush was not developed by me, all credits go to Harry Rose, from
 * Beyond All Repair, in the following address:
 * http://beyondallrepair.com/2012/05/javascript-syntax-highlighting-for-verilog/
 ******************************************************************************/

SyntaxHighlighter.brushes.Verilog = function()
{
	var keywords = 	'always and assign attribute begin buf bufif0 '+
					'bufif1 case casex casez cmos deassign default '+
					'defparam disable edge else end endattribute '+
					'endcase endfunction endmodule endprimitive '+
					'endspecify endtable endtask event for force '+
					'forever fork function highz0 highz1 if ifnone '+
					'initial inout input integer join medium module '+
					'large macromodule nand negedge nmos nor not '+
					'notif0 notif1 or output parameter pmos posedge '+
					'primitive pull0 pull1 pulldown pullup rcmos '+
					'real realtime reg release repeat rnmos rpmos '+
					'rtran rtranif0 rtranif1 scalared signed small '+
					'specify specparam strength strong0 strong1 '+
					'supply0 supply1 table task time tran tranif0 '+
					'tranif1 tri tri0 tri1 triand trior trireg '+
					'unsigned vectored wait wand weak0 weak1 while '+
					'wire wor xnor xor';
	var operators = "= == < > <= >= ~";

	this.regexList = [
		{ regex: SyntaxHighlighter.regexLib.singleLineCComments,        
			css: 'comments' },              // one line comments
		{ regex: /\/\*([^\*][\s\S]*)?\*\//gm,                           
			css: 'comments' },              // multiline comments
		{ regex: /\$.*/gm,                                              
			css: 'function'},
		{ regex: /^\s*\`.*/gm,                                          
			css: 'preprocessor'},
		{ regex: SyntaxHighlighter.regexLib.doubleQuotedString,         
			css: 'string' },                // strings
		{ regex: /\b([\d]+(\.[\d]+)?|0x[a-fA-F0-9]+)\b/gi,              
			css: 'value' },                 // numbers
		{ regex: /[0-9]+'[bdho][a-f0-9]+/gi,                            
			css: 'value'},
		{ regex: new RegExp(this.getKeywords(keywords), 'gm'),          
			css: 'keyword' },               // verilog keyword
		{ regex: new RegExp(this.getKeywords(operators), 'gm'),         
			css: 'operator' }               // verilog keyword
	];

	this.forHtmlScript({
		left    : /(&lt;|<)%[@!=]?/g,
		right   : /%(&gt;|>)/g
	});
};

SyntaxHighlighter.brushes.Verilog.prototype= new SyntaxHighlighter.Highlighter();
SyntaxHighlighter.brushes.Verilog.aliases = ['verilog','Verilog'];
