const cards = document.querySelectorAll(".card"),   // select all elements that matches a class card 
timeTag = document.querySelector(".time b"),        // select the class whose name is time Tag
flipsTag = document.querySelector(".flips b"),      //select the class whose names is flipsTag
refreshBtn = document.querySelector(".details button"),   // select element whose class whose name is refresBtn
won = document.querySelector(".won");

let maxTime = 30;                                   // Total time of game
let timeLeft = maxTime;                             // this is the main timer which will be showm in timer part
let flips = 0;                                      // Total number of Flip made by  Player
let matchedCard = 0;                                // No of Mathed Card
let disableDeck = false;                            // displaydeck  if it is true we cannot flip any other card its value will become true when we have already selected two cards 
let isPlaying = false;                              // is playing will ensure that setInterval function is called one time only 
let cardOne, cardTwo, timer;                        //cardone and cardtwo will store all the properties of clicked cards as  an object
                                                    //timer will store SetInterval id and whenever game complete we can use this id to clear setinterval function  

function initTimer() {
    if(timeLeft <= 0) {
        won.innerHTML = `You Lose!`;
        return clearInterval(timer);
    }
    timeLeft--;
    timeTag.innerText = timeLeft;
}

function flipCard({target: clickedCard}) { 

   // console.log(clickedCard);
    if(!isPlaying) {
        isPlaying = true;            
        timer = setInterval(initTimer, 1000);
    }

    if(clickedCard !== cardOne && !disableDeck && timeLeft > 0) {
        flips++;
        flipsTag.innerText = flips;  
        clickedCard.classList.add("flip");
        if(!cardOne) {             //if cardone is empty then we will store clickedcard value to cardOne 
            return cardOne = clickedCard;
        }
        cardTwo = clickedCard;     
        disableDeck = true;        // now as card1 and card2 are not empty we will disableDeck=true so that no new card flip or change the value of card1 and card2
        let cardOneImg = cardOne.querySelector(".back-view img").src,   // storing name of card1 and card2 for comparing
        cardTwoImg = cardTwo.querySelector(".back-view img").src;
        matchCards(cardOneImg, cardTwoImg);
    }
}


function matchCards(img1, img2) {
    if(img1 === img2) {
        matchedCard++;
        if(matchedCard == 6 && timeLeft > 0) {
            won.innerHTML = `Hurray You Won!`;
            return clearInterval(timer);
        }
        cardOne.removeEventListener("click", flipCard);  //removing all evenlitener from both card so that if we agian click on card score doesn't increase of already matched card
        cardTwo.removeEventListener("click", flipCard);
        cardOne = cardTwo = "";
        return disableDeck = false;
    }
    // if card doesnt match they will shake 
    setTimeout(() => {
        cardOne.classList.add("shake");
        cardTwo.classList.add("shake");
    }, 100);

    //after shaking removing property of  shake and flip 
    setTimeout(() => {
        cardOne.classList.remove("shake", "flip");
        cardTwo.classList.remove("shake", "flip");
        cardOne = cardTwo = "";
        disableDeck = false;
    }, 400);
}

function shuffleCard() {
    timeLeft = maxTime;
    flips = matchedCard = 0;
    cardOne = cardTwo = "";
    clearInterval(timer);
    timeTag.innerText = timeLeft;
    flipsTag.innerText = flips;
    disableDeck = isPlaying = false;
    won.innerHTML = ``;
    let arr = [1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6];
    arr.sort(() => Math.random() > 0.5 ? 1 : -1);          // this is a method to sort the array in random order 
    cards.forEach((card, index) => {
        card.classList.remove("flip");                       // it will flip all card to front view
        let imgTag = card.querySelector(".back-view img");   
            imgTag.src = `images/img-${arr[index]}.png`;      //changing name of image so that it will randomize
        card.addEventListener("click", flipCard);             // initailizing onclick event of every card
    }); 
   
}

shuffleCard();

refreshBtn.addEventListener("click", shuffleCard);
