const board = document.querySelector(".grid-board");
const redContainer = document.querySelector(".red-container");
const blueContainer = document.querySelector(".blue-container");
const greenContainer = document.querySelector(".green-container");
const yellowContainer = document.querySelector(".yellow-container");
const containers = [redContainer,greenContainer,yellowContainer,blueContainer];
const resetButton = document.querySelector(".reset");
let count = 0;
let squares = [];
let playableIndices = [];
let redScore = 5;
let blueScore = 25;
let greenScore = 35;
let yellowScore = 15;
const redStart = 5;
const blueStart = 25;
const greenStart = 35;
const yellowStart = 15;
let redPlaces = [0,1,2,3];
let bluePlaces = [0,1,2,3];
let greenPlaces = [0,1,2,3];
let yellowPlaces = [0,1,2,3];
let redPlacesIndices = [16,27,38,49];
let bluePlacesIndices = [104,93,82,71];
let greenPlacesIndices = [56,57,58,59];
let yellowPlacesIndices = [64,63,62,61];
let redPawnFirstRound = true;
let greenPawnFirstRound = true;
let bluePawnFirstRound = true;
let yellowPawnFirstRound = true;
let redColor = "crimson";
let blueColor = "lightskyblue";
let greenColor = "lightseagreen";
let yellowColor = "gold";
let greyColor = "darkgray";
let currDiceRoll = 0;
let prevDiceRoll = 0;
let round1 = true;

/////////////////  COLORS  ///////////////////
function setupColors() {
    redColor = randomColor();
    blueColor = randomColor();
    greenColor = randomColor();
    yellowColor = randomColor();
    let greyShade = Math.round(Math.random() * 256).toString(16);
    greyColor = "#" + greyShade + greyShade + greyShade;
}

function randomColor() {
    let randomColor = "#" + Math.round(Math.random() * 16777215).toString(16);
    if(randomColor.length < 7) {
        randomColor = randomColor + Math.round(Math.random() * 16).toString(16);
    }
    return randomColor;
}
////////////////////////////  BOARD ////////////////////////////
function makeSquare() {
    let square = document.createElement("div");
    square.classList.add("square");
    return square;
}


function chooseColor(square, i) {
    if(i<11) {
        square.style.backgroundColor = greyColor;
        return;
    }
    if(i%11 === 0 || i%11 === 10) {
        square.style.backgroundColor = greyColor;
        return;
    }
    if(i>109) {
        square.style.backgroundColor = greyColor;
        return;
    }
    if(i%11 === 5 || (i>55 && i<65)) {
        if(i<56) {
            square.style.backgroundColor = redColor;
        } else if(i>55 && i<60) {
            square.style.backgroundColor = greenColor;
        }
        else if(i>60 && i<65) {
            square.style.backgroundColor = yellowColor;
        }
        else if(i===60) {
            square.classList.add("dice-square");
            square.classList.add("dice");
        } else if(i>60 && i<115) {
            square.style.backgroundColor = blueColor;
        }
    } else {
        square.classList.add("empty-square");
    }
}

function drawBoard() {
    for (let i = 0; i < 121; i++) {
        let square = makeSquare();
        chooseColor(square, i);
        board.appendChild(square);
        square.id = i.toString();
        squares.push(square);
    }
}

function drawContainer(container, num) {
    let square = document.createElement("div");
    square.classList.add("square");
    switch(num) {
        case 0:
            square.style.backgroundColor = redColor;
            break;
        case 1:
            square.style.backgroundColor = blueColor;
            break;
        case 2:
            square.style.backgroundColor = greenColor;
            break;
        case 3:
            square.style.backgroundColor = yellowColor;
            break;
    }
    container.appendChild(square);
}

function drawContainers() {
    for (let i = 0; i < containers.length; i++) {
        for (let j = 0; j < 4; j++) {
            drawContainer(containers[i], i);
        }
    }
}

function setupPlayableIndices() {
    for (let i = 0; i < 10; i++) {
        playableIndices.push(i);
    }
    for(let i = 0; i < 121; i++) {
        if(i%11 === 10) {
            playableIndices.push(i);
        }
    }
    for (let i = 119; i > 110; i--) {
        playableIndices.push(i);
    }
    for(let i = 120; i > 0; i--) {
        if(i%11 === 0) {
            playableIndices.push(i);
        }
    }
}

