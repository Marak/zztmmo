// Draws the viewable area of the current board at the given position, taking into account lighting conditions.
function DrawBoardPosition(drawx,drawy) {
	var foundID = zzt.board[currentboard].text[drawy][drawx].ID;
	var foundCOL = zzt.board[currentboard].text[drawy][drawx].color;
	var lit = true;
	zzt.tcycles = 1; //Remove this later - Torch Cycles start at 200 when torch used.  Counts down from frames.
	if (zzt.board[currentboard].dark == true) {
		var distx = drawx - (zzt.board[currentboard].objects[0].x-1);
		var disty = drawy - (zzt.board[currentboard].objects[0].y-1);
		if (!IsHit(drawx,drawy,1,zzt.board[currentboard].objects[0].x-1,zzt.board[currentboard].objects[0].y-1,4)) lit=false;
		if (zzt.tcycles == 0) lit=false;
	}

	if (foundID < 0x2F) {
		switch(foundID) {
			case 0x4:
				if (currentboard == 0) Terminal.SetTerminalChar(drawx,drawy,219,0,0);
				else Terminal.SetTerminalChar(drawx,drawy,GetCharacter(foundID,foundCOL),(foundCOL & 15),(foundCOL>>4));
				break;
			case 0xA:
				if (lit == true) Terminal.SetTerminalChar(drawx,drawy,GetCharacter(foundID,foundCOL),9+(FRAMES%7),(foundCOL>>4));
				else Terminal.SetTerminalChar(drawx,drawy,177,8,0);
				break;
			case 0x24:
				var fID = GetObjectNumberByCoordinate(drawx,drawy);				
				if (lit == true) Terminal.SetTerminalChar(drawx,drawy,zzt.board[currentboard].objects[fID].o1,(foundCOL & 15),(foundCOL>>4));
				else Terminal.SetTerminalChar(drawx,drawy,177,8,0);
				break;
			case 0x13:
				if (lit == true) Terminal.SetTerminalChar(drawx,drawy,GetCharacter(foundID,foundCOL),(FRAMES%(FPS>>1))>(FPS>>3)?15:8,9);
				else Terminal.SetTerminalChar(drawx,drawy,177,8,0);
				break;
			default:
				if (lit == true) Terminal.SetTerminalChar(drawx,drawy,GetCharacter(foundID,foundCOL),(foundCOL & 15),(foundCOL>>4));
				else Terminal.SetTerminalChar(drawx,drawy,177,8,0);
				break;
		}
	}
	if (foundID >= 0x2F && foundID <= 0x34) {
		if (lit == true) Terminal.SetTerminalChar(drawx,drawy,foundCOL,15,foundID-46);
		else Terminal.SetTerminalChar(drawx,drawy,177,8,0);
	}
	if (foundID == 0x35) {
		if (lit == true) Terminal.SetTerminalChar(drawx,drawy,foundCOL,15,0);
		else Terminal.SetTerminalChar(drawx,drawy,177,8,0);
	}
}

// Takes the given object id (fID) and returns the appropriate character code (in hex) to be displayed for that character.
function GetCharacter(fID,fCOLOR) {
	switch (fID) {
		case 0x0: //Empty
		case 0x1: //Special Invisible Wall
		case 0x1C: //Invisible Wall
			return 0x0;
			break;
		case 0x4: //Player
			return 0x02;
			break;
		case 0x5: //Ammo
			return 0x84;
			break;
		case 0x6: //Torch
			return 0x9D;
			break;
		case 0x7: //Gem
			return 0x04;
			break;
		case 0x8: //Key
			return 0x0C;
			break;
		case 0x9: //Door
			return 0x0A;
			break;
		case 0x0A: //Scroll
			return 0xE8;
			break;
		case 0x0B: //Passage
			return 0xF0;
			break;
		case 0x0C: //Duplicator
			return 46;
			break;
		case 0x0D: //Bomb
			return 0x0B;
			break;
		case 0x0E: //Energizer
			return 0x7F;
			break;
		case 0x0F: //Star
		case 0x10: //Clockwise Conveyor
		case 0x11: //Counterclockwise Conveyor
			return 0x58; //FIXME
			break;
		case 0x12: //Bullet
			return 0xF8;
			break;
		case 0x13: //Water
		case 0x14: //Forest
			return 0xB0;
			break;
		case 0x15: //Solid
			return 0xDB;
			break;
		case 0x16: //Normal
			return 0xB2;
			break;
		case 0x17: //Breakable
			return 0xB1;
			break;
		case 0x18: //Boulder
			return 0xFE;
			break;
		case 0x19: //NS Slider
			return 0x12;
			break;
		case 0x1A: //EW Slider
			return 0x1D;
			break;
		case 0x1B: //Fake
			return 0xB2;
			break;
		case 0x1D: //Blink Wall
		case 0x1E: //Transporter
		case 0x1F: //Line
			return 0x58;  //FIXME
			break;
		case 0x20: //Ricochet
			return 0x2A;
			break;
		case 0x21: //Horizontal Blink Wall Ray
			return 0xCD;
			break;
		case 0x22: //BEAR
			return 0x99;
			break;
		case 0x23: //RUFFIAN
			return 0x05;
			break;
		case 0x24: //Object
			return 0x02;
			break;
		case 0x25: //Slime
			return 0x2A;
			break;
		case 0x26: //Slime
			return 0x5E;
			break;
		case 0x27: //Spinning Gun
			return 0x58; //FIXME
			break;
		case 0x28: //Pusher
			return 0x58; //FIXME
			break;
		case 0x29: //Lion
			return 0xEA;
			break;
		case 0x2A: //Tiger
			return 0xE3;
			break;
		case 0x2B: //Vertical Blink Wall Ray
			return 0xBA;
			break;
		case 0x2C: //Centipede Head
			return 0xE9;
			break;
		case 0x2D: //Centipede Head
			return 0x4F;
			break;
		case 0x2F: //Blue text
		case 0x30: //Green text
		case 0x31: //Cyan Text
		case 0x32: // Red Text
		case 0x33://Purple Text
		case 0x34://Yellow Text
		case 0x35://White Text
		case 0x36: //White blinking text
		case 0x37: //Blue blinking text
		case 0x38: //Green blinking Text
		case 0x39: //Cyan Blinking Text
		case 0x3A://Red Blinking Text
		case 0x3B://Purple Blinking Text
		case 0x3C://Yellow blinking Text
		case 0x3D://Grey blinking Text
			return fCOLOR;
			break;
		default:
			return 0x58;
	}
}

