function Bar(x, y, barLineType, barLineX, figuresFrom){
	this.x=x;
	this.y=y;
	this.barLineType=barLineType;
	this.barLineX=barLineX;
	this.figures=[];
	BarLine[barLineType].draw(barLineX, y+36);
	for(let i=0; i<figuresFrom.length; i++){
		let figureFrom=figuresFrom[i];
		let figure=figureFrom.pitchIndex?new Note(this, figureFrom.rhythmValue, figureFrom.x, figureFrom.y, figureFrom.pitchIndex, figureFrom.modifier, figureFrom.alteration, figureFrom.linked)
										:new Rest(this, figureFrom.rhythmValue, figureFrom.x, figureFrom.y);
		this.figures.push(figure);
		figure.draw(figure.getX(), figure.getY());
	}
}
/************************************* End of Bar, Figure begins *************************/
function Figure(parentBar, rhythmValue, x, y){
	this.getRhythmValueKey=function(){return rhythmValue};
	this.getX=function(){return x;};
	this.getY=function(){return y;};
	this.getParentBar=function(){return parentBar;};
}
Figure.prototype.getRhythmValue=function(){return RhythmValue[this.getRhythmValueKey()];};
Figure.prototype.getPath=function(){
	let rv=this.getRhythmValue();
	return this instanceof Note?rv.drawNote:rv.drawRest;
};
Figure.prototype.getTicksSpan=function(){
	let rv=this.getRhythmValue();
	if(this instanceof Note){
		return rv.tickSpan;
	}else{
		return rv!==RhythmValue.BAR?rv.tickSpan:TimeSignature[loader.getTime()].barDuration;
	}	
};
Figure.prototype.isFirstInBar=function(){return this.getParentBar().figures.indexOf(this)===0};
/************************************* End of Figure, Rest begins *************************/
function Rest(parentBar, rhythmValue, x, y){
	Figure.call(this, parentBar, rhythmValue, x, y);
};
Rest.prototype=Object.create(Figure.prototype);
Rest.prototype.draw=function(enlight=false){this.getPath()(this.getX(), this.getY());};
/************************************* End of Rest, Note begins *************************/
function Note(parentBar, rhythmValue, x, y, pitchValueIndexInScale, modifier, alteration, linked){
	Figure.call(this, parentBar, rhythmValue, x, y);
	this.getPitchValueIndexInScale=function(){return pitchValueIndexInScale};
	this.pitchValue=KeySignature[loader.getKey()].scale[pitchValueIndexInScale];
	this.oscParamIndex=this.pitchValue.oscParamIndex;
	this.name=NoteClass[this.pitchValue.classKey].es;
	this.op=oscParam[this.oscParamIndex];
};
Note.prototype=Object.create(Figure.prototype);
Note.prototype.getName=function(){return NoteClass[this.getPitchValue().nameIndex].es};
Note.prototype.draw=function(enlight=false){
	let x=this.getX()+10;
	let vertPos=this.pitchValue.vertPosTreble+(Clef[loader.getClef()]===Clef.BASS?-12:0);
	switch(vertPos){
	case 0:
	case 1:
		paths.ledgerLines(x, this.getParentBar().y, true, true);
		break;
	case 2:
	case 3:			
		paths.ledgerLines(x, this.getParentBar().y, true, false);
		break;
	case 15:
	case 16:		
		paths.ledgerLines(x, this.getParentBar().y, false, false);
		break;
	case 17:
	case 18:		
		paths.ledgerLines(x, this.getParentBar().y, false, true);
		break;
	default:
		break;			
	}
	this.getPath()(x, this.getY(), vertPos);
};
Note.prototype.toggleName=function(show){
	let textX=this.getX()+20;
	let textY=this.getY()+6;
	let noteName=this.name;
	let ctx=loader.getCtx();
	let noteFont='bold 16px sans-serif';
	paths.tempFont(noteFont);
	paths.tempTextAlign('left');
	let metrix=ctx.measureText(noteName);
	let xOffsetLeft=metrix.actualBoundingBoxLeft;
	let xOffsetRight=metrix.actualBoundingBoxRight;
	if(show){
		paths.tempFillStyle('rgb(184, 228, 250)');
		ctx.fillRect(textX-xOffsetLeft, textY-13, Math.ceil(xOffsetLeft+xOffsetRight), 14);
		paths.tempFillStyle();
		paths.tempFillStyle('black');
		ctx.fillText(noteName, textX, textY);
		paths.tempFillStyle();
	}else{
		ctx.clearRect(textX-xOffsetLeft-1, textY-14, Math.ceil(xOffsetLeft+xOffsetRight)+2, 16);
		this.draw();
	}
	paths.tempFont();
	paths.tempTextAlign();	
};