function updateBoard() {
    for (let i = 0; i < playableIndices.length; i++) {
        if(i === redScore) {
            squares[playableIndices[i]].style.backgroundColor = redColor;
        } else if(i === blueScore) {
            squares[playableIndices[i]].style.backgroundColor = blueColor;
        } else if(i === greenScore) {
            squares[playableIndices[i]].style.backgroundColor = greenColor;
        } else if(i === yellowScore) {
            squares[playableIndices[i]].style.backgroundColor = yellowColor;
        } else {
            squares[playableIndices[i]].style.backgroundColor = greyColor;
        }
    }
}

function setupDice() {
    squares[60].onclick = () => {
        round();
    }

    squares[60].onmouseout = () => {
        squares[60].innerHTML = "";
    }
}

function startGame() {
    setupColors();
    drawContainers();
    drawBoard();
    setupPlayableIndices();
    updateBoard();
    setupDice();
    resetButton.addEventListener("click", restartGame);
}
startGame();

///////////////////////////  DICE  //////////////////////////////

function changeDice(num) {
    let dice = squares[60];
    dice.innerHTML = "";
    dice.innerText = num;
}

function rollDice() {
    prevDiceRoll = currDiceRoll;
    currDiceRoll = Math.round(Math.random() * 5 + 1);
}

///////////////////  ROUND /////////////

function updateScores() {
    if(count % 4 === 0) {
        redScore += currDiceRoll;
        if(redScore >= playableIndices.length) {
            redScore -= playableIndices.length;
        }
        checkFinish(redColor);
        if(redScore === blueScore) {
            blueScore = blueStart;
            bluePawnFirstRound = true;
        } else if(redScore === greenScore) {
            greenScore = greenStart;
            greenPawnFirstRound = true;
        } else if(redScore === yellowScore) {
            yellowScore = yellowStart;
            yellowPawnFirstRound = true;
        }
    } else if(count % 4 === 1) {
        yellowScore += currDiceRoll;
        if(yellowScore >= playableIndices.length) {
            yellowScore -= playableIndices.length;
        }
        checkFinish(yellowColor);
        if(yellowScore === blueScore) {
            blueScore = blueStart;
            bluePawnFirstRound = true;
        } else if(yellowScore === greenScore) {
            greenScore = greenStart;
            greenPawnFirstRound = true;
        } else if(yellowScore === redScore) {
            redScore = redStart;
            redPawnFirstRound = true;
        }
    } else if(count % 4 === 2) {
        blueScore += currDiceRoll;
        if(blueScore >= playableIndices.length) {
            blueScore -= playableIndices.length;
        }
        checkFinish(blueColor);
        if(blueScore === redScore) {
            redScore = redStart;
            redPawnFirstRound = true;
        } else if(blueScore === greenScore) {
            greenScore = greenStart;
            greenPawnFirstRound = true;
        } else if(blueScore === yellowScore) {
            yellowScore = yellowStart;
            yellowPawnFirstRound = true;
        }
    } else {
        greenScore += currDiceRoll;
        if(greenScore >= playableIndices.length) {
            greenScore -= playableIndices.length;
        }
        checkFinish(greenColor);
        if(greenScore === blueScore) {
            blueScore = blueStart;
            bluePawnFirstRound = true;
        } else if(greenScore === redScore) {
            redScore = redStart;
            redPawnFirstRound = true;
        } else if(greenScore === yellowScore) {
            yellowScore = yellowStart;
            yellowPawnFirstRound = true;
        }
    }
}