// Tests for collision at the given position on the current board. Also handles player collision with items which can be picked up, such as gems or torches.
function Solid(pID,px,py) {
	switch (zzt.board[currentboard].text[py][px].ID) {
		case 0x0: //Empty
			return false;
			break;
		case 0x1: //Special Invisible Wall
			return false;
			break;
		case 0x1C: //Invisible Wall
			if (pID == 0) {
				zzt.board[currentboard].text[py][px].ID=0x16;
			}
			return true;
			break;
		case 0x4: //Player
			return true;
			break;
		case 0x5: //Ammo
			if (pID == 0) {
				zzt.board[currentboard].text[py][px].ID=0;
				zzt.board[currentboard].text[py][px].color=0;
				zzt.ammo+=5;
				WriteMessage("Ammunition - 5 shots per container.");
			}
			return false;
			break;
		case 0x6: //Torch
			if (pID == 0) {
				zzt.board[currentboard].text[py][px].ID=0;
				zzt.board[currentboard].text[py][px].color=0;
				zzt.torches++;
				WriteMessage("Torch - used for lighting in the underground.");
			}
			return false;
			break;
		case 0x7: //Gem
			if (pID == 0) {
				zzt.board[currentboard].text[py][px].ID=0;
				zzt.board[currentboard].text[py][px].color=0;
				zzt.gems++;
				zzt.health++;
				zzt.score+=10;
				WriteMessage("Gems give you Health!");
			}
			return false;
			break;
		case 0x8: //Key
			//TODO: GIVE KEY if possible
			if (pID == 0) {
				if (zzt.board[currentboard].text[py][px].color == 9) {
					if (zzt.bluekey == 0) {
						zzt.bluekey=1;
						WriteMessage("You now have the Blue key.");
						zzt.board[currentboard].text[py][px].ID=0;
						zzt.board[currentboard].text[py][px].color=0;
					} else {
						WriteMessage("You already have a Blue key!");
						return true;
					}
				}
				if (zzt.board[currentboard].text[py][px].color == 10) {
					if (zzt.greenkey == 0) {
						zzt.greenkey=1;
						WriteMessage("You now have the Green key.");
						zzt.board[currentboard].text[py][px].ID=0;
						zzt.board[currentboard].text[py][px].color=0;
					} else {
						WriteMessage("You already have a Green key!");
						return true;
					}
				}
				if (zzt.board[currentboard].text[py][px].color == 11) {
					if (zzt.cyankey == 0) {
						zzt.cyankey=1;
						WriteMessage("You now have the Cyan key.");
						zzt.board[currentboard].text[py][px].ID=0;
						zzt.board[currentboard].text[py][px].color=0;
					} else {
						WriteMessage("You already have a Cyan key!");
						return true;
					}
				}
				if (zzt.board[currentboard].text[py][px].color == 12) {
					if (zzt.redkey == 0) {
						zzt.redkey=1;
						WriteMessage("You now have the Red key.");
						zzt.board[currentboard].text[py][px].ID=0;
						zzt.board[currentboard].text[py][px].color=0;
					} else {
						WriteMessage("You already have a Blue key!");
						return true;
					}
				}
				if (zzt.board[currentboard].text[py][px].color == 13) {
					if (zzt.purplekey == 0) {
						zzt.purplekey=1;
						WriteMessage("You now have the Purple key.");
						zzt.board[currentboard].text[py][px].ID=0;
						zzt.board[currentboard].text[py][px].color=0;
					} else {
						WriteMessage("You already have a Purple key!");
						return true;
					}
				}
				if (zzt.board[currentboard].text[py][px].color == 14) {
					if (zzt.yellowkey == 0) {
						zzt.yellowkey = 1;
						WriteMessage("You now have the Yellow key.");
						zzt.board[currentboard].text[py][px].ID=0;
						zzt.board[currentboard].text[py][px].color=0;
					}
					else
					{
						WriteMessage("You already have a Yellow key!");
						return true;
					}
				}
				if(zzt.board[currentboard].text[py][px].color==15) {
					if(zzt.whitekey==0) {
						zzt.whitekey=1;
						WriteMessage("You now have the White key.");
						zzt.board[currentboard].text[py][px].ID=0;
						zzt.board[currentboard].text[py][px].color=0;
					} else {
						WriteMessage("You already have a White key!");
						return true;
					}
				}
			}
			return false;
			break;
		case 0x9: //Door
			if(pID==0) {
				switch(zzt.board[currentboard].text[py][px].color>>4) {
					case 1:
						if (zzt.bluekey == 1) {
							zzt.bluekey = 0;
							WriteMessage("The Blue door is now open.");
							zzt.board[currentboard].text[py][px].ID = 0;
							zzt.board[currentboard].text[py][px].color = 0;
							return false;
						} else WriteMessage("The Blue door is locked.");
						break;
					case 2:
						if(zzt.greenkey==1)	{
							zzt.greenkey = 0;
							WriteMessage("The Green door is now open.");
							zzt.board[currentboard].text[py][px].ID = 0;
							zzt.board[currentboard].text[py][px].color = 0;
							return false;
						}
						else WriteMessage("The Green door is locked.");
						break;
					case 3:
						if (zzt.cyankey == 1) {
							zzt.cyankey = 0;
							WriteMessage("The Cyan door is now open.");
							zzt.board[currentboard].text[py][px].ID=0;
							zzt.board[currentboard].text[py][px].color=0;
							return false;
						} else WriteMessage("The Cyan door is locked.");
						break;
					case 4:
						if (zzt.redkey == 1) {
							zzt.redkey = 0;
							WriteMessage("The Red door is now open.");
							zzt.board[currentboard].text[py][px].ID=0;
							zzt.board[currentboard].text[py][px].color=0;
							return false;
						} else WriteMessage("The Red door is locked.");
						break;
					case 5:
						if (zzt.purplekey == 1) {
							zzt.purplekey = 0;
							WriteMessage("The Purple door is now open.");
							zzt.board[currentboard].text[py][px].ID=0;
							zzt.board[currentboard].text[py][px].color=0;
							return false;
						} else WriteMessage("The Purple door is locked.");
						break;
					case 6:
						if (zzt.yellowkey == 1) {
							zzt.yellowkey = 0;
							WriteMessage("The Yellow door is now open.");
							zzt.board[currentboard].text[py][px].ID=0;
							zzt.board[currentboard].text[py][px].color=0;
							return false;
						} else WriteMessage("The Yellow door is locked.");
						break;
					case 7:
						if(zzt.whitekey==1) {
							zzt.whitekey = 0;
							WriteMessage("The White door is now open.");
							zzt.board[currentboard].text[py][px].ID=0;
							zzt.board[currentboard].text[py][px].color=0;
							return false;
						} else WriteMessage("The White door is locked.");
						break;
				}
			}
			return true;
			break;
		case 0x0A: //Scroll
			return 0xE8;
			break;
		case 0x0B: //Passage
			return true;
			break;
		case 0x0C: //Duplicator
			return 46;
			break;
		case 0x0D: //Bomb
			return 0x0B;
			break;
		case 0x0E: //Energizer
			return 0x7F;
			break;
		case 0x0F: //Star
		case 0x10: //Clockwise Conveyor
		case 0x11: //Counterclockwise Conveyor
			return 0x58; //FIXME
			break;
		case 0x12: //Bullet
			return 0xF8;
			break;
		case 0x13: //Water
			return true;
		case 0x14: //Forest
			if (pID == 0) {
				zzt.board[currentboard].text[py][px].ID = 0;
				zzt.board[currentboard].text[py][px].color = 0;
				return false;
			}
			return true;
			break;
		case 0x15: //Solid
			return 0xDB;
			break;
		case 0x16: //Normal
			return 0xB2;
			break;
		case 0x17: //Breakable
			var sSTUFF = GetIDFromObject(pID);
			switch(sSTUFF.ID) {
				case 0x12:
				case 0x0F:
				case 0x22:
					zzt.board[currentboard].text[py][px].ID=0;
					zzt.board[currentboard].text[py][px].color=0;
				default:
			}
			return 0xB1;
			break;
		case 0x18: //Boulder
			return 0xFE;
			break;
		case 0x19: //NS Slider
			return 0x12;
			break;
		case 0x1A: //EW Slider
			return 0x1D;
			break;
		case 0x1B: //Fake
			return false;
			break;
		case 0x1D: //Blink Wall
		case 0x1E: //Transporter
		case 0x1F: //Line
			return 0x58;  //FIXME
			break;
		case 0x20: //Ricochet
			return 0x2A;
			break;
		case 0x21: //Horizontal Blink Wall Ray
			return 0xCD;
			break;
		case 0x22: //BEAR
			return 0x99;
			break;
		case 0x23: //RUFFIAN
			return 0x05;
			break;
		case 0x24: //Object
			return true;
			break;
		case 0x25: //Slime
			return true;
			break;
		case 0x26: //Slime
			return true;
			break;
		case 0x27: //Spinning Gun
			return true;
			break;
		case 0x28: //Pusher
			return true;
			break;
		case 0x29: //Lion
			return true;
			break;
		case 0x2A: //Tiger
			return true;
			break;
		case 0x2B: //Vertical Blink Wall Ray
			return true;
			break;
		case 0x2C: //Centipede Head
			return true;
			break;
		case 0x2D: //Centipede Head
			return 0x4F;
			break;
		case 0x2F: //Blue text
		case 0x30: //Green text
		case 0x31: //Cyan Text
		case 0x32: // Red Text
		case 0x33://Purple Text
		case 0x34://Yellow Text
		case 0x35://White Text
		case 0x36: //White blinking text
		case 0x37: //Blue blinking text
		case 0x38: //Green blinking Text
		case 0x39: //Cyan Blinking Text
		case 0x3A://Red Blinking Text
		case 0x3B://Purple Blinking Text
		case 0x3C://Yellow blinking Text
		case 0x3D://Grey blinking Text
			return true;
			break;
		default:
			return false;
	}
	return false;
}

