// MIPS Assembler brush for Syntax Highlighter 2

SyntaxHighlighter.brushes.Asm=function()
{

var registers="v0 v1 a0 a1 a2 a3 t0 t1 t2 t3 t4 t5 t6 t7 t8 t9 s0 s1 s2 s3 s4 s5 s6 s7 sp ra fp gp k0 k1";

var opcodes="add addi addiu addu clo clz la li lui move negu seb seh sub subu rotr rotrv sll sllv sra srav srl srlv and andi ext ins nop nor not or ori wsbh xor xori movn movz slt slti sltiu sltu div divu madd maddu msub msubu mul mult multu mfhi mflo mthi mtlo b bal beq beqz bgez bgezal bgtz blez bltz bltzal bne bnez j jal jalr jr lb lbu lh lhu lw lwl lwr sb sh sw swl swr ulw usw ll sc";

var misc="text data asciiz int float";

this.regexList=[
{regex:/^;.*$/gm,css:"comments"},
{regex:/\s\;.*$/gm,css:"comments"},
{regex:SyntaxHighlighter.regexLib.doubleQuotedString,css:"string"},
{regex:SyntaxHighlighter.regexLib.singleQuotedString,css:"string"},
{regex:new RegExp(this.getKeywords(registers),"gmi"),css:"functions bold"},
{regex:new RegExp(this.getKeywords(opcodes),"gmi"),css:"color1 bold"},
{regex:new RegExp(this.getKeywords(misc),"gmi"),css:"keyword bold"}]

};

SyntaxHighlighter.brushes.Asm.prototype=new SyntaxHighlighter.Highlighter();
SyntaxHighlighter.brushes.Asm.aliases=["mips"];