/*
 *  Object 'templates' (Crockford just killed a kitten)
 */

// 'Template' for generic game objects (base class)
var Template_Generic = {
	Create: function (px,py,pxstep,pystep,pcycle,po1,po2,po3,pleader,pfollow,ptile,pcolor,pprogpos,pproglen,pprogram) {
		var tdata = {
			x: px,
			y: py,
			xstep: pxstep,
			ystep: pystep,
			cycle: pcycle,
			o1: po1,
			o2: po2,
			o3: po3,
			leader: pleader,
			follow: pfollow,
			utile: ptile,
			ucolor: pcolor,
			progpos: pprogpos,
			proglen: pproglen,
			program: pprogram
		};
		return tdata;
	},
	GetID: function(){},
	Execute: function(pTHIS){},
	Shot: function(pFROMOBJ,pTHIS){},
	Touch: function(pFROMOBJ,pTHIS){},
	Bombed: function(pFROMOBJ,pTHIS){},
	Thud: function(pFROMOBJ,pTHIS){},
	Energized: function(pFROMOBJ,pTHIS){},
	Shoot: function(pTHIS,pdirx,pdiry,ptype)
	{
		if (zzt.board[currentboard].objects[pTHIS].x+pdirx < 1) return -1;
		if (zzt.board[currentboard].objects[pTHIS].y+pdiry < 1) return -1;
		if (zzt.board[currentboard].objects[pTHIS].x+pdirx > 60) return -1;
		if (zzt.board[currentboard].objects[pTHIS].y+pdiry > 25) return -1;
		var thingy = Template_Bullet.Create(zzt.board[currentboard].objects[pTHIS].x+pdirx,
					   zzt.board[currentboard].objects[pTHIS].y+pdiry,
					   pdirx,
					   pdiry,
					   3,
					   pTHIS,0,0,
					   0,0,0,0,
					   0,0,"");

		var testobj = GetObjectNumberByCoordinate(thingy.x-1,thingy.y-1)
		if (testobj != -1) {
			SendObjectMessage(testobj,pTHIS,"SHOT");
			return -2;
		}
		return AddObject(thingy,Template_Bullet.GetID(),15);
	}
};

// 'Template' for the player object
var Template_Player = {
	Create: Template_Generic.Create,
	GetID: function() {
		return 0x04;
	},
	Execute: function(pTHIS) {
		if (zzt.tcycles > 0) --zzt.tcycles;
		if (zzt.ecycles > 0) --zzt.ecycles;
	},
	Shot: Template_Generic.Shot,
	Touch: Template_Generic.Touch,
	Bombed: Template_Generic.Bombed,
	Thud: Template_Generic.Thud,
	Energized: Template_Generic.Energized,
	Shoot: function(pTHIS,pdirx,pdiry,ptype) {
		if ( zzt.board[currentboard].maxbullets == 0) {
			WriteMessage("Can't shoot in this place!");
		} else {
			if ( zzt.ammo > 0) {
				var getBullet = Template_Generic.Shoot(pTHIS,pdirx,pdiry,ptype);
				if (getBullet > -1) {
					switch(zzt.board[currentboard].objects[getBullet].utile) {
						case 0x17:
							zzt.board[currentboard].objects[getBullet].utile = 0;
							zzt.board[currentboard].objects[getBullet].ucolor = 0;
							KillObject(getBullet,0);
						default:
					}
					--zzt.ammo;
				}
				if (getBullet == -2) --zzt.ammo;
			} else {
				WriteMessage("You don't have any ammo!");
			}
		}
	}
};


// 'Template' for bullet or projectile objects.
var Template_Bullet = {
	Create: Template_Generic.Create,
	GetID: function() {
		return 0x12;
	},
	Execute: function(pTHIS) {
		var bullmove = MoveObject(pTHIS,zzt.board[currentboard].objects[pTHIS].xstep,zzt.board[currentboard].objects[pTHIS].ystep);
		if (bullmove == -1) KillObject(pTHIS,0);
	},
	Shot: Template_Generic.Shot,
	Touch: Template_Generic.Touch,
	Bombed: Template_Generic.Bombed,
	Thud: Template_Generic.Thud,
	Energized: Template_Generic.Energized,
};