// Returns true/false if the object at the given location on the board is 'bumpable', or, can be activated to perform an action through a player collision.
function Bumpable(pDIRX,pDIRY,px,py) {
	switch(zzt.board[currentboard].text[py][px].ID) {
		case 0x0: //Empty
			return false;
			break;
		case 0x1: //Special Invisible Wall
			return false;
			break;
		case 0x1C: //Invisible Wall
			return false;
			break;
		case 0x4: //Player
			return false;
			break;
		case 0x5: //Ammo
			return true;
			break;
		case 0x6: //Torch
			return true;
			break;
		case 0x7: //Gem
			return true;
			break;
		case 0x8: //Key
			return true;
			break;
		case 0x9: //Door
			return false;
			break;
		case 0x0A: //Scroll
			return false;
			break;
		case 0x0B: //Passage
			return false;
			break;
		case 0x0C: //Duplicator
			return false;
			break;
		case 0x0D: //Bomb
			return true;
			break;
		case 0x0E: //Energizer
			return true;
			break;
		case 0x0F: //Star
		case 0x10: //Clockwise Conveyor
		case 0x11: //Counterclockwise Conveyor
			return false; //FIXME
			break;
		case 0x12: //Bullet
			return false;
			break;
		case 0x13: //Water
			return false;
		case 0x14: //Forest
			return false;
			break;
		case 0x15: //Solid
			return false;
			break;
		case 0x16: //Normal
			return false;
			break;
		case 0x17: //Breakable
			return false;
			break;
		case 0x18: //Boulder
			return true;
			break;
		case 0x19: //NS Slider
			if(pDIRY!=0) return true;
			return false;
			break;
		case 0x1A: //EW Slider
			if(pDIRX!=0) return true;
			return false;
			break;
		case 0x1B: //Fake
			return false;
			break;
		case 0x1D: //Blink Wall
		case 0x1E: //Transporter
		case 0x1F: //Line
			return false;  //FIXME
			break;
		case 0x20: //Ricochet
			return false;
			break;
		case 0x21: //Horizontal Blink Wall Ray
			return false;
			break;
		case 0x22: //BEAR
			return true;
			break;
		case 0x23: //RUFFIAN
			return true;
			break;
		case 0x24: //Object
			return true;
			break;
		case 0x25: //Slime
			return true;
			break;
		case 0x26: //Slime
			return true;
			break;
		case 0x27: //Spinning Gun
			return true;
			break;
		case 0x28: //Pusher
			return true;
			break;
		case 0x29: //Lion
			return true;
			break;
		case 0x2A: //Tiger
			return true;
			break;
		case 0x2B: //Vertical Blink Wall Ray
			return false;
			break;
		case 0x2C: //Centipede Head
			return true;
			break;
		case 0x2D: //Centipede Head
			return true;
			break;
		case 0x2F: //Blue text
		case 0x30: //Green text
		case 0x31: //Cyan Text
		case 0x32: // Red Text
		case 0x33://Purple Text
		case 0x34://Yellow Text
		case 0x35://White Text
		case 0x36: //White blinking text
		case 0x37: //Blue blinking text
		case 0x38: //Green blinking Text
		case 0x39: //Cyan Blinking Text
		case 0x3A://Red Blinking Text
		case 0x3B://Purple Blinking Text
		case 0x3C://Yellow blinking Text
		case 0x3D://Grey blinking Text
			return false;
			break;
		default:
			return false;
	}
	return false;
}

// Performs a 'bump', or, collision based activation, on the object which exists on the current board at the given position.
function Bump(pID,pDX,pDY) {
	var px = zzt.board[currentboard].objects[pID].x - 1;
	var py = zzt.board[currentboard].objects[pID].y - 1;
	var startx = px;
	var endx = px;
	var incx = pDX;
	if (pDX == -1) { endx = -1; }
	if (pDX == 1) { endx = BOARD_SIZE_X; }

	var starty = py;
	var endy = py;
	var incy = pDY;
	if (pDY == -1) { endy = -1; }
	if (pDY == 1) { endy = BOARD_SIZE_Y; }

	for (bumpx=startx; bumpx += incx; bumpx != endx) {
		for (bumpy=starty; bumpy +=incy; bumpy!=endy) {
			var willbump = true;
			if (Bumpable(pDX,pDY,px,py)) {

			}

			if (willbump == false) {
				if(starty != py || starty != px) return true;
				return false;
			}
			//zzt.board[currentboard].text[py][px]
		}
	}
}

// Sets the 'status' text which is displayed at the bottom of the terminal.
function WriteMessage(pmsg) {
	bottommessage = " "+pmsg+" ";
	bottomframes = FPS * 4;	//4 seconds
}

function FindPassageDestination(pDEST,pCOLOR) {
	//TODO:  Sanitize inputs
	currentboard = pDEST;

	for (tfindx=0; tfindx < BOARD_SIZE_X; ++tfindx) {
		for (tfindy=0; tfindy < BOARD_SIZE_Y; ++tfindy) {
			if (zzt.board[currentboard].text[tfindy][tfindx].ID == 0x0B && zzt.board[currentboard].text[tfindy][tfindx].color>>4 == pCOLOR) {
				TeleportObject(0,tfindx+1,tfindy+1);
			}
		}
	}
}

// 'Teleports' a given object from its current location to the given location on the current board.
function TeleportObject(fID,fDX,fDY) {
	//Accepts Object ID, X and Y locations as input
	//X and Y are starting with 1, not 0
	var tempx = fDX;
	var tempy = fDY;

	if (tempx < 1 || tempx > BOARD_SIZE_X) return -1;
	if (tempy < 1 || tempy > BOARD_SIZE_Y) return -1;

	var readID =  zzt.board[currentboard].text[zzt.board[currentboard].objects[fID].y-1][zzt.board[currentboard].objects[fID].x-1].ID;
	var readcol = zzt.board[currentboard].text[zzt.board[currentboard].objects[fID].y-1][zzt.board[currentboard].objects[fID].x-1].color;

	zzt.board[currentboard].text[zzt.board[currentboard].objects[fID].y-1][zzt.board[currentboard].objects[fID].x-1].ID = zzt.board[currentboard].objects[fID].utile;
	zzt.board[currentboard].text[zzt.board[currentboard].objects[fID].y-1][zzt.board[currentboard].objects[fID].x-1].color = zzt.board[currentboard].objects[fID].ucolor;
//	DrawBoardPosition(zzt.board[currentboard].objects[fID].x-1,zzt.board[currentboard].objects[fID].y-1);

	zzt.board[currentboard].objects[fID].utile = zzt.board[currentboard].text[tempy-1][tempx-1].ID;
	zzt.board[currentboard].objects[fID].ucolor = zzt.board[currentboard].text[tempy-1][tempx-1].color;
	zzt.board[currentboard].objects[fID].x = tempx;
	zzt.board[currentboard].objects[fID].y = tempy;
	zzt.board[currentboard].text[tempy-1][zzt.board[currentboard].objects[fID].x-1].ID = readID;
	zzt.board[currentboard].text[tempy-1][zzt.board[currentboard].objects[fID].x-1].color = readcol;

//	DrawBoardPosition(zzt.board[currentboard].objects[fID].x-1,zzt.board[currentboard].objects[fID].y-1);
	return 0;
}

