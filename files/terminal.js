/*
 *  Canvas terminal object code
 */

const TERMINAL_SIZE_X = 80;		// Width
const TERMINAL_SIZE_Y = 25;		// and Height of our virtual terminal (in characters)
var MOUSE_X = 0;
var MOUSE_Y = 0;

// Terminal object
var Terminal = function() {

	var terminal = [];
	var graphicsloaded = 0;		// Have all graphic assets (incl. our font image) been loaded?
	var fontimg;
	var ctx;

	// Initialize the canvas, load our font image and prepare for artistry!
	function SetupTerminal(callback, mcallback, kdcallback, kucallback) {
		canvas = document.getElementById('canvas');
		ctx = canvas.getContext("2d");
		canvas.onmousemove = function(e) {
			 var canvoff = $("#canvas").offset();
			 MOUSE_X = Math.floor((e.clientX - canvoff.left) / 9);
			 MOUSE_Y = Math.floor((e.clientY - canvoff.top) / 16);
			 mcallback();
		};

		document.onkeydown = kdcallback;
		document.onkeyup = kucallback;

		fontimg = new Image();  
		fontimg.src = 'files/font.png';
		fontimg.onload = function() {
			graphicsloaded = 1;
			Clear();
			callback();
		}

		for (var drawy=0; drawy < TERMINAL_SIZE_Y; drawy++) {
			for (var drawx=0; drawx < TERMINAL_SIZE_X; drawx++) {
				terminal[drawy*TERMINAL_SIZE_X+drawx] = {character: 0, color: 0, bgcolor: 0};
			}
		}
	}
	
	// Clear our terminal scren (all characters set to blank, all colors set to black)
	function Clear() {
		for (var drawy = 0; drawy < TERMINAL_SIZE_Y; drawy++) {
			for (var drawx=0; drawx < TERMINAL_SIZE_X; drawx++) {
				SetTerminalChar(drawx,drawy,0,0,0);
			}
		}
	}

	// Places a given character (pchar) in the given foreground (pcolor) and background (pbgcolor) colors on our terminal at the given position (px, py)
	function SetTerminalChar(px, py, pchar, pcolor, pbgcolor) {
		if (pchar < 0 || pchar >= 255) return;
		if (pcolor < 0 || pcolor > 15) return;
		if (pbgcolor < 0 || pbgcolor > 15) return;
		if (px < 0 || px >= TERMINAL_SIZE_X) return;
		if (py < 0 || py >= TERMINAL_SIZE_Y) return;

		if (terminal[py*TERMINAL_SIZE_X+px].character == pchar && terminal[py*TERMINAL_SIZE_X+px].color == pcolor && terminal[py*TERMINAL_SIZE_X+px].bgcolor == pbgcolor) {
			//Already drawn this one
			return;
		}
		DrawTerminalChar(px,py,pchar,pcolor,pbgcolor);
		terminal[py*TERMINAL_SIZE_X+px].character = pchar;
		terminal[py*TERMINAL_SIZE_X+px].color = pcolor;
		terminal[py*TERMINAL_SIZE_X+px].bgcolor = pbgcolor;
	}

	// Draws to the terminal the given character (pchar) in the given foreground (pcolor) and background (pbgcolor) colors at the given position (px, py)
	function DrawTerminalChar(px, py, pchar, pcolor, pbgcolor) {
		if (pchar == 0) {
			ctx.drawImage(fontimg,243,96, 9, 16, px*9, py*16, 9, 16);
			return;
		}
		var tilex = pchar % 32;
		var tiley = pchar >> 5;
		ctx.drawImage(fontimg,243+((pbgcolor&3)*288),96+((pbgcolor>>2)*128), 9, 16, px*9, py*16, 9, 16);
		ctx.drawImage(fontimg,(tilex*9)+((pcolor&3)*288),(tiley*16)+((pcolor>>2)*128), 9, 16, px*9, py*16, 9, 16);
	}

	// Displays the given string in the terminal (using the given coordinates and foreground & background colors)
	function PrintTerminalText(px, py, ptext, pcolor, pbgcolor) {
		var plen = ptext.length;
		var plen2 = 0;		
		while (plen2 < plen) {
			if (ptext.charCodeAt(plen2) != 10) {
				SetTerminalChar(px+plen2,py,ptext.charCodeAt(plen2),pcolor,pbgcolor)
			}
			++plen2;
		}
	}

	return {
		Clear : function() {
			Clear();
		},
		PrintTerminalText : function(px,py,ptext,pcolor,pbgcolor) {
			PrintTerminalText(px,py,ptext,pcolor,pbgcolor);
		},
		SetTerminalChar : function(px,py,pchar,pcolor,pbgcolor) {
			SetTerminalChar(px,py,pchar,pcolor,pbgcolor);
		},
		SetupTerminal : function(callback,mcallback,kdcallback,kucallback) {
			SetupTerminal(callback,mcallback,kdcallback,kucallback);
		}
	};
}();
