var HIGHLIGHTED_BOX;
var SIZE;
var SCORE=0;
var MISSED=0;
var INTERVAL_TIMER = null;
/**
 * On click of start game - construct the grid and display a 3 sec count down
 * Reset score to 0
 */
function startgame() {
    document.getElementById('startgameform').style.display = 'none';
    //TODO: add animation while removing the above section
    SIZE = +document.getElementById('gridsize').value;
    _constructGrid();
    document.getElementsByClassName('gamegridcontainer')[0].style.display = 'flex';
}

/**
 * Construting nxn grid using Grid layout in CSS
 */
function _constructGrid() {
    const gamegrid = document.getElementsByClassName("gamegrid")[0];
    
    for (let i=0; i<SIZE*SIZE; i++) {
        let el = document.createElement("DIV");
        el.setAttribute('class', 'gamebox');
        el.setAttribute('id', 'gameboxid_'+i);
        el.setAttribute('onclick', '_boxClickListener(this)');
        gamegrid.appendChild(el);
    }
    const gridstyle=`
        grid-template-columns: repeat(${SIZE}, auto);
        grid-template-rows: repeat(${SIZE}, auto);
    `;

    gamegrid.setAttribute('style', gridstyle);

    //TODO: add some delay before the game starts - may be a overlay of 3 2 1 count down
    _startCountDownTimer();
}

/**
 * 3 sec countdown timer to give player some time before the game starts
 */
function _startCountDownTimer() {
    //overlay with text
    //disable click events in the backgrounds
    _overlayDisplay(false);
    var overlay = document.getElementById('countdownoverlay');
    var count = 3;
    overlay.querySelector('h1').innerHTML = count;
    countdowntimer = setInterval(()=>{
        overlay.querySelector('h1').innerHTML = --count;
    }, 1000);
    setTimeout(()=>{
        overlay.style.display = 'none';
        clearInterval(countdowntimer);
        _startGame();
    }, 3000);
}

/**
 * After the 3 sec countdown timer where the game acutally starts.
 * Call highlightgrid function inside interval timer
 */
function _startGame() {
    var row, col, count=50; //TODO: temp 50. change to 10 when you add additional timer
    SCORE=0; MISSED=0;
    INTERVAL_TIMER = setInterval(()=>{
        row = _randomIntGenerator(0, SIZE);
        col = _randomIntGenerator(0, SIZE);
        HIGHLIGHTED_BOX = row*col;
        // console.log(HIGHLIGHTED_BOX);
        if(MISSED>3) {
            //Overlay Display Score
            _gameOver();
            
        }
        _highlightGrid();
        if(--count==0) {
            clearInterval(INTERVAL_TIMER);
            _gameOver();
            //call next timer
        }
    }, 1000);
}

function _highlightGrid() {
    const boxnum = HIGHLIGHTED_BOX;
    const el_0 = document.getElementsByClassName('highlight');
    el_0.length && el_0[0].classList.remove('highlight');
    const el_1 = document.getElementsByClassName('gamegrid')[0]
        .querySelectorAll('div')[boxnum];
    el_1.classList.add('highlight');
}

function _boxClickListener(scope) {
    let clickedbox = +scope.id.split('_')[1];
    //These are the places where an observable can help
    if(clickedbox===HIGHLIGHTED_BOX) {
        document.getElementById('scoreval').innerHTML = ++SCORE;
    } else {
        document.getElementById('missedval').innerHTML = ++MISSED;
        //TODO: increment missed even when NOT clicked. right now only when clicked
    }
}

/**
 * On click of back button. Go back to initial form.
 */
function backtoform() {
    _resetGameStates();

    //destroy the grid elements and reset other elements
    document.getElementsByClassName('gamegrid')[0].innerHTML = '';

    //hide gamegridcontainer and overlay (if present)
    let overlay = document.getElementById('countdownoverlay');
    (overlay.style.display !== 'none') && (overlay.style.display = 'none');
    document.getElementById('gamegridcontainer').style.display = 'none';
    //unhide the form
    document.getElementById('startgameform').style.display = 'block';
}

//TODO: complete this function
/**
 * Restart game. Dont go back to form. Reset score. Reset timer state. 
 * Start game again.
 */
function restartgame() {
    _resetGameStates();
    //size remain. 
    //stay back in the same page.
    //display overlay for countdown and start game.
    _startCountDownTimer();
}

function _gameOver() {
    clearInterval(INTERVAL_TIMER);

    _overlayDisplay(true);
    let overlay = document.getElementById('countdownoverlay');
    overlay.querySelector('h2').innerHTML = 'Score: '+SCORE;
}

function _resetGameStates() {
    INTERVAL_TIMER && clearInterval(INTERVAL_TIMER);
    SCORE = 0;
    MISSED = 0;
    document.getElementById('scoreval').innerHTML = 0;
    document.getElementById('missedval').innerHTML = 0;
}

function _overlayDisplay(scorecardflag) {
    var overlay = document.getElementById('countdownoverlay');
    overlay.style.display = 'block';

    overlay.querySelector('h1').style.display = scorecardflag ? 'none' : 'block';
    overlay.querySelector('div').style.display = scorecardflag? 'flex' : 'none';
}
/**
 * Trying  to write generic fn
 * @param {Number} min - our case always 0
 * @param {Number} max - our case equal to matrix size
 */
//TODO: implement - generate non consecutive random numbers
//If you want to escape consecutive integer problem - change the color of the box everytime you generate a num
//So generate random colors also (or pick random color from an existing array)
function _randomIntGenerator(min, max) {
    //return val will be [min, max)
    //so if matrix is 8x8 => min = 0, max=8 => [0, 7]
    return Math.floor(Math.random()*(max-min) + min);
}