// Returns the ID for a given game object.
function GetIDFromObject(pOBJECT) {
	if (zzt.board[currentboard].objects[pOBJECT] == null) return {ID: 0,color: 0};
	if (zzt.board[currentboard].objects[pOBJECT].x == 0 || zzt.board[currentboard].objects[pOBJECT].y == 0) return {ID: 0,color: 0};

	return {
		ID: zzt.board[currentboard].text[zzt.board[currentboard].objects[pOBJECT].y-1][zzt.board[currentboard].objects[pOBJECT].x-1].ID,
		color: zzt.board[currentboard].text[zzt.board[currentboard].objects[pOBJECT].y-1][zzt.board[currentboard].objects[pOBJECT].x-1].color
	};
}

// Returns the name for a given game object.
function GetObjectName(pOBJECT) {
	if (zzt.board[currentboard].objects[pOBJECT] == null) return "";
	if (zzt.board[currentboard].objects[pOBJECT].proglen <= 0) return "";
	var porigpos = zzt.board[currentboard].objects[pOBJECT].progpos;
	zzt.board[currentboard].objects[pOBJECT].progpos = 0;
	var pline = ParseLine(pOBJECT);
	zzt.board[currentboard].objects[pOBJECT].progpos = porigpos;
	if (pline.command == COMMAND_NAME) {
		return pline.raw.slice(1,pline.raw.length-1);
	}
	return "";
}

// Broadcasts a program message from an object to one or more objects (possibly including itself).
function SendObjectBroadcast(pNAME,pFROMOBJECT,pMSG) {
	var startbroadcast = 0;
	var endbroadcast = 0;

	if (pNAME == "ALL") {
		for (startbroadcast=0; startbroadcast <= zzt.board[currentboard].objectmax; ++startbroadcast) {
			SendObjectMessage(startbroadcast,pFROMOBJECT,pMSG)
		}
	} else if (pNAME=="OTHERS") {
		for (startbroadcast = 0; startbroadcast <= zzt.board[currentboard].objectmax; ++startbroadcast) {
			if (startbroadcast != pFROMOBJECT) SendObjectMessage(startbroadcast,pFROMOBJECT,pMSG)
		}
	} else {
		for (startbroadcast=0; startbroadcast <= zzt.board[currentboard].objectmax; ++startbroadcast) {
			if (GetObjectName(startbroadcast).toUpperCase() == pNAME) SendObjectMessage(startbroadcast,pFROMOBJECT,pMSG)
		}
	}
}

// Sends a program message from one object (pFROMOBJECT) to another (pOBJECT)
function SendObjectMessage(pOBJECT,pFROMOBJECT,pMSG) {
	//TODO:  Sanitize
	//TODO:  Fill in with nonobject stuff
	//alert("Got a " + pMSG + " from Object " + pFROMOBJECT);
	if (zzt.board[currentboard].objects[pOBJECT] == null) return 0;
	if (zzt.board[currentboard].objects[pOBJECT].o2 == 1) return 0;	
	var origpos = zzt.board[currentboard].objects[pOBJECT].progpos;
	//If o2==1 then the object is #lock'd
	zzt.board[currentboard].objects[pOBJECT].progpos = 0;
	while (zzt.board[currentboard].objects[pOBJECT].progpos<zzt.board[currentboard].objects[pOBJECT].proglen) {
		var pline = ParseLine(pOBJECT);
		if (pline.command == COMMAND_LABEL) {
			if (pline.argv[0].toUpperCase() == pMSG) {
				return 1;
			}
		}
		zzt.board[currentboard].objects[pOBJECT].progpos=pline.position;
	}
	zzt.board[currentboard].objects[pOBJECT].progpos=origpos;
	return -1;
}

// Moves the given object from its current position to the given position.
function MoveObject(fID,fDX,fDY) {
	if (fID == 0 && currentboard == 0) return -1; //Menu Options instead

	var tempx = zzt.board[currentboard].objects[fID].x + fDX;
	var tempy = zzt.board[currentboard].objects[fID].y + fDY;

	if (tempx < 1 || tempx > BOARD_SIZE_X) return -1;
	if (tempy < 1 || tempy > BOARD_SIZE_Y) return -1;

	var fobject = GetObjectNumberByCoordinate(tempx-1,tempy-1);
	if (fobject != -1) {
		switch(zzt.board[currentboard].text[zzt.board[currentboard].objects[fobject].y-1][zzt.board[currentboard].objects[fobject].x-1].ID) {
			case 0x0B: //Passage
				if (fID == 0) {
					FindPassageDestination(zzt.board[currentboard].objects[fobject].o3,zzt.board[currentboard].text[zzt.board[currentboard].objects[fobject].y-1][zzt.board[currentboard].objects[fobject].x-1].color>>4);
					ZZT_STATE = ZZT_PAUSE;
	//				WriteMessage("Passage");
					return 0;
				}
			break;

			case 0x0A:  //Scroll
				//Enable zzt-oop when you bump this object
				if (fID == 0) {
					zzt.board[currentboard].objects[fobject].o1=1;
				}
			case 0x24:  //Object
				if(fID==0) SendObjectMessage(fobject,fID,"TOUCH");
			break;
		}

		return -1;
		//alert("Bumped into object");
		//Send BUMP Message instead
	}

	if (Solid(fID,tempx-1,tempy-1) == false) {
		//if(Bump(fID,fDX,fDY)==true)
			
		var readID =  zzt.board[currentboard].text[zzt.board[currentboard].objects[fID].y-1][zzt.board[currentboard].objects[fID].x-1].ID;
		var readcol = zzt.board[currentboard].text[zzt.board[currentboard].objects[fID].y-1][zzt.board[currentboard].objects[fID].x-1].color;

		zzt.board[currentboard].text[zzt.board[currentboard].objects[fID].y-1][zzt.board[currentboard].objects[fID].x-1].ID = zzt.board[currentboard].objects[fID].utile;
		zzt.board[currentboard].text[zzt.board[currentboard].objects[fID].y-1][zzt.board[currentboard].objects[fID].x-1].color = zzt.board[currentboard].objects[fID].ucolor;

		zzt.board[currentboard].objects[fID].utile = zzt.board[currentboard].text[tempy-1][tempx-1].ID;
		zzt.board[currentboard].objects[fID].ucolor = zzt.board[currentboard].text[tempy-1][tempx-1].color;
		zzt.board[currentboard].objects[fID].x = tempx;
		zzt.board[currentboard].objects[fID].y = tempy;
		zzt.board[currentboard].text[tempy-1][zzt.board[currentboard].objects[fID].x-1].ID = readID;
		zzt.board[currentboard].text[tempy-1][zzt.board[currentboard].objects[fID].x-1].color = readcol;

		return 0;
	} else {
		if (fID == 0) WriteMessage("Your way is blocked!");
		return -1;
	}
}

// Tim Sweeney sure does love to paint (haha!)
// Returns the id of the object which exists on the current board at the given position.
function GetObjectNumberByCoordinate(pcx,pcy)
{
	var looper;
	for(looper=0;looper<=zzt.board[currentboard].objectmax;++looper)
	{
		if(zzt.board[currentboard].objects[looper]!=null)
		{
			if(zzt.board[currentboard].objects[looper].x-1 == pcx && zzt.board[currentboard].objects[looper].y-1 == pcy) return looper;
		}
	}
	return -1;
}

// Returns true if the circular area expressed by (x1, y1, r1 as radius) overlaps with the cirular area expressed by (x2, y2, r2 as radius).
function IsHit(x1,y1,r1,x2,y2,r2) {
    var d = r1 + r2;
    var a = (x2 - x1)/1.42;
    var b = y2 - y1;
    if ( a > d || a < -d || b > d || b < -d) return 0;
    return a*a + b*b < d*d;
}

function GrabMessage(pobj)
{
	if(zzt.board[currentboard].objects[pobj].progpos>=zzt.board[currentboard].objects[pobj].proglen) return "ERROR";
	var tfindcommand="";
	while(zzt.board[currentboard].objects[pobj].progpos<zzt.board[currentboard].objects[pobj].proglen)
	{
		var pline = ParseLine(pobj);
		if(pline.command==COMMAND_TEXT || pline.command==COMMAND_PRETTYTEXT || pline.command==COMMAND_MENU)
		{
			zzt.board[currentboard].objects[pobj].progpos=pline.position;
			tfindcommand+=pline.raw;
		}
		else return tfindcommand.slice(0,tfindcommand.length-1);
	}
	return tfindcommand.slice(0,tfindcommand.length-1);
}

