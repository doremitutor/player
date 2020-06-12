const headerHeight=36, numOfStaves=4, staffHeight=96, stepHeight=staffHeight/16, barLineHeight=staffHeight/2, barsPerNewStaff=4, bassCleffYposOffset=-12, metronomeMarkX=43, metronomeMarkY=36;
const frequencies=[58.27, 61.74,
			65.41, 69.30, 73.42, 77.78, 82.41, 87.31, 92.50, 98.00, 103.83, 110.00, 116.54, 123.47,
			130.81, 138.59, 146.83, 155.56, 164.81, 174.61, 185.00, 196.00, 207.65, 220.00, 233.08, 246.94,
			261.63, 277.18, 293.66, 311.13, 329.63, 349.23, 369.99, 392.00, 415.30, 440.00, 466.16, 493.88,
			523.25, 554.37, 587.33, 622.25, 659.26, 698.46, 739.99, 783.99, 830.61, 880.00, 932.33, 987.77,
			1046.50, 1108.73, 1174.66, 1244.51];
const real=new Float32Array(13), imag=new Float32Array(real.length);
{real[0]=0; real[1]=0.0566; real[2]=0.0816; real[3]=0.0327; real[4]=0.0314; real[5]=0.0138; real[6]=0.0021;
real[7]=0.0025; real[8]=0.0028; real[9]=0.0001; real[10]=0.0008; real[11]=0.0; real[12]=0.0002;}
const volumeOffsetFactor=0.8/(frequencies.length);
const oscParam=new Array();
for(let i=0; i<frequencies.length; i++){
	oscParam[i]={freq:frequencies[i], gainFactor:1-i*volumeOffsetFactor};
}
const pitchValues=new Array();
{pitchValues[0]={fullName:'bFlat1',		octave:1,  oscParamIndex:0,  classKey:'B', vertPosTreble:30};
pitchValues[1]={fullName:'b1',			octave:1,  oscParamIndex:1,  classKey:'B', vertPosTreble:30};
pitchValues[2]={fullName:'c2',			octave:2,  oscParamIndex:2,  classKey:'C', vertPosTreble:29};
pitchValues[3]={fullName:'cSharp2',		octave:2,  oscParamIndex:3,  classKey:'C', vertPosTreble:29};
pitchValues[4]={fullName:'dFlat2',		octave:2,  oscParamIndex:3,  classKey:'D', vertPosTreble:28};
pitchValues[5]={fullName:'d2',			octave:2,  oscParamIndex:4,  classKey:'D', vertPosTreble:28};
pitchValues[6]={fullName:'dSharp2',		octave:2,  oscParamIndex:5,  classKey:'D', vertPosTreble:28};
pitchValues[7]={fullName:'eFlat2',		octave:2,  oscParamIndex:5,  classKey:'E', vertPosTreble:27};
pitchValues[8]={fullName:'e2',			octave:2,  oscParamIndex:6,  classKey:'E', vertPosTreble:27};
pitchValues[9]={fullName:'f2',			octave:2,  oscParamIndex:7,  classKey:'F', vertPosTreble:26};
pitchValues[10]={fullName:'fSharp2',	octave:2,  oscParamIndex:8,  classKey:'F', vertPosTreble:26};
pitchValues[11]={fullName:'gFlat2',		octave:2,  oscParamIndex:8,  classKey:'G', vertPosTreble:25};
pitchValues[12]={fullName:'g2',			octave:2,  oscParamIndex:9,  classKey:'G', vertPosTreble:25};
pitchValues[13]={fullName:'gSharp2',	octave:2,  oscParamIndex:10, classKey:'G', vertPosTreble:25};
pitchValues[14]={fullName:'aFlat2',		octave:2,  oscParamIndex:10, classKey:'A', vertPosTreble:24};
pitchValues[15]={fullName:'a2',			octave:2,  oscParamIndex:11, classKey:'A', vertPosTreble:24};
pitchValues[16]={fullName:'aSharp2',	octave:2,  oscParamIndex:12, classKey:'A', vertPosTreble:24};
pitchValues[17]={fullName:'bFlat2',		octave:2,  oscParamIndex:12, classKey:'B', vertPosTreble:23};
pitchValues[18]={fullName:'b2',			octave:2,  oscParamIndex:13, classKey:'B', vertPosTreble:23};
pitchValues[19]={fullName:'c3',			octave:3,  oscParamIndex:14, classKey:'C', vertPosTreble:22};
pitchValues[20]={fullName:'cSharp3',	octave:3,  oscParamIndex:15, classKey:'C', vertPosTreble:22};
pitchValues[21]={fullName:'dFlat3',		octave:3,  oscParamIndex:15, classKey:'D', vertPosTreble:21};
pitchValues[22]={fullName:'d3',			octave:3,  oscParamIndex:16, classKey:'D', vertPosTreble:21};
pitchValues[23]={fullName:'dSharp3',	octave:3,  oscParamIndex:17, classKey:'D', vertPosTreble:21};
pitchValues[24]={fullName:'eFlat3',		octave:3,  oscParamIndex:17, classKey:'E', vertPosTreble:20};
pitchValues[25]={fullName:'e3',			octave:3,  oscParamIndex:18, classKey:'E', vertPosTreble:20};
pitchValues[26]={fullName:'f3',			octave:3,  oscParamIndex:19, classKey:'F', vertPosTreble:19};
pitchValues[27]={fullName:'fSharp3',	octave:3,  oscParamIndex:20, classKey:'F', vertPosTreble:19};
pitchValues[28]={fullName:'gFlat3',		octave:3,  oscParamIndex:20, classKey:'G', vertPosTreble:18};
pitchValues[29]={fullName:'g3',			octave:3,  oscParamIndex:21, classKey:'G', vertPosTreble:18};
pitchValues[30]={fullName:'gSharp3',	octave:3,  oscParamIndex:22, classKey:'G', vertPosTreble:18};
pitchValues[31]={fullName:'aFlat3',		octave:3,  oscParamIndex:22, classKey:'A', vertPosTreble:17};
pitchValues[32]={fullName:'a3',			octave:3,  oscParamIndex:23, classKey:'A', vertPosTreble:17};
pitchValues[33]={fullName:'aSharp3',	octave:3,  oscParamIndex:24, classKey:'A', vertPosTreble:17};
pitchValues[34]={fullName:'bFlat3',		octave:3,  oscParamIndex:24, classKey:'B', vertPosTreble:16};
pitchValues[35]={fullName:'b3',			octave:3,  oscParamIndex:25, classKey:'B', vertPosTreble:16};
pitchValues[36]={fullName:'c4',			octave:4,  oscParamIndex:26, classKey:'C', vertPosTreble:15};
pitchValues[37]={fullName:'cSharp4',	octave:4,  oscParamIndex:27, classKey:'C', vertPosTreble:15};
pitchValues[38]={fullName:'dFlat4',		octave:4,  oscParamIndex:27, classKey:'D', vertPosTreble:14};
pitchValues[39]={fullName:'d4',			octave:4,  oscParamIndex:28, classKey:'D', vertPosTreble:14};
pitchValues[40]={fullName:'dSharp4',	octave:4,  oscParamIndex:29, classKey:'D', vertPosTreble:14};
pitchValues[41]={fullName:'eFlat4',		octave:4,  oscParamIndex:29, classKey:'E', vertPosTreble:13};
pitchValues[42]={fullName:'e4',			octave:4,  oscParamIndex:30, classKey:'E', vertPosTreble:13};
pitchValues[43]={fullName:'f4',			octave:4,  oscParamIndex:31, classKey:'F', vertPosTreble:12};
pitchValues[44]={fullName:'fSharp4',	octave:4,  oscParamIndex:32, classKey:'F', vertPosTreble:12};
pitchValues[45]={fullName:'gFlat4',		octave:4,  oscParamIndex:32, classKey:'G', vertPosTreble:11};
pitchValues[46]={fullName:'g4',			octave:4,  oscParamIndex:33, classKey:'G', vertPosTreble:11};
pitchValues[47]={fullName:'gSharp4',	octave:4,  oscParamIndex:34, classKey:'G', vertPosTreble:11};
pitchValues[48]={fullName:'aFlat4',		octave:4,  oscParamIndex:34, classKey:'A', vertPosTreble:10};
pitchValues[49]={fullName:'a4',			octave:4,  oscParamIndex:35, classKey:'A', vertPosTreble:10};
pitchValues[50]={fullName:'aSharp4',	octave:4,  oscParamIndex:36, classKey:'A', vertPosTreble:10};
pitchValues[51]={fullName:'bFlat4',		octave:4,  oscParamIndex:36, classKey:'B', vertPosTreble:9};
pitchValues[52]={fullName:'b4',			octave:4,  oscParamIndex:37, classKey:'B', vertPosTreble:9};
pitchValues[53]={fullName:'c5',			octave:5,  oscParamIndex:38, classKey:'C', vertPosTreble:8};
pitchValues[54]={fullName:'cSharp5',	octave:5,  oscParamIndex:39, classKey:'C', vertPosTreble:8};
pitchValues[55]={fullName:'dFlat5',		octave:5,  oscParamIndex:39, classKey:'D', vertPosTreble:7};
pitchValues[56]={fullName:'d5',			octave:5,  oscParamIndex:40, classKey:'D', vertPosTreble:7};
pitchValues[57]={fullName:'dSharp5',	octave:5,  oscParamIndex:41, classKey:'D', vertPosTreble:7};
pitchValues[58]={fullName:'eFlat5',		octave:5,  oscParamIndex:41, classKey:'E', vertPosTreble:6};
pitchValues[59]={fullName:'e5',			octave:5,  oscParamIndex:42, classKey:'E', vertPosTreble:6};
pitchValues[60]={fullName:'f5',			octave:5,  oscParamIndex:43, classKey:'F', vertPosTreble:5};
pitchValues[61]={fullName:'fSharp5',	octave:5,  oscParamIndex:44, classKey:'F', vertPosTreble:5};
pitchValues[62]={fullName:'gFlat5',		octave:5,  oscParamIndex:44, classKey:'G', vertPosTreble:4};
pitchValues[63]={fullName:'g5',			octave:5,  oscParamIndex:45, classKey:'G', vertPosTreble:4};
pitchValues[64]={fullName:'gSharp5',	octave:5,  oscParamIndex:46, classKey:'G', vertPosTreble:4};
pitchValues[65]={fullName:'aFlat5',		octave:5,  oscParamIndex:46, classKey:'A', vertPosTreble:3};
pitchValues[66]={fullName:'a5',			octave:5,  oscParamIndex:47, classKey:'A', vertPosTreble:3};
pitchValues[67]={fullName:'aSharp5',	octave:5,  oscParamIndex:48, classKey:'A', vertPosTreble:3};
pitchValues[68]={fullName:'bFlat5',		octave:5,  oscParamIndex:48, classKey:'B', vertPosTreble:2};
pitchValues[69]={fullName:'b5',			octave:5,  oscParamIndex:49, classKey:'B', vertPosTreble:2};
pitchValues[70]={fullName:'c6',			octave:6,  oscParamIndex:50, classKey:'C', vertPosTreble:1};
pitchValues[71]={fullName:'cSharp6',	octave:6,  oscParamIndex:51, classKey:'C', vertPosTreble:1};
pitchValues[72]={fullName:'dFlat6',		octave:6,  oscParamIndex:51, classKey:'D', vertPosTreble:0};
pitchValues[73]={fullName:'d6',			octave:6,  oscParamIndex:52, classKey:'D', vertPosTreble:0};
pitchValues[74]={fullName:'dSharp6',	octave:6,  oscParamIndex:53, classKey:'D', vertPosTreble:0};}