// Add a game object (pdata) to the current board.
function AddObject(pdata,pID,pCOLOR) {
	if ( GetObjectNumberByCoordinate(pdata.x-1,pdata.y-1) != -1) return -1;
	
	for (var iterator=zzt.board[currentboard].objectmax; iterator >= 0; --iterator) {
		if (zzt.board[currentboard].objects[iterator] == null) {
			zzt.board[currentboard].objects[iterator] = pdata;
			zzt.board[currentboard].objects[iterator].utile = zzt.board[currentboard].text[pdata.y-1][pdata.x-1].ID;
			zzt.board[currentboard].objects[iterator].ucolor = zzt.board[currentboard].text[pdata.y-1][pdata.x-1].color;
			zzt.board[currentboard].text[pdata.y-1][pdata.x-1].ID = pID
			zzt.board[currentboard].text[pdata.y-1][pdata.x-1].color = pCOLOR;
			return iterator;
		}
	}
	++zzt.board[currentboard].objectmax;
	zzt.board[currentboard].objects[zzt.board[currentboard].objectmax] = pdata;
	zzt.board[currentboard].objects[zzt.board[currentboard].objectmax].utile = zzt.board[currentboard].text[pdata.y-1][pdata.x-1].ID;
	zzt.board[currentboard].objects[zzt.board[currentboard].objectmax].ucolor = zzt.board[currentboard].text[pdata.y-1][pdata.x-1].color;
	zzt.board[currentboard].text[pdata.y-1][pdata.x-1].ID = pID
	zzt.board[currentboard].text[pdata.y-1][pdata.x-1].color = pCOLOR;
	return zzt.board[currentboard].objectmax;
}

// Remove an object (pOBJ) from the current board
function KillObject(pOBJ,pTYPE) {
	zzt.board[currentboard].text[zzt.board[currentboard].objects[pOBJ].y-1][zzt.board[currentboard].objects[pOBJ].x-1].ID=zzt.board[currentboard].objects[pOBJ].utile;
	zzt.board[currentboard].text[zzt.board[currentboard].objects[pOBJ].y-1][zzt.board[currentboard].objects[pOBJ].x-1].color=zzt.board[currentboard].objects[pOBJ].ucolor;
	zzt.board[currentboard].objects[pOBJ] = null;
}

var Block_Empty = {
	ID: 0x0,
	Solid: false,
	Shot: function(pFROM) {},
	Touch: function() {},
	Break: true
};

var Block_SpecialInvisibleWall = {
	ID: 0x1,
	Solid: Block_Empty.Solid,
	Shot: Block_Empty.Shot,
	Touch: Block_Empty.Touch,
	Break: Block_Empty.Break,
};