function SGN(pvalue)
{
	if(pvalue>0) return 1;
	if(pvalue<0) return -1;
	return 0;
}

function GetDirection(ppline,ppobj)
{
	var retval = {x:0,y:0};
	var termer = 0;
	if(ppline.command==COMMAND_COMMAND) termer=1;

	while(ppline.argc>termer)
	{
		switch(ppline.argv[ppline.argc-1].toUpperCase())
		{
			case "N":
			case "NORTH":
				retval.x = 0;
				retval.y = -1;
				break;
			case "W":
			case "WEST":
				retval.x = -1;
				retval.y = 0;
				break;
			case "E":
			case "EAST":
				retval.x = 1;
				retval.y = 0;
				break;
			case "S":
			case "SOUTH":
				retval.y = 1;
				retval.x = 0;
				break;
			case "I":
			case "IDLE":
				//Nothin
				break;
			case "SEEK":
				retval.x = SGN(zzt.board[currentboard].objects[0].x - zzt.board[currentboard].objects[ppobj].x);
				retval.y = SGN(zzt.board[currentboard].objects[0].y - zzt.board[currentboard].objects[ppobj].y);
				break;
			case "FLOW":
				//Repeat last directional move
				break;
			case "RNDNS":
			case "RNDNE":
				break;

			//The following directions are multipart.
			case "OPP":
				//OPP <direction>, opposite to the given direction.
			case "CW":
			case "CCW":
			case "RNDP":
				break;
			default:
				WriteMessage("ERR " + pobj + " INVALID DIRECTION at CHAR " + zzt.board[currentboard].objects[pobj].progpos+": " + getdir);
				break;
		}
		--ppline.argc;
	}
	return retval;	
}



const PARSE_EMPTY = 0;
const PARSE_TOKEN = 1;
const PARSE_SPACE = 2;

const COMMAND_TEXT = 0;
const COMMAND_MOVE = 1;
const COMMAND_TRY = 2;
const COMMAND_COMMAND = 3;
const COMMAND_NAME = 4;
const COMMAND_LABEL = 5;
const COMMAND_REMARK = 6;
const COMMAND_MENU = 7;
const COMMAND_PRETTYTEXT = 8;


function ParseLine(pOBJ)
{
	return ZZTParser(zzt.board[currentboard].objects[pOBJ].progpos,zzt.board[currentboard].objects[pOBJ].proglen,zzt.board[currentboard].objects[pOBJ].program);

}


function ZZTParser(pPOS, pLEN, pPROGRAM)
{
	var pcommand = COMMAND_TEXT;
	var pstate = PARSE_EMPTY;
	var pparams = 0;
	var pdata = [];
	var rawline = "";
	var pcounter = pPOS;
	while(pcounter<pLEN)
	{
		rawline += pPROGRAM.charAt(pcounter);
		switch(pPROGRAM.charAt(pcounter))
		{
			case ' ':
				switch(pstate)
				{
					case PARSE_EMPTY:
						pcommand = COMMAND_TEXT;
					case PARSE_SPACE:
					case PARSE_TOKEN:
						if(pcommand == COMMAND_MENU) pdata[pparams-1] += pPROGRAM.charAt(pcounter);
						else pstate = PARSE_SPACE;
				}
				break;
			case '\n':
				return { raw:rawline, position:pcounter+1, command:pcommand, argc:pparams, argv:pdata }; 
				break;
			case '/':
				if(pcommand==COMMAND_MOVE || pcommand==COMMAND_TRY) return { raw:rawline.slice(0,rawline.length-1)+'\n', position:pcounter, command:pcommand, argc:pparams, argv:pdata }; 
				switch(pstate)
				{
					case PARSE_EMPTY:
						pcommand = COMMAND_MOVE;
					case PARSE_SPACE:
						++pparams;
						pdata[pparams-1] = "";
						if(pstate==PARSE_EMPTY)
						{
							pstate=PARSE_TOKEN;
							break;
						}
						pstate = PARSE_TOKEN;
					case PARSE_TOKEN:
						pdata[pparams-1] += pPROGRAM.charAt(pcounter);
						break;
				}
				break;
			case '?':
				if(pcommand==COMMAND_MOVE || pcommand==COMMAND_TRY) return { raw:rawline.slice(0,rawline.length-1)+'\n', position:pcounter, command:pcommand, argc:pparams, argv:pdata }; 
				switch(pstate)
				{
					case PARSE_EMPTY:
						pcommand = COMMAND_TRY;
					case PARSE_SPACE:
						++pparams;
						pdata[pparams-1] = "";
						if(pstate==PARSE_EMPTY)
						{
							pstate=PARSE_TOKEN;
							break;
						}
						pstate = PARSE_TOKEN;
					case PARSE_TOKEN:
						pdata[pparams-1] += pPROGRAM.charAt(pcounter);
						break;
				}
				break;
			case '#':
				if(pcommand==COMMAND_MOVE || pcommand==COMMAND_TRY) return { raw:rawline.slice(0,rawline.length-1)+'\n', position:pcounter, command:pcommand, argc:pparams, argv:pdata }; 
				switch(pstate)
				{
					case PARSE_EMPTY:
						pcommand = COMMAND_COMMAND;
					case PARSE_SPACE:
						++pparams;
						pdata[pparams-1] = "";
						if(pstate==PARSE_EMPTY)
						{
							pstate=PARSE_TOKEN;
							break;
						}
						pstate = PARSE_TOKEN;
					case PARSE_TOKEN:
						pdata[pparams-1] += pPROGRAM.charAt(pcounter);
						break;
				}
				break;
			case '@':
				if(pcommand==COMMAND_MOVE || pcommand==COMMAND_TRY) return { raw:rawline.slice(0,rawline.length-1)+'\n', position:pcounter, command:pcommand, argc:pparams, argv:pdata }; 
				switch(pstate)
				{
					case PARSE_EMPTY:
						pcommand = COMMAND_NAME;
					case PARSE_SPACE:
						++pparams;
						pdata[pparams-1] = "";
						if(pstate==PARSE_EMPTY)
						{
							pstate=PARSE_TOKEN;
							break;
						}
						pstate = PARSE_TOKEN;
					case PARSE_TOKEN:
						pdata[pparams-1] += pPROGRAM.charAt(pcounter);
						break;
				}
				break;
			case ';':
				switch(pstate)
				{
					case PARSE_EMPTY:
						pcommand = COMMAND_TEXT;
					case PARSE_SPACE:
						++pparams;
						pdata[pparams-1] = "";
						pstate = PARSE_TOKEN;
					case PARSE_TOKEN:
						if(pcommand == COMMAND_MENU) pstate=PARSE_SPACE;
						else pdata[pparams-1] += pPROGRAM.charAt(pcounter);
						break;
				}
			case ':':
				if(pcommand==COMMAND_MOVE || pcommand==COMMAND_TRY) return { raw:rawline.slice(0,rawline.length-1)+'\n', position:pcounter, command:pcommand, argc:pparams, argv:pdata }; 
				switch(pstate)
				{
					case PARSE_EMPTY:
						pcommand = COMMAND_LABEL;
					case PARSE_SPACE:
						++pparams;
						pdata[pparams-1] = "";
						if(pstate==PARSE_EMPTY)
						{
							pstate=PARSE_TOKEN;
							break;
						}
						pstate = PARSE_TOKEN;
					case PARSE_TOKEN:
						if(pcommand == COMMAND_COMMAND && pdata[0].toUpperCase()=="SEND") pstate=PARSE_SPACE;
						else pdata[pparams-1] += pPROGRAM.charAt(pcounter);
						break;
				}
				break;
			case '\'':
				if(pcommand==COMMAND_MOVE || pcommand==COMMAND_TRY) return { raw:rawline.slice(0,rawline.length-1)+'\n', position:pcounter, command:pcommand, argc:pparams, argv:pdata }; 
				switch(pstate)
				{
					case PARSE_EMPTY:
						pcommand = COMMAND_REMARK;
					case PARSE_SPACE:
						++pparams;
						pdata[pparams-1] = "";
						if(pstate==PARSE_EMPTY)
						{
							pstate=PARSE_TOKEN;
							break;
						}
						pstate = PARSE_TOKEN;
					case PARSE_TOKEN:
						pdata[pparams-1] += pPROGRAM.charAt(pcounter);
						break;
				}
				break;
			case '!':
				if(pcommand==COMMAND_MOVE || pcommand==COMMAND_TRY) return { raw:rawline.slice(0,rawline.length-1)+'\n', position:pcounter, command:pcommand, argc:pparams, argv:pdata }; 
				switch(pstate)
				{
					case PARSE_EMPTY:
						pcommand = COMMAND_MENU;
					case PARSE_SPACE:
						++pparams;
						pdata[pparams-1] = "";
						if(pstate==PARSE_EMPTY)
						{
							pstate=PARSE_TOKEN;
							break;
						}
						pstate = PARSE_TOKEN;
					case PARSE_TOKEN:
						pdata[pparams-1] += pPROGRAM.charAt(pcounter);
						break;
				}
				break;
			case '$':
				if(pcommand==COMMAND_MOVE || pcommand==COMMAND_TRY) return { raw:rawline.slice(0,rawline.length-1)+'\n', position:pcounter, command:pcommand, argc:pparams, argv:pdata }; 
				switch(pstate)
				{
					case PARSE_EMPTY:
						pcommand = COMMAND_PRETTYTEXT;
					case PARSE_SPACE:
						++pparams;
						pdata[pparams-1] = "";
						if(pstate==PARSE_EMPTY)
						{
							pstate=PARSE_TOKEN;
							break;
						}
						pstate = PARSE_TOKEN;
					case PARSE_TOKEN:
						pdata[pparams-1] += pPROGRAM.charAt(pcounter);
						break;
				}
				break;
			default:
				switch(pstate)
				{
					case PARSE_EMPTY:
						pcommand = COMMAND_TEXT;
					case PARSE_SPACE:
						++pparams;
						pdata[pparams-1] = "";
						pstate = PARSE_TOKEN;
					case PARSE_TOKEN:
						pdata[pparams-1] += pPROGRAM.charAt(pcounter);
						break;
				}
		}
		++pcounter;
	}
	
	return { raw:rawline, position:pcounter, command:pcommand, argc:pparams, argv:pdata }; 
}



