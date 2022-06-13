const tiles = document.querySelectorAll(".tile");   //slectiong every box of board
const PLAYER_X = "X";
const PLAYER_O = "O";
let turn = PLAYER_X;

const boardState  = Array(tiles.length);  //defining array of length equal to tile length
boardState.fill(null);  //initializing every element of array with NULL

//Elements
const strike = document.getElementById("strike");
const gameOverArea = document.getElementById("game-over-area");
const gameOverText = document.getElementById("game-over-text");
const playAgain = document.getElementById("play-again");
playAgain.addEventListener("click", startNewGame);

//Sounds
const gameOverSound = new Audio("sounds/game_over.wav");
const clickSound = new Audio("sounds/click.wav");

tiles.forEach((tile) => tile.addEventListener("click", tileClick));

function setHoverText() {
  //remove all hover text
  tiles.forEach((tile) => {
    tile.classList.remove("x-hover");  //removing previous hover effect
    tile.classList.remove("o-hover");  //removing previous hover effect
  });

  const hoverClass = `${turn.toLowerCase()}-hover`;  // this will store the current turn X or O for hovering effect

  tiles.forEach((tile) => {
    if (tile.innerText == "") {   //if the innertext of tile is empty then we will show hover effect
      tile.classList.add(hoverClass);
    }
  });
}

setHoverText();

function tileClick(event) {
  if (gameOverArea.classList.contains("visible")) {  //if game is ended we will return 
    return;
  }
  console.log(event);
  const tile = event.target;
  console.log(event.target);
  const tileNumber = tile.dataset.index;  //dataset.index will provide the value wich we have given in data-index of every box 
  //console.log(tileNumber);
  if (tile.innerText != "") {     //  checking whether the tile have X or O if it is present we will return 
    return;
  }

  if (turn === PLAYER_X) {
    tile.innerText = PLAYER_X;
    boardState[tileNumber - 1] = PLAYER_X;  //this will dtore at each tile whatr 
    turn = PLAYER_O;
  } else {
    tile.innerText = PLAYER_O;
    boardState[tileNumber - 1] = PLAYER_O;  //as the array start from 0 and our data-index start from 1 therefore we need subtract 1
    turn = PLAYER_X;
  }

  clickSound.play();
  setHoverText();
  checkWinner();
}

function checkWinner() {
  //Check for a winner
  for (const winningCombination of winningCombinations) {  //iterating 
    //Object Destructuring
    const { combo, strikeClass } = winningCombination;
    const tileValue1 = boardState[combo[0] - 1];   //tile numbering index start from 0 while while we have given index from 1 therefore nees=d to subtract 1
    const tileValue2 = boardState[combo[1] - 1];
    const tileValue3 = boardState[combo[2] - 1];

    if (tileValue1 != null && tileValue1 === tileValue2 && tileValue1 === tileValue3) {
      strike.classList.add(strikeClass);  
      gameOverScreen(tileValue1);
      return;
    }
  }

  //Check for a draw
  const allTileFilledIn = boardState.every((tile) => tile !== null);
  if (allTileFilledIn) {
    gameOverScreen(null);
  }
}

function gameOverScreen(winnerText) {
  let text = "Draw!";
  if (winnerText != null) {
    text = `Winner is ${winnerText}!`;
  }
  gameOverArea.className = "visible";
  gameOverText.innerText = text;
  gameOverSound.play();
}

function startNewGame() {
  strike.className = "strike";
  gameOverArea.className = "hidden";
  boardState.fill(null);
  tiles.forEach((tile) => (tile.innerText = ""));
  turn = PLAYER_X;
  setHoverText();
}

//winningCombinations is array of objects each object will tell us what is wiinig combination and its  strike 
const winningCombinations = [
  //rows
  { combo: [1, 2, 3], strikeClass: "strike-row-1" },
  { combo: [4, 5, 6], strikeClass: "strike-row-2" },
  { combo: [7, 8, 9], strikeClass: "strike-row-3" },
  //columns
  { combo: [1, 4, 7], strikeClass: "strike-column-1" },
  { combo: [2, 5, 8], strikeClass: "strike-column-2" },
  { combo: [3, 6, 9], strikeClass: "strike-column-3" },
  //diagonals
  { combo: [1, 5, 9], strikeClass: "strike-diagonal-1" },
  { combo: [3, 5, 7], strikeClass: "strike-diagonal-2" },
];
