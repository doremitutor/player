const loader=(function(){
	let name, clef, key, time, tempoValue, buttonPlayPause, buttonReplay, buttonRw, buttonTune, markingCheckBox,
		currentIndex, rememberedIndex, bufferedIndex, figure, state,
		cursorVisible, namesVisible, metronomeOn, markStart, metronomeRunning=false, marking=false, markCompleted=false; 
	const instance={}, sequence=[], tempoDev=40, tempoStep=5, metroDev=5, metroStep=1;
	window.addEventListener('load', setUpApp, false);
	let ctx;
	function setUpApp(){
		if(canvas.getContext){
			ctx=canvas.getContext("2d");
			ctx.lineWidth=2;
			ctx.strokeStyle=ctx.fillStyle='black';
		}
		else{
			alert("Sorry, no canvas here");
			return;
		}
		const AudioContext=window.AudioContext||window.webkitAudioContext||window.mozAudioContext||window.oAudioContext;
		if(!AudioContext){
			alert("Sorry. WebAudio API not supported. Try using the Google Chrome, Firefox, or Safari browser.");
		}
		loadLessonSpecs();
		buttonPlayPause=document.getElementById('play');
		buttonPlayPause.innerText='Iniciar';
		buttonPlayPause.addEventListener('click', start, false)
		buttonReplay=document.getElementById('replay');
		buttonReplay.innerText='Repetir\núltimo arranque';
		buttonReplay.addEventListener('click', restart, false);
		buttonReplay.setAttribute('disabled', '');
		buttonRw=document.getElementById('rw');
		buttonRw.addEventListener('click', rewind, false);
		buttonRw.setAttribute('disabled', '');
		buttonRw.innerText='Regresar\nal inicio';
		buttonTune=document.getElementById('tune')
		buttonTune.innerText='Tónica para\nentonación (2 seg)';
		buttonTune.addEventListener('click', tune, false);		
		let tempoSlider=document.getElementById('tempo');
		let tempoLabel=document.getElementById('tempoLabel');
		tempoSlider.min=tempoValue-tempoDev;
		tempoSlider.max=tempoValue-(-tempoDev);
		tempoSlider.step=tempoStep;
		tempoSlider.value=tempoValue;
		tempoLabel.textContent=tempoSlider.value;
		tempoSlider.addEventListener('change', function(){
			tempoValue=tempoLabel.textContent=tempoSlider.value;
			updateMetronomeMarkValue(tempoValue, true);
		}, false);
		let metroSlider=document.getElementById('metroVol');
		metroSlider.min=-metroDev;
		metroSlider.max=metroDev;
		metroSlider.step=metroStep;
		let metroLabel=document.getElementById('metroLabel');
		if(localStorage.getItem('metroVol')){
			metroSlider.value=localStorage.getItem('metroVol');	
		}else{
			metroSlider.value=0;
		}		
		metroLabel.textContent=metroSlider.value;
		metroSlider.addEventListener('change', function(){
			let metroVol=metroLabel.textContent=metroSlider.value;
			beepGainValue=beepGainValueBase+beepGainValueBase*metroVol*(metroVol>0?2:1)/10;
			if(metroVol==='0'){
				if(localStorage.getItem('metroVol')!==null){
					localStorage.removeItem('metroVol');
				}
			}else{
				localStorage.setItem('metroVol', metroVol);
			}
		}, false);
		beepGainValue=beepGainValueBase;
		let cursorCheckBox=document.getElementById('cursor');
		let namesCheckBox=document.getElementById('names');
		let metroCheckBox=document.getElementById('metro');
		markingCheckBox=document.getElementById('marking');
		if(localStorage.getItem('hideCursor')){
			cursorVisible=false;	
		}else{
			cursorVisible=true;
			cursorCheckBox.setAttribute('checked', '');
		}
		if(localStorage.getItem('hideNames')){
			namesVisible=false;	
		}else{
			namesVisible=true;
			namesCheckBox.setAttribute('checked', '');
		}
		if(localStorage.getItem('metronomeOff')){
			metronomeOn=false;
			markingCheckBox.setAttribute('disabled', '');
		}else{
			metronomeOn=true;
			metroCheckBox.setAttribute('checked', '');
		}
		if(localStorage.getItem('markingOff')){
			markStart=false;	
		}else{
			markStart=true;
			markingCheckBox.setAttribute('checked', '');
		}
		cursorCheckBox.addEventListener('change', function(e){
			cursor(cursorVisible=e.target.checked);
			if(cursorVisible){
				if(localStorage.getItem('hideCursor')){
					localStorage.removeItem('hideCursor');
				}				
			}else{
				localStorage.setItem('hideCursor', 'hideCursor');
			}
		}, false);
		namesCheckBox.addEventListener('change', function(e){
			toggleNames(showNames=e.target.checked);
			if(showNames){
				if(localStorage.getItem('hideNames')){
					localStorage.removeItem('hideNames');
				}
			}else{
				localStorage.setItem('hideNames', 'hideNames');
			}
		}, false);
		metroCheckBox.addEventListener('change', function(e){
			if((metronomeOn=e.target.checked)&&markingCheckBox.disabled){
				markingCheckBox.removeAttribute('disabled');
			}else if(!(metronomeOn=e.target.checked)&&!markingCheckBox.disabled){
				markingCheckBox.setAttribute('disabled', '');				
			}
			if(metronomeOn){
				if(localStorage.getItem('metronomeOff')){
					localStorage.removeItem('metronomeOff');
				}
			}else{
				localStorage.setItem('metronomeOff', 'metronomeOff');
			}
		}, false);
		markingCheckBox.addEventListener('change', function(e){
			markStart=e.target.checked;
			if(markStart){
				if(localStorage.getItem('markingOff')){
					localStorage.removeItem('markingOff');
				}
			}else{
				localStorage.setItem('markingOff', 'markingOff');
			}
		}, false);
		canvas.addEventListener('click', onCanvasClick, false);
		drawMetronomeMarkSymbol();
		updateMetronomeMarkValue(tempoValue, false);
		Clef.draw(clef);
		KeySignature.drawAll(clef==='BASS');
		TimeSignature.draw(time);
		createSequence();
		toggleNames(true);
		currentIndex=0;
		cursor(cursorVisible);
	};	
	function loadLessonSpecs(){
		name=lesson.specs.name;
		clef=lesson.specs.clef;
		key=lesson.specs.key;
		time=lesson.specs.time;
		tempoValue=lesson.specs.tempo;
	};
	function drawMetronomeMarkSymbol(){
		paths.tempFont('36px sans-serif');	
		ctx.fillText('\u2669', metronomeMarkX, metronomeMarkY);
		paths.tempFont();
	};
	function updateMetronomeMarkValue(tempo, clear){
		if(clear){ctx.clearRect(metronomeMarkX+12.5, metronomeMarkY-22.5, 60, 26);}	
		paths.tempFont('bold 26px sans-serif');
		ctx.fillText('='+tempo, metronomeMarkX+14, metronomeMarkY-2);//='+ x+14
		paths.tempFont();
	};
	function createSequence(){
		let staves=lesson.staves;
		for(let i=0; i<staves.length; i++){
			let staff=staves[i];
			let bars=staff.bars;
			for(let j=0; j<bars.length; j++){
				let barFrom=bars[j];
				let bar=new Bar(barFrom.x, barFrom.y, barFrom.barLineType, barFrom.barLineX, barFrom.figures);//, barFrom.width
				if(i===0&&j===0){
					bar.isFirst=true;
				}
				let figures=bar.figures;
				for(let k=0; k<figures.length; k++){
					sequence.push(figures[k]);
				}
			}
		}
	};
	function toggleNames(show){
		for(let i=0; i<sequence.length; i++){
			let figure=sequence[i];
			if(figure instanceof Note){
				figure.toggleName(show);							
			}
		}
	};
	let ac, wave
	function setAC(){
		if(!ac){
			ac=new AudioContext({latencyHint: "interactive", sampleRate: 44100});
			wave=ac.createPeriodicWave(real, imag, {disableNormalization: true});
		}
	};
	function start(){
		buttonPlayPause.removeEventListener('click', start);
		buttonPlayPause.addEventListener('click', stop, false);
		buttonPlayPause.innerText='Detener\nla lección';
		buttonReplay.setAttribute('disabled', '');
		buttonRw.setAttribute('disabled', '');
		buttonTune.setAttribute('disabled', '');
		markingCheckBox.setAttribute('disabled', '');
		setAC();
		if(state===Status.IDDLE){
			play();
		}else if(state===Status.PAUSED){
			cursor(false);
			currentIndex=sequence.indexOf(sequence[currentIndex].getParentBar().figures[0]);
			cursor(true);
			play();			
		}
		rememberedIndex=currentIndex;
		state=Status.PLAYING;
	};	
	function restart(){		
		buttonPlayPause.removeEventListener('click', start);
		buttonPlayPause.addEventListener('click', stop, false);
		buttonPlayPause.innerText='Detener\nla lección';
		buttonReplay.setAttribute('disabled', '');
		buttonRw.setAttribute('disabled', '');
		buttonTune.setAttribute('disabled', '');
		markingCheckBox.setAttribute('disabled', '');
		cursor(false);
		currentIndex=rememberedIndex;
		cursor(true);
		markCompleted=false;
		play();
		state=Status.PLAYING;
	};
	function stop(){
		buttonPlayPause.removeEventListener('click', stop);
		buttonTune.removeAttribute('disabled');
		markingCheckBox.removeAttribute('disabled');
		if(toneOsc){
			toneOsc.stop();
		}		
		if(metronomeRunning){
			clearTimeout(timeOutMetronome);
			metronomeRunning=false;
			if(marking){
				marking=false;
			}
		}
		if(marking&&!markCompleted||sequence[currentIndex].getParentBar().isFirst){//===lesson.staves[0].bars[0]
			state=Status.IDDLE;
			cursor(false);
			currentIndex=rememberedIndex=bufferedIndex=0;
			cursor(true);
			markCompleted=false;
			buttonPlayPause.innerText='Iniciar';
			buttonPlayPause.addEventListener('click', start, false);
		}else{			
			state=Status.PAUSED;
			buttonPlayPause.innerText='Reanudar en\n compás actual';
			buttonRw.removeAttribute('disabled');
			buttonTune.removeAttribute('disabled');
			if(!sequence[rememberedIndex].getParentBar().isFirst&&sequence[rememberedIndex].getParentBar()!=sequence[currentIndex].getParentBar()){
				buttonReplay.removeAttribute('disabled');	
			}			
		}
		buttonPlayPause.addEventListener('click', start, false);	
	};
	function rewind(){
		buttonPlayPause.innerText='Iniciar';
		buttonRw.setAttribute('disabled', '');
		buttonReplay.setAttribute('disabled', '');
		cursor(false);
		currentIndex=rememberedIndex=bufferedIndex=0;
		cursor(true);
		state=Status.IDDLE;
		markCompleted=false;
	};
	function tune(){
		buttonPlayPause.setAttribute('disabled', '');
		buttonTune.setAttribute('disabled', '');
		let restoreReplay;
		if(!buttonReplay.disabled){
			restoreReplay=true;
			buttonReplay.setAttribute('disabled', '');
		}
		setAC();
		let tuneOsc=ac.createOscillator();
		let oscParamIndex=KeySignature[key].scale[KeySignature[key].tonicIndex].oscParamIndex;
		let duration=2;
		tuneOsc.setPeriodicWave(wave);
		tuneOsc.frequency.value=oscParam[oscParamIndex].freq;			
		gainFactor=oscParam[oscParamIndex].gainFactor;
		let tuneGain=ac.createGain();
		tuneGain.connect(ac.destination);
		tuneOsc.connect(tuneGain);
		tuneOsc.onended=function(){
			buttonPlayPause.removeAttribute('disabled');
			buttonTune.removeAttribute('disabled', '');
			if(restoreReplay){
				buttonReplay.removeAttribute('disabled');
			}
		}
		volumeAttack=1*gainFactor;
		volumeSustain=0.9*gainFactor;
		volumeRelease=0.8*gainFactor;
		tuneGain.gain.setValueAtTime(0, ac.currentTime);
		tuneGain.gain.linearRampToValueAtTime(volumeAttack, ac.currentTime+attack);
		tuneGain.gain.linearRampToValueAtTime(volumeSustain, ac.currentTime+attack+decay);
		tuneGain.gain.linearRampToValueAtTime(volumeRelease, ac.currentTime+duration-release);
		tuneGain.gain.linearRampToValueAtTime(0.0, ac.currentTime+duration);
		vibrato=ac.createOscillator();
		vibrato.frequency.value=4.5;
		vibratoGain=ac.createGain();
		vibrato.connect(vibratoGain);
		vibratoGain.connect(tuneGain.gain);
		vibratoGain.gain.setValueAtTime(0.1*gainFactor, ac.currentTime+lfoDelay);
		vibrato.start(ac.currentTime+lfoDelay);
		tuneOsc.start(ac.currentTime);
		vibrato.stop(ac.currentTime+duration);
		tuneOsc.stop(ac.currentTime+duration);
	};
	let t0, duration, metronomeDelay, toneOsc, gainFactor, toneGain, volumeAttack, volumeSustain, volumeRelease, vibrato, vibratoGain;
	const attack=0.1, decay=0.02, release=0.05, lfoDelay=attack+0.5;	
	function play(){
		t0=ac.currentTime;
		figure=sequence[currentIndex];		
		if(figure.isFirstInBar()){
			duration=5*figure.getTicksSpan()/tempoValue;
			if(metronomeOn){
				metronomeDelay=60000/tempoValue-beepDuration*1000;
				if(markStart&&(!markCompleted||state===Status.PAUSED)&&!marking){
					marking=true;
					startMetronome(true);
					return;
				}else if(marking){
					marking=false;
				}
				startMetronome(false);
			}		
		}
		toneOsc=ac.createOscillator();
		if(figure instanceof Note){
			toneOsc.setPeriodicWave(wave);
			toneOsc.frequency.value=oscParam[figure.oscParamIndex].freq;			
			gainFactor=oscParam[figure.oscParamIndex].gainFactor;
			toneGain=ac.createGain();
			toneGain.connect(ac.destination);
			toneOsc.connect(toneGain);
			volumeAttack=1*gainFactor;
			volumeSustain=0.9*gainFactor;
			volumeRelease=0.8*gainFactor;
			toneGain.gain.setValueAtTime(0, ac.currentTime);
			toneGain.gain.linearRampToValueAtTime(volumeAttack, ac.currentTime+attack);
			toneGain.gain.linearRampToValueAtTime(volumeSustain, ac.currentTime+attack+decay);
			toneGain.gain.linearRampToValueAtTime(volumeRelease, ac.currentTime+duration-release);
			toneGain.gain.linearRampToValueAtTime(0.0, ac.currentTime+duration);
			vibrato=ac.createOscillator();
			vibrato.frequency.value=4.5;
			vibratoGain=ac.createGain();
			vibrato.connect(vibratoGain);
			vibratoGain.connect(toneGain.gain);
			vibratoGain.gain.setValueAtTime(0.1*gainFactor, ac.currentTime+lfoDelay);
			vibrato.start(ac.currentTime+lfoDelay);
			vibrato.stop(ac.currentTime+duration);
		}else{
			toneOsc.frequency.value=gainFactor=0;
		}
		enlightFigure(true);
		toneOsc.start(ac.currentTime);
		toneOsc.stop(ac.currentTime+duration);
		toneOsc.onended=function(){
			enlightFigure(false);
			if(state===Status.PLAYING){
				checkForEnding();
			}
		}
	};
	let count, beepOsc, beepGain, beepGainValue, timeOutMetronome;
	const beepHi=1800, beepLow=1200, beepDuration=0.05, beepGainValueBase=0.02;
	function startMetronome(dry=false){
		if(dry){
			markCompleted=false;
		}
		metronomeRunning=true;
		count=0;
		beep();
		function beep(){
			if(!metronomeRunning){return;}
			if(dry&&marking&&markCompleted){
				metronomeRunning=false;
				play();						
				return;
			}
			beepOsc=ac.createOscillator();
			beepGain=ac.createGain();
			beepOsc.type='square'; 
			beepOsc.frequency.value=count===0?beepHi:beepLow;
			beepOsc.connect(beepGain);
			beepGain.gain.value=beepGainValue;
			beepGain.connect(ac.destination);
			beepOsc.onended=function(){
				if(metronomeRunning){
					if(count++===(TimeSignature[time].lowerNumber-1)){
						markCompleted=true;
						if(!marking){
							metronomeRunning=false;
							return;
						}							
					}
				}
				timeOutMetronome=setTimeout(beep, metronomeDelay);
			}
			beepOsc.start(ac.currentTime);
			beepOsc.stop(ac.currentTime+beepDuration);
		};
	};	
	function checkForEnding(){
		/* delta=Math.trunc((ac.currentTime-t0)*1000);
		text+='\n'+delta; */
		if(cursorVisible){
			cursor(false);
		} 
		if(sequence[currentIndex+1]){
			currentIndex++;
			if(cursorVisible){
				cursor(true);
			} 				
			play();
		}else{
			if(metronomeOn){
				beepOsc=ac.createOscillator();
				beepGain=ac.createGain();
				beepOsc.type='square'; 
				beepOsc.frequency.value=beepHi;
				beepOsc.connect(beepGain);
				beepGain.gain.value=beepGainValue;
				beepGain.connect(ac.destination);
				beepOsc.start(ac.currentTime);
				beepOsc.stop(ac.currentTime+beepDuration*8);
				rewind();
				/* alert(text);lap++;
				text='Lap '+lap+':' */
				buttonTune.removeAttribute('disabled');
				markingCheckBox.removeAttribute('disabled');
				buttonPlayPause.removeEventListener('click', stop);
				buttonPlayPause.addEventListener('click', start, false);
			}
		}			
	};	
	function enlightFigure(on){
		let color=on?'red':'black';
		paths.tempFillStyle(color);
		paths.tempStrokeStyle(color);
		figure.draw();
		paths.tempFillStyle();
		paths.tempStrokeStyle();
	};
	function onCanvasClick(e){
		let text;
		let osX=e.offsetX;
		if(osX<284){
			text='Rewind';
			buttonRw.click();
		}
		if(osX>=284&&osX<586){			
			text='Replay';
			buttonReplay.click();
		}
		if(osX>=586){
			text='Play/Pause';
			buttonPlayPause.click();
		}
		if(osX>=639){
		}
	};
	function cursor(show){
		let x=sequence[currentIndex].getX()-10;
		let y=sequence[currentIndex].getParentBar().y+19;
		if(show){
			paths.tempFillStyle('red');
			ctx.fillRect(x, y, 3, 82);
			paths.tempFillStyle();
		}else{			
			ctx.clearRect(x-1, y-1, 5, 84);
		};
	};
	const Status=(function(){
		const instance={};
		instance.PLAYING=1;
		instance.PAUSED=2;
		instance.IDDLE=3;
		state=instance.IDDLE;
		return instance;
	})();
	instance.getCtx=function(){return ctx;};
	instance.getClef=function(){return clef;};
	instance.getKey=function(){return key;};
	instance.getTime=function(){return time;};
	return instance;
})();