function ZZTOOP(ptype,pobj)
{
	if(zzt.board[currentboard].objects[pobj].progpos>=zzt.board[currentboard].objects[pobj].proglen)
	{
		if(ptype==0xA) KillObject(pobj,ptype);
		return;
	}
	var pline = ParseLine(pobj);
	switch(pline.command)
	{

		case COMMAND_MOVE:
			var getdir = GetDirection(pline,pobj);
			if(MoveObject(pobj,getdir.x,getdir.y)==-1) {}
			else zzt.board[currentboard].objects[pobj].progpos = pline.position;
			break;
		case COMMAND_TRY:
			var getdir = GetDirection(pline,pobj);
			MoveObject(pobj,getdir.x,getdir.y);
			zzt.board[currentboard].objects[pobj].progpos = pline.position;
			break;
		case COMMAND_COMMAND:
			zzt.board[currentboard].objects[pobj].progpos = pline.position;
			switch(pline.argv[0].toUpperCase())
			{
				case "RESTART":
					zzt.board[currentboard].objects[pobj].progpos=0;
					break;
				case "LOCK":
					zzt.board[currentboard].objects[pobj].o2=1;
					break;
				case "CYCLE":
					zzt.board[currentboard].objects[pobj].cycle=parseInt(pline.argv[1],10);
					break;
				case "UNLOCK":
					zzt.board[currentboard].objects[pobj].o2=0;
					break;
				case "END":
					zzt.board[currentboard].objects[pobj].progpos=zzt.board[currentboard].objects[pobj].proglen;
					break;
				case "SHOOT":
					var getdir = GetDirection(pline,pobj);
					Template_Generic.Shoot(pobj,getdir.x,getdir.y,0);
					break;
				case "THROWSTAR":
					var getdir = GetDirection(pline,pobj);
					Template_Generic.Shoot(pobj,getdir.x,getdir.y,1);
					break;
				case "PLAY":
					//FIXME:Just eat this command for now
					break;
				case "SEND":
					//FIXME: Add support for sending data to all objects
					SendObjectMessage(pobj,pobj,pline.argv[1].toUpperCase());
					break;

				case "GIVE":
					//FIXME: Add all things to gie
					switch(pline.argv[1].toUpperCase())
					{
						case "SCORE":
							zzt.score+=parseInt(pline.argv[2],10);
							break;

					}
					break;
				default:
					WriteMessage("Unsupported Command: " + pline.argv[0]);
					break;
			}
			break;
		case COMMAND_NAME:
		case COMMAND_LABEL:
		case COMMAND_REMARK:
		case COMMAND_MENU:
			zzt.board[currentboard].objects[pobj].progpos = pline.position;
			break;

		case COMMAND_PRETTYTEXT:
		case COMMAND_TEXT:   //Text
			var temper = GetObjectName(pobj);
			if(temper=="") temper="UNDEFINED OBJECT NAME";
			CreateMessage(pobj,temper,GrabMessage(pobj));
			break;
	}
}

// Called when the current player takes damage. Displays a message and subtracts from health by the given amount (amount).
function Hurt(amount)
{
	WriteMessage("Ouch!");
	zzt.health-=amount;
}

function ExecObjects()
{
	if(currentboard!=0)
	{
		++FRAMES;
		if(bottomframes>0) --bottomframes;

		if(FRAMES%FPS==0) zzt.timepassed++;
		if(zzt.board[currentboard].time>0)
		{
			if(zzt.timepassed>zzt.board[currentboard].time)
			{
				Hurt(10);
				zzt.timepassed=0;
			}
			if(zzt.board[currentboard].time-zzt.timepassed==10)
			{
				WriteMessage("Running out of time!");
			}
		}
	}

	for(var counter=0;counter<=zzt.board[currentboard].objectmax;++counter)
	{
		if(zzt.board[currentboard].objects[counter]!=null)
		{
			if(FRAMES%zzt.board[currentboard].objects[counter].cycle==0)
			{
				var bdrawx = zzt.board[currentboard].objects[counter].x-1;
				var bdrawy = zzt.board[currentboard].objects[counter].y-1;
				if(bdrawx>=0 && bdrawy>=0)
				{
					switch(zzt.board[currentboard].text[bdrawy][bdrawx].ID)
					{
						case 0x04:
							//NOTE:  Player handled in the keydown/up events!!
							Template_Player.Execute(counter);
							break;
						case 0x12:
							Template_Bullet.Execute(counter);
							break;
						case 0x0A:  //Scroll
							if(zzt.board[currentboard].objects[counter].o1==1) ZZTOOP(0x0A,counter);
							break;
						case 0x0C: //Duplicator
							if(FRAMES%FPS==0) //FIXME:Base this on duplicator rate
							{
								var readx = zzt.board[currentboard].objects[counter].x+zzt.board[currentboard].objects[counter].xstep-1;
								var ready = zzt.board[currentboard].objects[counter].y+zzt.board[currentboard].objects[counter].ystep-1;
								var writex = zzt.board[currentboard].objects[counter].x-zzt.board[currentboard].objects[counter].xstep-1;
								var writey = zzt.board[currentboard].objects[counter].y-zzt.board[currentboard].objects[counter].ystep-1;
								if(readx>=0 && readx<BOARD_SIZE_X && ready>=0 && ready<BOARD_SIZE_Y && writex>=0 && writex<BOARD_SIZE_X && writey>=0 && writey<BOARD_SIZE_Y)						
								{
									//FIXME:  Make duplicator duplicate objects
									if(zzt.board[currentboard].text[writey][writex].ID==0)
									{
										zzt.board[currentboard].text[writey][writex].ID = zzt.board[currentboard].text[ready][readx].ID;
										zzt.board[currentboard].text[writey][writex].color = zzt.board[currentboard].text[ready][readx].color;
									}
									else
									{
										var keeptrying = true;
										while(keeptrying==true)
										{
											writex -= zzt.board[currentboard].objects[counter].xstep;
											writey -= zzt.board[currentboard].objects[counter].ystep;
											if(writex>=0 && writex<BOARD_SIZE_X && writey>=0 && writey<BOARD_SIZE_Y)
											{
												if(zzt.board[currentboard].text[writey][writex].ID==0)
												{
													zzt.board[currentboard].text[writey][writex].ID = zzt.board[currentboard].text[ready][readx].ID;
													zzt.board[currentboard].text[writey][writex].color = zzt.board[currentboard].text[ready][readx].color;
													keeptrying = false;
									
												}
												else if(zzt.board[currentboard].text[writey][writex].ID==zzt.board[currentboard].text[ready][readx].ID)
												{
													keeptrying = true;
												}
												else keeptrying = false;
												//FIXME:  Add support for bumping player over
											}
											else keeptrying = false;

										}
									}
								}
							}
							break;
						case 0x24:
							ZZTOOP(0x24,counter);
							break;
					}
				}
			}
		}
	}

}

