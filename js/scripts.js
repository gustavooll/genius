const _data = {
	gameOn: false,
	timeout: undefined,
	sounds: [],

	strict: false,
	playerCanPlay: false,
	score: 0,
	gameSequence: [],
	playerSequence: []
};

const _gui = {
	counter: document.querySelector(".gui_counter"),
	switch: document.querySelector(".gui_btn--switch"),
	led: document.querySelector(".gui_led"),
	strict: document.querySelector(".gui_btn--strict"),
	start: document.querySelector(".gui_btn--start"),
	pads: document.querySelectorAll(".game_pad")
}

const _soundUrls = [
	"audio/simonSound1.mp3",
	"audio/simonSound2.mp3",
	"audio/simonSound3.mp3",
	"audio/simonSound4.mp3"
];

_soundUrls.forEach(sndPath => {
	const audio = new Audio(sndPath);
	_data.sounds.push(audio);
});

_gui.switch.addEventListener("click", () => {
	_data.gameOn = _gui.switch.classList.toggle("gui_btn--switch--on");
	_gui.counter.classList.toggle("gui_counter--on");
	_gui.counter.innerHTML = "00";

	_data.strict = false;
	_data.startGame = false;
	_data.playerCanPlay = false;
	_data.score = 0;
	_data.gameSequence = [];
	_data.playerSequence = [];

	disablePads();
	changePadCursor("auto");
	_gui.led.classList.remove(".gui__led--active")
	
});


_gui.start.addEventListener("click", () => {
	startGame();
});

const padListener = (e) => {
	if(!_data.playerCanPlay){
		return;
	}

	let pad_id;
	_gui.pads.forEach((pad,key)=>{
		if(pad === e.target)
			pad_id = key;
	});
	
	e.target.classList.add("game_pad--active");
	_data.playerSequence.push(pad_id);

	setTimeout(()=>{
		e.target.classList.remove("game_pad--active");

	const currentMove = _data.playerSequence.length -1;

	if(_data.playerSequence[currentMove]!== _data.gameSequence[currentMove]){//errou a sequencia
		_data.playerCanPlay = false;
		disablePads();
		resetOrPlayAgain();
	}
	else if(currentMove === _data.gameSequence.length -1){
		newColor();
	}

	waitForPlayerClick();
	},250);
}

_gui.pads.forEach(pad => {
	pad.addEventListener("click", padListener);
});

const startGame = () => {
	blink("--",()=>{
		newColor();
		playSequence();
	});

}

const setScore = () => {
	const score = _data.score.toString();
	const display = "00".substring(0, 2 - score.length) + score; 

	_gui.counter.innerHTML = display;
}

const newColor = () => {
	/*
	0 - green
	1 - red
	2 - yellow
	3 - blue
	*/
	if(_data.score ===20){
		blink("**",startGame);
		return;
	}

	_data.gameSequence.push(Math.floor(Math.random()*4));
	_data.score++;
	setScore();
	playSequence();
}

const playSequence = () => {
	let counter = 0;
	padOn = true;

	_data.playerSequence = [];
	_data.playerCanPlay = false;

	changePadCursor("auto");

	const interval = setInterval(()=> {
		if(!_data.gameOn){
			clearInterval(interval);
			disablePads();
			return;
		}

		if(padOn){
			if(counter === _data.gameSequence.length){
				clearInterval(interval);
				disablePads();
				waitForPlayerClick();
				changePadCursor("pointer");
				_data.playerCanPlay = true;
				return;
			}
			const pad = _gui.pads[_data.gameSequence[counter]];
			pad.classList.add("game_pad--active");
			counter++;
		}
		else{
			disablePads();
		}

		padOn = !padOn;
	},750);

}

const blink = (text, callback) => {
	let counter = 0;
	on = true;
	_gui.counter.innerHTML = text;

	const interval = setInterval(()=> {
		if(!_data.gameOn){
			clearInterval(interval);
			_gui.counter.classList.remove("gui_counter--on");
			return;
		}
		if(on){
			_gui.counter.classList.remove("gui_counter--on");

		}
		else{
			_gui.counter.classList.add("gui_counter--on");
			if(++counter === 3){
				clearInterval(interval);
				callback();
			}
		}
		on = !on;
	},250);
}

const waitForPlayerClick = () => {
	clearTimeout(_data.timeout);

	_data.timeout = setTimeout(()=> {
		if(!_data.playerCanPlay)
			return;
		disablePads();
		resetOrPlayAgain();
	},3500);

}

const resetOrPlayAgain = () => {
	_data.playerCanPlay = false;

	blink("!!",()=>{
		//_data.score = 0;
		//_data.gameSequence = []
		setScore();
		playSequence();
	});


}

const changePadCursor = (cursorType) => {
	_gui.pads.forEach(pad => {
		pad.style.cursor = cursorType;
	});
}

const disablePads = () => {
	_gui.pads.forEach( pad => {
		pad.classList.remove("game_pad--active")
	});
}