/*
		case 0x1C: //Invisible Wall
			if(pID==0)
			{
				zzt.board[currentboard].text[py][px].ID=0x16;
			}
			return true;
			break;
		case 0x4: //Player
			return true;
			break;
		case 0x5: //Ammo
			if(pID==0)
			{
				zzt.board[currentboard].text[py][px].ID=0;
				zzt.board[currentboard].text[py][px].color=0;
				zzt.ammo+=5;
				WriteMessage("Ammunition - 5 shots per container.");
			}
			return false;
			break;
		case 0x6: //Torch
			if(pID==0)
			{
				zzt.board[currentboard].text[py][px].ID=0;
				zzt.board[currentboard].text[py][px].color=0;
				zzt.torches++;
				WriteMessage("Torch - used for lighting in the underground.");
			}
			return false;
			break;
		case 0x7: //Gem
			if(pID==0)
			{
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
			if(pID==0)
			{
				if(zzt.board[currentboard].text[py][px].color==9)
				{
					if(zzt.bluekey==0)
					{
						zzt.bluekey=1;
						WriteMessage("You now have the Blue key.");
						zzt.board[currentboard].text[py][px].ID=0;
						zzt.board[currentboard].text[py][px].color=0;

					}
					else
					{
						WriteMessage("You already have a Blue key!");
						return true;
					}
				}
				if(zzt.board[currentboard].text[py][px].color==10)
				{
					if(zzt.greenkey==0)
					{
						zzt.greenkey=1;
						WriteMessage("You now have the Green key.");
						zzt.board[currentboard].text[py][px].ID=0;
						zzt.board[currentboard].text[py][px].color=0;
					}
					else
					{
						WriteMessage("You already have a Green key!");
						return true;
					}
				}
				if(zzt.board[currentboard].text[py][px].color==11)
				{
					if(zzt.cyankey==0)
					{
						zzt.cyankey=1;
						WriteMessage("You now have the Cyan key.");
						zzt.board[currentboard].text[py][px].ID=0;
						zzt.board[currentboard].text[py][px].color=0;
					}
					else
					{
						WriteMessage("You already have a Cyan key!");
						return true;
					}
				}
				if(zzt.board[currentboard].text[py][px].color==12)
				{
					if(zzt.redkey==0)
					{
						zzt.redkey=1;
						WriteMessage("You now have the Red key.");
						zzt.board[currentboard].text[py][px].ID=0;
						zzt.board[currentboard].text[py][px].color=0;
					}
					else
					{
						WriteMessage("You already have a Blue key!");
						return true;
					}
				}
				if(zzt.board[currentboard].text[py][px].color==13)
				{
					if(zzt.purplekey==0)
					{
						zzt.purplekey=1;
						WriteMessage("You now have the Purple key.");
						zzt.board[currentboard].text[py][px].ID=0;
						zzt.board[currentboard].text[py][px].color=0;
					}
					else
					{
						WriteMessage("You already have a Purple key!");
						return true;
					}
				}
				if(zzt.board[currentboard].text[py][px].color==14)
				{
					if(zzt.yellowkey==0)
					{
						zzt.yellowkey=1;
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
				if(zzt.board[currentboard].text[py][px].color==15)
				{
					if(zzt.whitekey==0)
					{
						zzt.whitekey=1;
						WriteMessage("You now have the White key.");
						zzt.board[currentboard].text[py][px].ID=0;
						zzt.board[currentboard].text[py][px].color=0;
					}
					else
					{
						WriteMessage("You already have a White key!");
						return true;
					}
				}
			}
			return false;
			break;
		case 0x9: //Door
			if(pID==0)
			{
				switch(zzt.board[currentboard].text[py][px].color>>4)
				{
					case 1:
						if(zzt.bluekey==1)
						{
							zzt.bluekey=0;
							WriteMessage("The Blue door is now open.");
							zzt.board[currentboard].text[py][px].ID=0;
							zzt.board[currentboard].text[py][px].color=0;
							return false;
						}
						else WriteMessage("The Blue door is locked.");
						break;
					case 2:
						if(zzt.greenkey==1)
						{
							zzt.greenkey=0;
							WriteMessage("The Green door is now open.");
							zzt.board[currentboard].text[py][px].ID=0;
							zzt.board[currentboard].text[py][px].color=0;
							return false;
						}
						else WriteMessage("The Green door is locked.");
						break;
					case 3:
						if(zzt.cyankey==1)
						{
							zzt.cyankey=0;
							WriteMessage("The Cyan door is now open.");
							zzt.board[currentboard].text[py][px].ID=0;
							zzt.board[currentboard].text[py][px].color=0;
							return false;
						}
						else WriteMessage("The Cyan door is locked.");
						break;
					case 4:
						if(zzt.redkey==1)
						{
							zzt.redkey=0;
							WriteMessage("The Red door is now open.");
							zzt.board[currentboard].text[py][px].ID=0;
							zzt.board[currentboard].text[py][px].color=0;
							return false;
						}
						else WriteMessage("The Red door is locked.");
						break;
					case 5:
						if(zzt.purplekey==1)
						{
							zzt.purplekey=0;
							WriteMessage("The Purple door is now open.");
							zzt.board[currentboard].text[py][px].ID=0;
							zzt.board[currentboard].text[py][px].color=0;
							return false;
						}
						else WriteMessage("The Purple door is locked.");
						break;
					case 6:
						if(zzt.yellowkey==1)
						{
							zzt.yellowkey=0;
							WriteMessage("The Yellow door is now open.");
							zzt.board[currentboard].text[py][px].ID=0;
							zzt.board[currentboard].text[py][px].color=0;
							return false;
						}
						else WriteMessage("The Yellow door is locked.");
						break;
					case 7:
						if(zzt.whitekey==1)
						{
							zzt.whitekey=0;
							WriteMessage("The White door is now open.");
							zzt.board[currentboard].text[py][px].ID=0;
							zzt.board[currentboard].text[py][px].color=0;
							return false;
						}
						else WriteMessage("The White door is locked.");
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
			if(pID==0)
			{
				zzt.board[currentboard].text[py][px].ID=0;
				zzt.board[currentboard].text[py][px].color=0;
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
			switch(sSTUFF.ID)
			{
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
*/




