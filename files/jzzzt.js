/*
 *  Application Initialization 
 */

/*
 *  Declare global variables
 */
var zzt;
var currentboard = 0;
const BOARD_SIZE_X = 60;
const BOARD_SIZE_Y = 25;
var FPS = 10;
var FRAMES = 0;
var bottommessage = "";
var bottomframes = 0;
var GAME_INTERVAL = 0;

var loaded = 0;

var PAD_ENTER = 0;
var PAD_ESC = 0;
var PAD_UP = 0;
var PAD_DOWN = 0;
var PAD_LEFT = 0;
var PAD_RIGHT = 0;
var PAD_SHIFT = 0;
var PAD_PGUP = 0;
var PAD_PGDOWN = 0;
var PAD_PAUSE = 0;

const ZZT_MESSAGE = 1;
const ZZT_GAME = 2;
const ZZT_PAUSE = 3;

var STATE_PAUSE_FRAMES = 0;

const STATE_MESSAGE_OPEN = 1
const STATE_MESSAGE_VIEW = 2
const STATE_MESSAGE_CLOSE = 3
var MESSAGE_CREATOR = -1;
var MESSAGE_STATE = STATE_MESSAGE_OPEN;
var MESSAGE_TITLE="";
var MESSAGE_DATA = "";
var MESSAGE_CURRLINE = 0;
var MESSAGE_HEIGHT = 0;

var ZZT_STATE = ZZT_GAME;


/*
 *  Document onload event handler
 *  (Handles initialization of our application)
 */
$( function() {

	// Make an ajax request for the master game data from the server.
	$.getJSON("demo.json", function(data) { loadzzt(data) });

	// Process the game data we receive and use it to start the game.
	function loadzzt(data) {
		zzt = data;

		// Sanitize object program strings.
		for (var boardcounter = 0; boardcounter <= zzt.totalboards; ++boardcounter) {
			for (var objectcount=0; objectcount <= zzt.board[boardcounter].objectmax; ++objectcount) {
				if (zzt.board[boardcounter].objects[objectcount].proglen > 0) {
					zzt.board[boardcounter].objects[objectcount].program = zzt.board[boardcounter].objects[objectcount].program.replace(/\\n/g,'\n');
				}
			}
		}

		// Initialize our canvas terminal.
		Terminal.SetupTerminal(Ready,Mouse,zzt_KeyDown,zzt_KeyUp);
	}

	function Mouse() {
	}

	// Start our game up by establishing our tick interval timer and displaying a welcome message.
	function Ready() {
		loaded = 1;
		GAME_INTERVAL=setInterval(Update,1000/FPS);

		CreateMessage(-1,"About ZZT...","$The Original ZZT\n     Copyright 1991 Epic MegaGames\n\n\n  -- This is a REGISTERED copy --\n Please do not distribute this game!\n");
		//RedrawEverything();
	}	
		
	/*
	 *	Mock 'key' ui element click handlers.
	 */

  	// lets mess up the load sequence a bit by playing with the "events" lolol ahaha you are not evented yet my friend! (ed: LAWL)
  	$( "#BPBUTTON" ).click( function() {
	  	debug.log('click event');	
	});

	$( "#UBUTTON" ).click( function() {
		var blah = {which:38};
		zzt_KeyDown(blah);
		zzt_KeyUp(blah);
	});

	$( "#DBUTTON" ).click( function() {
		var blah = {which:40};
		zzt_KeyDown(blah);
		zzt_KeyUp(blah);
	});


	$( "#LBUTTON" ).click( function() {
		var blah = {which:37};
		zzt_KeyDown(blah);
		zzt_KeyUp(blah);
	});

	$( "#RBUTTON" ).click( function() {
		var blah = {which:39};
		zzt_KeyDown(blah);
		zzt_KeyUp(blah);
	});

	$( "#BMBUTTON" ).click( function() {
		if(loaded==1) {
			Terminal.Clear();
			if(currentboard>0) --currentboard;
		}
		//MoveObject(1,-1,0);
		//RenderTerminal();
	});

	$( "#BPBUTTON" ).click( function() {
		if(loaded==1) {
			Terminal.Clear()
			if(currentboard<zzt.totalboards) ++currentboard;
		}
		//MoveObject(1,1,0);
		//RenderTerminal();
	});

	// Handle KeyDown events as needed.
	function zzt_KeyDown(e) {
		switch (e.which) {
			case 27: PAD_ESC=1; break;
			case 13: PAD_ENTER=1; break;
			case 33: PAD_PGUP=1; break;
			case 34: PAD_PGDOWN=1; break;
			// down
			case 40: PAD_DOWN=1; break;
			// up
			case 38: PAD_UP=1; break;
			// left
			case 37: PAD_LEFT=1; break;
			// right
			case 39: PAD_RIGHT=1; break;
			case 16: PAD_SHIFT=1; break;
			case 80: PAD_PAUSE=1; break;
			default:
				debug.log(e.which); break;    
		}

		switch(ZZT_STATE) {
			case ZZT_PAUSE:
				if(PAD_UP || PAD_DOWN || PAD_LEFT || PAD_RIGHT) {
					ZZT_STATE=ZZT_GAME;
					zzt_KeyDown(e);
				}
				break;
			case ZZT_MESSAGE:
				var linesmsg = CountLines(MESSAGE_DATA);
				if(PAD_UP) MESSAGE_CURRLINE--;
				if(PAD_DOWN) MESSAGE_CURRLINE++;
				if(PAD_PGUP) MESSAGE_CURRLINE-=14;
				if(PAD_PGDOWN) MESSAGE_CURRLINE+=14;
				if(MESSAGE_CURRLINE<0) MESSAGE_CURRLINE=0;
				if(MESSAGE_CURRLINE>linesmsg-15) MESSAGE_CURRLINE=linesmsg-15;
				if(PAD_ESC) MESSAGE_STATE=STATE_MESSAGE_CLOSE;
				if(PAD_ENTER) {
					if(SelectMenu()==1) MESSAGE_STATE=STATE_MESSAGE_CLOSE;
					PAD_ENTER = 0;
				}
				DrawMessage();
				break;
			case ZZT_GAME:
				if(currentboard!=0) {
					if(PAD_PAUSE==1) {
						ZZT_STATE=ZZT_PAUSE;	
					}
					//player
					if(PAD_DOWN==1 || PAD_UP==1) {
						if(PAD_SHIFT==1) Template_Player.Shoot(0,0,(PAD_DOWN-PAD_UP),0);
						else MoveObject(0,0,PAD_DOWN-PAD_UP);
					} else if(PAD_LEFT==1 || PAD_RIGHT==1) {
						if(PAD_SHIFT==1) Template_Player.Shoot(0,(PAD_RIGHT-PAD_LEFT),0,0);
						else MoveObject(0,PAD_RIGHT-PAD_LEFT,0);
					}
				}
				break;
		}
	}
	
	function zzt_KeyUp(e) {
		switch (e.which) {
			case 13: PAD_ENTER=0; return;
			case 27: PAD_ESC=0; return;

			case 33: PAD_PGUP=0; return;
			case 34: PAD_PGDOWN=0; return;
			// down
			case 40: PAD_DOWN=0; return;
			// up
			case 38: PAD_UP=0; return;
			// left
			case 37: PAD_LEFT=0; return;
			// right
			case 39: PAD_RIGHT=0; return;    
			case 16: PAD_SHIFT=0; return;
			case 80: PAD_PAUSE=0; return;
		}
		return;
	}

 
});

