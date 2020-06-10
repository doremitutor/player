const BasicRhythm=(function(){
	const instance={};	
	instance.WHOLE;
	instance.HALF;
	instance.QUARTER;
	instance.EIGHTH;
	instance.SIXTEENTH;
	return instance;	
})();
const RhythmValue=(function(){
	const instance={};
	instance.BAR=				new Values('BAR',				null,	58, 62, null,	15,	49,	null, 						paths.wholeRest);
	instance.WHOLE=				new Values('WHOLE', 			48,		30, 90, 40,		15,	49,	paths.wholeNote,			paths.wholeRest);
	instance.HALF_D_DOT=		new Values('HALF_D_DOT',		42,		28, 56, 40,		15, 53,	paths.halfDoubleDotNote,	paths.halfDoubleDotRest);
	instance.HALF_DOT=			new Values('HALF_DOT',			36,		26, 52, 40,		15, 53,	paths.halfDotNote,			paths.halfDotRest);
	instance.HALF=				new Values('HALF',				24,		20, 40, 40,		15, 53,	paths.halfNote,				paths.halfRest);
	instance.QUARTER_D_DOT=		new Values('QUARTER_D_DOT',	 	21,		18, 36, 40,		15, 41,	paths.quarterDoubleDotNote,	paths.quarterDoubleDotRest);
	instance.QUARTER_DOT=		new Values('QUARTER_DOT',		18,		17, 34, 40,		15, 41,	paths.quarterDotNote,		paths.quarterDotRest);
	instance.QUARTER=			new Values('QUARTER',			12,		10, 20, 40,		12, 41,	paths.quarterNote,			paths.quarterRest);
	instance.EIGHTH_DOT=		new Values('EIGHTH_DOT',		9,		14, 28, 40,		15, 39,	paths.eighthDotNote,		paths.eighthDotRest);
	instance.QUARTER_TRIPPLET=	new Values('QUARTER_TRIPPLET',	8,		13, 26, 40,		15, 41,	paths.quarterTrippletNote,	paths.quarterTrippletRest);
	instance.EIGHTH=			new Values('EIGHTH',			6,		8,	16, 40,		15, 39,	paths.eighthNote,			paths.eighthRest);
	instance.EIGHTH_TRIPPLET=	new Values('EIGHTH_TRIPPLET',	4,		11, 22, 40,		15, 39,	paths.eighthTrippletNote,	paths.eighthTrippletRest);
	instance.SIXTEENTH=			new Values('SIXTEENTH',			3,		6,	12, 40,		15, 39,	paths.sixteenthNote,		paths.sixteenthRest);
	function Values(name, tickSpan, minLead, minTrail, noteWidth,  restWidth, restY, drawNote, drawRest){
		this.name=name;
		this.tickSpan=tickSpan;
		this.minLead=minLead;
		this.minTrail=minTrail;
		this.noteWidth=noteWidth;
		this.restWidth=restWidth;
		this.restY=restY;
		this.drawNote=drawNote;
		this.drawRest=drawRest;
	}
	instance.getRhythmByTicks=function(ticks){
		for(p in RhythmValue){
			let r=RhythmValue[p];
			if(typeof r==='object'&&r.tickSpan===ticks){
				return r;
			}
		}
	}
	instance.getRestsArray=function(ticks){
		let restRhythmValuesToInsert=[];
		if(loader.getTime()===TimeSignature.SIX_BY_EIGHT){
			alert('6x8: Futuristic');
		}else{
			if(ticks>=24){
				restRhythmValuesToInsert.unshift(instance.getRhythmByTicks(24).name);
				ticks-=24;					
			}
			if(ticks===16){
				restRhythmValuesToInsert.unshift(instance.getRhythmByTicks(8).name);
				restRhythmValuesToInsert.unshift(instance.getRhythmByTicks(8).name);
				ticks-=16;										
			}
			if(ticks>=12){
				restRhythmValuesToInsert.unshift(instance.getRhythmByTicks(12).name);
				ticks-=12;										
			}
			if(ticks===8){
				restRhythmValuesToInsert.unshift(instance.getRhythmByTicks(8).name);
				ticks-=8;										
			}
			if(ticks>=6){
				restRhythmValuesToInsert.unshift(instance.getRhythmByTicks(6).name);
				ticks-=6;										
			}
			if(ticks===4){
				restRhythmValuesToInsert.unshift(instance.getRhythmByTicks(4).name);
				ticks-=8;										
			}
			if(ticks===3){
				restRhythmValuesToInsert.unshift(instance.getRhythmByTicks(3).name);
				ticks-=3;										
			}
			if(ticks!==0){
				throw new Error('Invalid tickSpan');
			}			
		}
		return restRhythmValuesToInsert;
	};
	return instance;
})();
const Clef=(function(){
	const width=50;
	const instance={};
	instance.TREBLE=new Values(
		function(staffIndex){
			let y=staffIndex*staffHeight+headerHeight;
			paths.tempFillStyle('black');
			loader.getCtx().fill(new Path2D('m 26,'+(y+83)+' '+
			   'c 14.6,0.3 14.2,-19.1 4.1,-19.1 c -8.9,0 -10.7,9 -4.8,13.5 c -13.64,-3.7 -5.8,-18.2 4.7,-18.2 '+
			   'c 5.8,0 12.3,5.2 12.3,12.2 c 0,4.8 -3.9,12.6 -15.9,13.4 c -13.48,-0.4 -19.714,-8.2 -19.714,-16.6 '+
			   'c 0,-6.8 4.124,-16.1 13.714,-23.7 c 13.3,-10.4 16.6,-18.2 10.7,-25.46 c -3.6,3.96 -8.1,7.86 -6.3,21.06 '+
			   'l 11.1,53.6 c 0.4,2.9 -1.3,6.6 -5.5,8.5 c -4,1.9 -9.8,1.2 -11.2,0.3 c -4.16,-1.8 -5.35,-4 -5.28,-6.5 '+
			   'c 0.12,-3.4 2.78,-6.8 6.28,-6.8 c 6.8,0 9.4,10.8 0,12.3 c 4,2.2 15.5,-0.3 13.2,-10.1 l -10.4,-49.5 '+
			   'c -3.7,-16.8 3.3,-23.46 7.1,-29.594 c 12.8,13.894 7.1,29.094 -4.6,37.694 c -24.64,17.7 -13.32,33 0.5,33 z'));
			paths.tempFillStyle();
		}
	);
	instance.BASS=new Values(
		function(staffIndex){
			let y=staffIndex*staffHeight+headerHeight;
			paths.tempFillStyle('black');			
			loader.getCtx().fill(new Path2D('m 8, '+(y+78)+' '+
			   'c 12.4,0.4 26.6,-15.3 26.8,-24.9 0.2,-11.59 -6.7,-15.5 -14.1,-15.5 -7.4,0 -12.7,4.69 -12.7,10.7 0,7 '+
			   '10.4,7.1 10.6,1.6 0.2,-6.62 -7.5,-4.64 -7.44,-3.19 0.11,-9.649 17.44,-11.52 17.04,4.29 -0.5,18.1 -20.2,27 '+
			   '-20.2,27 z '+
			   'm 35.8,-24 a 2.47,2.47 0 0 1 -2.4,2.4 2.47,2.47 0 0 1 -2.5,-2.4 2.47,2.47 0 0 1 2.5,-2.5 '+
			   '2.47,2.47 0 0 1 2.4,2.5 z'+
			   ' m 0,-12.05 a 2.47,2.47 0 0 1 -2.4,2.47 2.47,2.47 0 0 1 -2.5,-2.47 2.47,2.47 '+
			   '0 0 1 2.5,-2.46 2.47,2.47 0 0 1 2.4,2.46 z'));
			paths.tempFillStyle();
		}
	);
	instance.getWidth=function(){return width;};
	instance.draw=function(clef){
		for(let i=0; i<numOfStaves; i++){
			Clef[clef].draw(i);
		}
	};
	function Values(draw){
		this.draw=draw;
	}
	return instance;
})();
const TimeSignature=(function(){
	const width=25;
	const instance={};
	instance.TWO_BY_FOUR=new Values(12, 24, 2, 4);
	instance.THREE_BY_FOUR=new Values(12, 36, 3, 4);
	instance.FOUR_BY_FOUR=new Values(12, 48, 4, 4);
	instance.SIX_BY_EIGHT=new Values(12, 24, 6, 8);
	instance.getWidth=function(){return width;};
	instance.draw=function(){
		TimeSignature[loader.getTime()].draw(Clef.getWidth()+KeySignature[loader.getKey()].width);//
	};	
	function Values(ticksPerBeat, barDuration, upperNumber, lowerNumber){
		this.ticksPerBeat=ticksPerBeat;
		this.barDuration=barDuration;
		this.upperNumber=upperNumber;
		this.lowerNumber=lowerNumber;
		this.beatDuration;
		this.numOfBeats;
		this.signature;
		this.draw=function(x){			
			paths.tempFont('bold 28px sans-serif');
			loader.getCtx().fillText(this.upperNumber, x+5, 58+headerHeight);
			loader.getCtx().fillText(this.lowerNumber, x+5, 82+headerHeight);
			paths.tempFont();
		};
	}
	return instance;
})();
const NoteClass=(function(){
	const instance={};
	instance.C=new Values('Do', 'Do');
	instance.D=new Values('Re', 'Re');
	instance.E=new Values('Mi', 'Mi');
	instance.F=new Values('Fa', 'Fa');
	instance.G=new Values('Sol', 'So');
	instance.A=new Values('La', 'La');
	instance.B=new Values('Si', 'Ti');
	function Values(es, en){
		this.es=es;
		this.en=en;
	};
	return instance;
})();
const Scale=(function(){
	const instance={};	
	instance.C=new Values(1, [1, 3, 3, 1, 3, 3, 3]);
	instance.F=new Values(0, [2, 3, 3, 1, 3, 3, 2]);
	instance.Bb=new Values(0, [2, 3, 2, 2, 3, 3, 2]);
	instance.Eb=new Values(0, [2, 3, 2, 2, 3, 2, 3]);
	instance.G=new Values(1, [1, 3, 3, 2, 2, 3, 3]);
	instance.D=new Values(1, [2, 2, 3, 2, 2, 3, 3]);
	instance.A=new Values(1, [2, 2, 3, 2, 3, 2, 3]);	
	function Values(startingIndex, scalePattern){
		let scale=[];
		for(let i=startingIndex, j=0; i<pitchValues.length;){
			scale.push(pitchValues[i]);
			i+=scalePattern[j];
			if(++j>=scalePattern.length){
				j=0;
			}
		}
		return scale;
	}
	return instance;
})();
const KeySignature=(function(){
	const instance={};
	const font='bold 40px serif';
	instance.C=new Values(	Scale.C,	15,	0,	function(){});
	instance.F=new Values(	Scale.F,	18,	18,	function(staffIndex, isBass){drawFlats(staffIndex,	1, isBass);});
	instance.Bb=new Values(	Scale.Bb,	21,	34,	function(staffIndex, isBass){drawFlats(staffIndex,	2, isBass);});
	instance.Eb=new Values(	Scale.Eb,	17,	50,	function(staffIndex, isBass){drawFlats(staffIndex,	3, isBass);});
	instance.G=new Values(	Scale.G,	19,	24,	function(staffIndex, isBass){drawSharps(staffIndex,	1, isBass);});
	instance.D=new Values(	Scale.D,	16,	42,	function(staffIndex, isBass){drawSharps(staffIndex,	2, isBass);});
	instance.A=new Values(	Scale.A,	20,	60,	function(staffIndex, isBass){drawSharps(staffIndex, 3, isBass);});
	instance.drawAll=function(isBass){
		for(let i=0; i<numOfStaves; i++){
			KeySignature[loader.getKey()].draw(i, isBass);
		}		
	}
	let drawSharps=function (staffIndex, thisMany, isBass){
		let x=Clef.getWidth();
		paths.tempFont(font);
		let y=48+headerHeight+96*staffIndex+(isBass?12:0);
		loader.getCtx().fillText('\u266F', x, y);
		if(thisMany==1){
			paths.tempFont();
			return;
		}
		x+=18;
		y+=3*stepHeight;
		loader.getCtx().fillText('\u266F', x, y);
		if(thisMany==2){
			paths.tempFont();
			return;
		}
		x+=23;
		y-=4*stepHeight;
		loader.getCtx().fillText('\u266F', x, y);
		paths.tempFont();
	}
	let drawFlats=function(staffIndex, thisMany, isBass){
		let x=Clef.getWidth();
		paths.tempFont(font);
		let y=headerHeight+67+96*staffIndex+(isBass?12:0);
		loader.getCtx().fillText('\u266D', x-3, y);
		if(thisMany==1){
			paths.tempFont();
			return;
		}
		x+=15;
		y+=-3*stepHeight;
		loader.getCtx().fillText('\u266D', x, y);
		if(thisMany==2){
			paths.tempFont();
			return;
		}
		x+=15;
		y+=4*stepHeight;
		loader.getCtx().fillText('\u266D', x, y);
		paths.tempFont();
	}
	function Values(scale, tonicIndex, width, draw){
		this.scale=scale;
		this.tonicIndex=tonicIndex;
		this.width=width;
		this.draw=draw;
	}
	return instance;
})();
const Alteration=(function(){
	const instance={};	
	instance.NONE=new Values('NONE', null);
	instance.SHARP=new Values('SHARP', null);
	instance.FLAT=new Values('FLAT', null);
	instance.NATURAL=new Values('NATURAL', function (x, y){
		paths.tempFont('bold 44px serif');
		loader.getCtx().fillText('\u266E', x, y);
		paths.tempFont();
	});
	function Values(name, draw){
		this.name=name;
		this.draw=draw;
	}
	return instance;
})();
const Modifier=(function(){
	const instance={};
	instance.NONE=new Values('NONE');
	instance.DOT=new Values('DOT');
	instance.DOUBLE_DOT= new Values('DOUBLE_DOT');
	instance.TRIPPLET= new Values('TRIPPLET');	
	function Values(name){
		this.name=name;
	};
	return instance;
})();
const BarLine=(function(){
	const instance={};
	instance.SINGLE=new Values('SINGLE', 2, function(x, y){
		paths.tempLineWidth(2);
		loader.getCtx().stroke(new Path2D('m '+x+' '+y+' v 48'));
		paths.tempLineWidth();
	});
	instance.DOUBLE=new Values('DOUBLE', 10, function(x, y){
		paths.tempLineWidth(2);
		loader.getCtx().stroke(new Path2D('m '+x+' '+y+' v 48 m 7, -48 v 48'));
		paths.tempLineWidth();
	});
	instance.FINAL=new Values('FINAL', 15, function(x, y){
		paths.tempLineWidth(2);
		loader.getCtx().stroke(new Path2D('m '+x+' '+(y-1)+' v '+(stepHeight*2*4)));
		paths.tempLineWidth();
		paths.tempLineWidth(6);
		loader.getCtx().stroke(new Path2D('m '+(x+8)+' '+y+' v '+(stepHeight*2*4)));
		paths.tempLineWidth();
	});	
	function Values(name, width, draw){
		this.name=name;
		this.width=width;
		this.draw=draw;
	}
	return instance;	
})();