function checkFinish(color) {
    if (currDiceRoll === 6) {
        count--;
    }
    if (color === redColor) {
        if (redStart >= redScore - currDiceRoll) {
            if (redStart < redScore && !redPawnFirstRound) {
                let place = redScore - redStart - 1;
                if (redPlaces.includes(place)) {
                    redScore = redStart;
                    squares[redPlacesIndices[place]].style.backgroundColor = "black";
                    for (let i = 0; i < redPlaces.length; i++) {
                        if(redPlaces[i] === place) {
                            redPlaces.splice(i, 1);
                        }
                    }
                    updateContainers(redColor);
                    redPawnFirstRound = true;
                } else {
                    redScore = redScore - currDiceRoll;
                }
            } else {
                redPawnFirstRound = false;
            }
        }
    } else if (color === greenColor) {
        if (greenStart >= greenScore - currDiceRoll) {
            if (greenStart < greenScore && !greenPawnFirstRound) {
                let place = greenScore - greenStart - 1;
                if (greenPlaces.includes(place)) {
                    greenScore = greenStart;
                    squares[greenPlacesIndices[place]].style.backgroundColor = "black";
                    for (let i = 0; i < greenPlaces.length; i++) {
                        if(greenPlaces[i] === place) {
                            greenPlaces.splice(i, 1);
                        }
                    }
                    updateContainers(greenColor);
                    greenPawnFirstRound = true;
                } else {
                    greenScore -= currDiceRoll;
                }
            } else {
                greenPawnFirstRound = false;
            }
        }
    } else if (color === blueColor) {
        if (blueStart >= blueScore - currDiceRoll) {
            if (blueStart < blueScore && !bluePawnFirstRound) {
                let place = blueScore - blueStart - 1;
                if (bluePlaces.includes(place)) {
                    blueScore = blueStart;
                    squares[bluePlacesIndices[place]].style.backgroundColor = "black";
                    for (let i = 0; i < bluePlaces.length; i++) {
                        if(bluePlaces[i] === place) {
                            bluePlaces.splice(i, 1);
                        }
                    }
                    updateContainers(blueColor);
                    bluePawnFirstRound = true;
                } else {
                    blueScore -= currDiceRoll;
                }
            } else {
                bluePawnFirstRound = false;
            }
        }
    } else if (color === yellowColor) {
        if (yellowStart >= yellowScore - currDiceRoll) {
            if (yellowStart < yellowScore && !yellowPawnFirstRound) {
                let place = yellowScore - yellowStart - 1;
                if (yellowPlaces.includes(place)) {
                    yellowScore = yellowStart;
                    squares[yellowPlacesIndices[place]].style.backgroundColor = "black";
                    for (let i = 0; i < yellowPlaces.length; i++) {
                        if(yellowPlaces[i] === place) {
                            yellowPlaces.splice(i, 1);
                        }
                    }
                    updateContainers(yellowColor);
                    yellowPawnFirstRound = true;
                } else {
                    yellowScore -= currDiceRoll;
                }
            } else {
                yellowPawnFirstRound = false;
            }
        }
    }
}

function updateContainers(color) {
    if(color === redColor) {
        redContainer.innerHTML = "";
        for (let i = 0; i < redPlaces.length; i++) {
            drawContainer(redContainer, 0);
        }
    } else if(color === blueColor) {
        blueContainer.innerHTML = "";
        for (let i = 0; i < bluePlaces.length; i++) {
            drawContainer(blueContainer, 1);
        }
    } else if(color === greenColor) {
        greenContainer.innerHTML = "";
        for (let i = 0; i < greenPlaces.length; i++) {
            drawContainer(greenContainer, 2);
        }
    } else if(color === yellowColor) {
        yellowContainer.innerHTML = "";
        for (let i = 0; i < yellowPlaces.length; i++) {
            drawContainer(yellowContainer, 3);
        }
    }
}

function checkWinner() {
    if(redPlaces.length === 0) {
        alert("red wins!");
        return true;
    }
    if(yellowPlaces.length === 0) {
        alert("yellow wins!");
        return true;
    }
    if(bluePlaces.length === 0) {
        alert("blue wins!");
        return true;
    }
    if(greenPlaces.length === 0) {
        alert("green wins!");
        return true;
    }
    return false;
}

function round() {
    rollDice();
    changeDice(currDiceRoll);
    updateScores();
    updateBoard();
    count++;
    if(count > 3) {
        round1 = false;
    }
    if(checkWinner()) {
        restartGame();
    }
}

//////////////////////////  RESTART  /////////////////////////
function restartGame() {
    count = 0;
    squares = [];
    playableIndices = [];
    redScore = 5;
    blueScore = 25;
    greenScore = 35;
    yellowScore = 15;
    redPlaces = [0,1,2,3];
    bluePlaces = [0,1,2,3];
    greenPlaces = [0,1,2,3];
    yellowPlaces = [0,1,2,3];
    redPlacesIndices = [16,27,38,49];
    bluePlacesIndices = [104,93,82,71];
    greenPlacesIndices = [56,57,58,59];
    yellowPlacesIndices = [64,63,62,61];
    board.innerHTML = "";
    for (let i = 0; i < containers.length; i++) {
        containers[i].innerHTML = "";
    }
    startGame();
}