function CreateMessage(pfromobj,ptitle,pmsg)
{
	if(CountLines(pmsg)==1)
	{
		//We have a one line message so we don't make a box
		WriteMessage(pmsg);
		return;
	}
	MESSAGE_CREATOR = pfromobj;
	MESSAGE_STATE = STATE_MESSAGE_OPEN;
	MESSAGE_TITLE = ptitle;
	MESSAGE_DATA = "\n\n     Use Arrow Keys to Move Up/Down\n     Press ESC to close this box\n\n\n" + "  " + String.fromCharCode(7) + "    "+ String.fromCharCode(7) + "    "+ String.fromCharCode(7) + "    "+ String.fromCharCode(7) + "    "+ String.fromCharCode(7) + "    "+ String.fromCharCode(7) + "    "+ String.fromCharCode(7) + "    "+ String.fromCharCode(7) +"\n" + pmsg + "\n  " + String.fromCharCode(7) + "    "+ String.fromCharCode(7) + "    "+ String.fromCharCode(7) + "    "+ String.fromCharCode(7) + "    "+ String.fromCharCode(7) + "    "+ String.fromCharCode(7) + "    "+ String.fromCharCode(7) + "    "+ String.fromCharCode(7) +"\n\n\n\n\n\n";
	MESSAGE_CURRLINE = 0;
	MESSAGE_HEIGHT = 0;
	MESSAGE_RETSTATE = ZZT_STATE;
	ZZT_STATE = ZZT_MESSAGE;
	clearInterval(GAME_INTERVAL);
	GAME_INTERVAL=setInterval(Update,1000/60);

}

function CountLines(pdata)
{
	var plines = 1;
	for(var pcounter=0;pcounter<pdata.length;pcounter++)
	{
		if(pdata.charAt(pcounter)=='\n') ++plines;
	}
	return plines;
}

function SelectMenu()
{
	var skiplines = 8+MESSAGE_CURRLINE;
	var linesstart=0;
	while(skiplines>0)
	{
		var mline = ZZTParser(linesstart, MESSAGE_DATA.length, MESSAGE_DATA);
		linesstart=mline.position;
		--skiplines;
	}
	var mline2 = ZZTParser(linesstart,MESSAGE_DATA.length,MESSAGE_DATA);
	if(mline.command==COMMAND_MENU)
	{
		if(MESSAGE_CREATOR!=-1)
		{
			SendObjectMessage(MESSAGE_CREATOR,MESSAGE_CREATOR,mline.argv[0].toUpperCase());
			return 1;
		}
	}
	return 0;
}

function DrawMessage()
{
	Terminal.SetTerminalChar(5,12-MESSAGE_HEIGHT,198,15,0);
	Terminal.SetTerminalChar(6,12-MESSAGE_HEIGHT,209,15,0);
	Terminal.SetTerminalChar(5,13-MESSAGE_HEIGHT,219,0,0);
	Terminal.SetTerminalChar(6,13-MESSAGE_HEIGHT,179,15,0);
	Terminal.SetTerminalChar(6,14-MESSAGE_HEIGHT,198,15,0);
	Terminal.SetTerminalChar(5,14-MESSAGE_HEIGHT,219,0,0);
	Terminal.SetTerminalChar(52,12-MESSAGE_HEIGHT,209,15,0);
	Terminal.SetTerminalChar(52,13-MESSAGE_HEIGHT,179,15,0);
	Terminal.SetTerminalChar(52,14-MESSAGE_HEIGHT,181,15,0);
	Terminal.SetTerminalChar(53,12-MESSAGE_HEIGHT,181,15,0);
	Terminal.SetTerminalChar(53,13-MESSAGE_HEIGHT,219,0,0);
	Terminal.SetTerminalChar(53,14-MESSAGE_HEIGHT,219,0,0);

	for(var filltop=7;filltop<52;++filltop)
	{
		Terminal.SetTerminalChar(filltop,12-MESSAGE_HEIGHT,205,15,0);
		Terminal.SetTerminalChar(filltop,13-MESSAGE_HEIGHT,219,1,0);
		Terminal.SetTerminalChar(filltop,14-MESSAGE_HEIGHT,205,15,0);
		Terminal.SetTerminalChar(filltop,12+MESSAGE_HEIGHT,205,15,0);
	}

	for(var fillside=15-MESSAGE_HEIGHT;fillside<=11+MESSAGE_HEIGHT;++fillside)
	{
		Terminal.SetTerminalChar(5,fillside,219,0,0);
		Terminal.SetTerminalChar(6,fillside,179,15,0);
		for(var fillblue=7;fillblue<52;++fillblue)
		{
			Terminal.SetTerminalChar(fillblue,fillside,219,1,0);
		}
		Terminal.SetTerminalChar(52,fillside,179,15,0);
		Terminal.SetTerminalChar(53,fillside,219,0,0);

	}

	Terminal.SetTerminalChar(5,12+MESSAGE_HEIGHT,198,15,0);
	Terminal.SetTerminalChar(53,12+MESSAGE_HEIGHT,181,15,0);
	Terminal.SetTerminalChar(6,12+MESSAGE_HEIGHT,207,15,0);
	Terminal.SetTerminalChar(52,12+MESSAGE_HEIGHT,207,15,0);
	
	if(MESSAGE_STATE==STATE_MESSAGE_VIEW)
	{
		var drawcol = 14;
		var drawx = 0;
		var drawy = 0;
		var skiplines = MESSAGE_CURRLINE;
		var linesstart = 0;
		while(skiplines>0)
		{
			var mline = ZZTParser(linesstart, MESSAGE_DATA.length, MESSAGE_DATA);
			linesstart=mline.position;
			--skiplines;
		}
		//var linesstart = GetLinePosition(MESSAGE_DATA,MESSAGE_CURRLINE);

		Terminal.PrintTerminalText(((60-MESSAGE_TITLE.length)>>1)-1,13-MESSAGE_HEIGHT,MESSAGE_TITLE,14,1);

		var drawing = true;
		while(drawing==true)
		{
			var mline = ZZTParser(linesstart, MESSAGE_DATA.length, MESSAGE_DATA)
			if(mline.command==COMMAND_PRETTYTEXT && drawx==0)
			{
				drawx = ((42 - mline.raw.length)>>1) - 1;
				drawcol = 15;
				Terminal.PrintTerminalText(9+drawx,15-MESSAGE_HEIGHT+drawy,mline.raw.slice(1,mline.raw.length-1),15,1);
			}
			else if(mline.command==COMMAND_MENU)
			{
				Terminal.SetTerminalChar(12,15-MESSAGE_HEIGHT+drawy,16,13,1);
				Terminal.PrintTerminalText(14,15-MESSAGE_HEIGHT+drawy,mline.argv[1].slice(1,mline.argv[1].length),15,1);
			}
			else Terminal.PrintTerminalText(9,15-MESSAGE_HEIGHT+drawy,mline.raw,14,1);
			linesstart = mline.position;
			++drawy;
			if(linesstart>=MESSAGE_DATA.length) drawing=false;
			if(drawy>14) drawing = false;
		}

		Terminal.SetTerminalChar(7,4+MESSAGE_HEIGHT,175,12,1);
		Terminal.SetTerminalChar(51,4+MESSAGE_HEIGHT,174,12,1);
	}
}

// Master game update function. Depending on the game state (ZZT_STATE), handles execution of object code and all screen draw updates.
function Update()
{
	switch(ZZT_STATE)
	{
		case ZZT_PAUSE:
			++STATE_PAUSE_FRAMES;
			RedrawEverything();
			if(STATE_PAUSE_FRAMES%FPS > FPS>>1)
			{
				var drawx = zzt.board[currentboard].objects[0].x-1;
				var drawy = zzt.board[currentboard].objects[0].y-1;
				var foundID = zzt.board[currentboard].objects[0].utile;
				var foundCOL = zzt.board[currentboard].objects[0].ucolor;
				Terminal.SetTerminalChar(drawx,drawy,GetCharacter(foundID,foundCOL),(foundCOL & 15),(foundCOL>>4));
			}
			else DrawBoardPosition(zzt.board[currentboard].objects[0].x-1,zzt.board[currentboard].objects[0].y-1);
			break;
		case ZZT_MESSAGE:
			ExecMessage();
			break;
		case ZZT_GAME:
			ExecObjects();
			RedrawEverything();
			break;
	
	}
}

function ExecMessage()
{
	RedrawEverything();
	DrawMessage();
	switch(MESSAGE_STATE)
	{
		case STATE_MESSAGE_OPEN:
			++MESSAGE_HEIGHT;
			if(MESSAGE_HEIGHT==9) MESSAGE_STATE=STATE_MESSAGE_VIEW;
			break;
		case STATE_MESSAGE_VIEW:

			break;
		case STATE_MESSAGE_CLOSE:
			--MESSAGE_HEIGHT;
			if(MESSAGE_HEIGHT<=0)
			{
				clearInterval(GAME_INTERVAL);
				GAME_INTERVAL=setInterval(Update,1000/FPS);

				if(MESSAGE_RETSTATE!=ZZT_MESSAGE) ZZT_STATE=MESSAGE_RETSTATE;
				else ZZT_STATE=ZZT_GAME;
			}
			break;
	}

}

// Clears the current terminal canvas area and redraws the contents of the screen.
function RedrawEverything()
{
	for(var bdrawy=0;bdrawy<TERMINAL_SIZE_Y;bdrawy++)
	{
		for(var bdrawx=0;bdrawx<BOARD_SIZE_X;bdrawx++)
		{
			DrawBoardPosition(bdrawx,bdrawy);
		}

		for(var bdrawx=BOARD_SIZE_X;bdrawx<TERMINAL_SIZE_X;bdrawx++)
		{
			Terminal.SetTerminalChar(bdrawx,bdrawy,219,1,0);
		}
	}
	Terminal.SetTerminalChar(65,0,196,15,1);
	Terminal.SetTerminalChar(67,0,196,15,1);
	Terminal.SetTerminalChar(69,0,196,15,1);
	Terminal.SetTerminalChar(71,0,196,15,1);
	Terminal.SetTerminalChar(73,0,196,15,1);
	Terminal.PrintTerminalText(62,1,"      ZZT      ",0,7);
	Terminal.SetTerminalChar(65,2,196,15,1);
	Terminal.SetTerminalChar(67,2,196,15,1);
	Terminal.SetTerminalChar(69,2,196,15,1);
	Terminal.SetTerminalChar(71,2,196,15,1);
	Terminal.SetTerminalChar(73,2,196,15,1);

	if(ZZT_STATE==ZZT_PAUSE)
	{
		Terminal.PrintTerminalText(64, 4,"Pausing...",15,1);
	}
	if(zzt.board[currentboard].time>0)
	{
//		WriteMessage("TIMES IS UP");
		Terminal.PrintTerminalText(64,5,"   Time:"+(zzt.board[currentboard].time-zzt.timepassed),14,1);
//		alert(zzt.timepassed);
	}
	Terminal.SetTerminalChar(62,6,GetCharacter(0x04,0),15,1);
	Terminal.PrintTerminalText(64, 6," Health:"+zzt.health,14,1);
	Terminal.SetTerminalChar(62,7,GetCharacter(0x05,0),11,1);
	Terminal.PrintTerminalText(64, 7,"   Ammo:"+zzt.ammo,14,1);
	Terminal.SetTerminalChar(62,8,GetCharacter(0x06,0),6,1);
	Terminal.PrintTerminalText(64, 8,"Torches:"+zzt.torches,14,1);
	Terminal.SetTerminalChar(62,9,GetCharacter(0x07,0),11,1);
	Terminal.PrintTerminalText(64, 9,"   Gems:"+zzt.gems,14,1);
	Terminal.PrintTerminalText(64,10,"  Score:"+zzt.score,14,1);
	Terminal.SetTerminalChar(62,11,GetCharacter(0x08,0),15,1);
	Terminal.PrintTerminalText(64, 11,"   Keys:",14,1);
	if(zzt.bluekey==1) Terminal.SetTerminalChar(72,11,GetCharacter(0x08,0),9,1);
	if(zzt.greenkey==1) Terminal.SetTerminalChar(73,11,GetCharacter(0x08,0),10,1);
	if(zzt.cyankey==1) Terminal.SetTerminalChar(74,11,GetCharacter(0x08,0),11,1);
	if(zzt.redkey==1) Terminal.SetTerminalChar(75,11,GetCharacter(0x08,0),12,1);
	if(zzt.purplekey==1) Terminal.SetTerminalChar(76,11,GetCharacter(0x08,0),13,1);
	if(zzt.yellowkey==1) Terminal.SetTerminalChar(77,11,GetCharacter(0x08,0),14,1);
	if(zzt.whitekey==1) Terminal.SetTerminalChar(78,11,GetCharacter(0x08,0),15,1);

	if(MOUSE_X>=0 && MOUSE_X<60 && MOUSE_Y<25 && MOUSE_Y>0)
	{
		var outputtext = "";
		outputtext = "X: " + MOUSE_X + " Y: " + MOUSE_Y + "  ";
		Terminal.PrintTerminalText(62,18,outputtext,15,1);
		outputtext = "ID: " + zzt.board[currentboard].text[MOUSE_Y][MOUSE_X].ID + "     ";
		Terminal.PrintTerminalText(62,19,outputtext,14,1);
		outputtext = "FCOLOR: " + (zzt.board[currentboard].text[MOUSE_Y][MOUSE_X].color&15) + "      ";
		Terminal.PrintTerminalText(62,20,outputtext,14,1);
		outputtext = "BCOLOR: " + (zzt.board[currentboard].text[MOUSE_Y][MOUSE_X].color>>4) + "      ";
		Terminal.PrintTerminalText(62,21,outputtext,14,1);

		var finderobj = GetObjectNumberByCoordinate(MOUSE_X,MOUSE_Y);
		if(finderobj!=-1)
		{
			var tempobj = zzt.board[currentboard].objects[finderobj];
			if(zzt.board[currentboard].text[MOUSE_Y][MOUSE_X].ID==0xA || zzt.board[currentboard].text[MOUSE_Y][MOUSE_X].ID==36)
			{
				CreateMessage(-1,"Object Listing",tempobj.program);
			}

			outputtext = "OBJ: " + finderobj + "    ";
			Terminal.PrintTerminalText(62,17,outputtext,15,1);
		}

	}
	else Terminal.PrintTerminalText(62,18,"OUTSIDE",15,1);


	if(bottomframes>0)
	{
		Terminal.PrintTerminalText(((60-bottommessage.length)>>1)-1,24,bottommessage,9+(FRAMES%7),0);
	}

}



