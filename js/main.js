/*
    To do:
    - run out of money / game over
    - make prettier

    Could be refactored?:
    - Player/Dealer bust functions identical except variables
    - worth refactoring deal cards function?
*/

/*----- constants -----*/
const suits = ['s', 'c', 'd', 'h'];
const ranks = ['02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K', 'A'];
const dealCardAudio = new Audio('assets/sounds/card-dealt.mp3');
const shuffleDeckAudio = new Audio('assets/sounds/deck-shuffled.wav');

/*----- state variables -----*/
let currentPot = 0;
let currentBank = 1000;
let cards = '';

const playersHand = [];
const dealersHand = [];
let playerHasBlackjack = false;
let dealerHasBlackjack = false;
const dealerRestsAmount = 17;
let dealersRunningTotal = 0;
let playersRunningTotal = 0;
let totalCardsPlayed = 0;

/*----- cached elements  -----*/
const buttonElements = {
    dealButton: document.getElementById('deal-button'),
    allInButton: document.getElementById('all-in-button'),
    clearBetButton: document.getElementById('clear-bet-button'),
    hitButton: document.getElementById('hit-button'),
    doubleButton: document.getElementById('double-button'),
    standButton: document.getElementById('stand-button'),
    playAgainButton: document.getElementById('play-again-button'),
}

const chipElements = {
    chipValue05: document.getElementById('chip-value5'),
    chipValue10: document.getElementById('chip-value10'),
    chipValue25: document.getElementById('chip-value25'),
    chipValue50: document.getElementById('chip-value50'),
    chipValue100: document.getElementById('chip-value100'),
}

const moneyElements = {
    potElement: document.getElementById('current-pot'),
    bankElement: document.getElementById('current-bank'),
}

const dealersCards = {
    first: document.getElementById('dealer-card1'),
    second: document.getElementById('dealer-card2'),
    third: document.getElementById('dealer-card3'),
    fourth: document.getElementById('dealer-card4'),
    fifth: document.getElementById('dealer-card5'),
}

const playersCards = {
    first: document.getElementById('player-card1'),
    second: document.getElementById('player-card2'),
    third: document.getElementById('player-card3'),
    fourth: document.getElementById('player-card4'),
    fifth: document.getElementById('player-card5'),
}
 
const displayElements = {
    dealersCardTotalDisplay: document.getElementById('dealers-card-total-display'),
    playersCardTotalDisplay: document.getElementById('players-card-total-display'),
    dealersResult: document.getElementById('dealers-result'),
    playersResult: document.getElementById('players-result'),
    gameResult: document.getElementById('game-result'),
}

/*----- event listeners -----*/
function activateBettingEventListerners(){
    chipElements.chipValue05.addEventListener('click', moveMoney);
    chipElements.chipValue10.addEventListener('click', moveMoney);
    chipElements.chipValue25.addEventListener('click', moveMoney);
    chipElements.chipValue50.addEventListener('click', moveMoney);
    chipElements.chipValue100.addEventListener('click', moveMoney);

    buttonElements.clearBetButton.addEventListener('click', clearBet);
    buttonElements.allInButton.addEventListener('click', allIn);
    buttonElements.dealButton.addEventListener('click', dealCards);
}

function activateGameplayEventListerners(){
    buttonElements.hitButton.addEventListener('click', playerTakesCard);
    buttonElements.doubleButton.addEventListener('click', double);
    buttonElements.standButton.addEventListener('click', playerStands);
}

function activatePlayAgainButton(){
    buttonElements.playAgainButton.addEventListener('click', playAgain);
}

/*----- functions -----*/
init()

function init(){
    cards = buildDeck();
    console.log(cards);
    activateBettingEventListerners();
    buttonElements.playAgainButton.removeEventListener('click', playAgain);
}

function buildDeck () {
    const originalDeck = [];
    suits.forEach((suit) => {
        ranks.forEach((rank) => {
            originalDeck.push({
                face: suit + rank,
                value: Number(rank) || (rank === 'A' ? 11 : 10)
            });
        });
    }); 

    const shuffled = [...originalDeck];
    shuffled.sort(() => 0.5 - Math.random());
    return shuffled;
}

function moveMoney(event){
    //Move money from bank to pot depending on chip value
    if(event.target === chipElements.chipValue05){
        moveMoneyToPot(5);
    }
    if(event.target === chipElements.chipValue10){
        moveMoneyToPot(10);
    }
    if(event.target === chipElements.chipValue25){
        moveMoneyToPot(25);
    }
    if(event.target === chipElements.chipValue50){
        moveMoneyToPot(50);
    }
    if(event.target === chipElements.chipValue100){
        moveMoneyToPot(100);
    }
}

function moveMoneyToPot(amount){
    currentPot += amount;
    moneyElements.potElement.innerText = currentPot;
    currentBank -= amount;
    moneyElements.bankElement.innerText = currentBank;
}

function clearBet(){
    //Move all money in pot back to bank
    currentBank += currentPot;
    currentPot = 0;  
    moneyElements.potElement.innerText = currentPot;
    moneyElements.bankElement.innerText = currentBank;
}

function allIn(){
    //Move all money in bank to pot
    currentPot += currentBank;
    currentBank = 0;
    moneyElements.potElement.innerText = currentPot;
    moneyElements.bankElement.innerText = currentBank;
}

function dealCards(){
    //If bet hasn't been placed, return.
    if(currentPot === 0){
        return;
    }
    //Prevent player from adding more money or trying to deal again once game has started
    removeBettingEventListerners();
    activateGameplayEventListerners();

    // Get first 4 elements in cards array to display on screen, 2nd card for dealer is back only, build player/dealer's initial arrays and running totals
    setTimeout(() => {
        dealCardAudio.play();    
        playersCards.first.setAttribute("class", `card large ${cards[totalCardsPlayed].face}`);
        playersHand.push(cards[totalCardsPlayed].value);
        totalCardsPlayed += 1;
    }, 250);

    setTimeout(() => {
        dealCardAudio.play();
        dealersCards.first.setAttribute("class", `card large ${cards[totalCardsPlayed].face}`);
        dealersHand.push(cards[totalCardsPlayed].value);
        totalCardsPlayed += 1;
    }, 800);

    setTimeout(() => {
        dealCardAudio.play();
        playersCards.second.setAttribute("class", `card large ${cards[totalCardsPlayed].face}`);
        playersHand.push(cards[totalCardsPlayed].value);
        totalCardsPlayed += 1;
    }, 1350);

    setTimeout(() => {

        let cardSuit = cards[totalCardsPlayed].face.slice(0,1);
        if(cardSuit === 's' || cardSuit === 'c'){
            cardSuit = "back-blue";
        }else{
            cardSuit= "back-red";
        };

        dealCardAudio.play();
        dealersCards.second.setAttribute("class", `card large ${cardSuit}`);
        dealersHand.push(cards[totalCardsPlayed].value);
        dealersRunningTotal = dealersHand.reduce((acc, num) => acc + num);
        playersRunningTotal = playersHand.reduce((acc, num) => acc + num);
        updatePlayersOnscreenScore();

        //Check if either player or player & dealer have blackjack, game ends accordingly
        dealerHasBlackjack = checkIfBlackjack(dealersHand);
        playerHasBlackjack = checkIfBlackjack(playersHand);
        if (playerHasBlackjack && dealerHasBlackjack){
            setTimeout(() => {
                dealCardAudio.play();
                dealersCards.second.setAttribute("class", `card large ${cards[totalCardsPlayed].face}`)
                updateDealersOnscreenScore();
                countupCurrentBank(currentPot);
                countdownCurrentPot();
                displayElements.gameResult.innerText = "Blackjack!";
            }, 2000);
            activatePlayAgainButton();
        }
        if(playerHasBlackjack && !dealerHasBlackjack){
            setTimeout(() => {
                dealCardAudio.play();
                dealersCards.second.setAttribute("class", `card large ${cards[totalCardsPlayed].face}`)
                updateDealersOnscreenScore();
                displayElements.playersResult.innerText = "You have blackjack!";
                displayElements.gameResult.innerHTML = `Dealer pays triple: ${currentPot * 3}`;
                countupCurrentBank((currentPot*3));
                countdownCurrentPot();
        }, 1500);
            activatePlayAgainButton();
        }
        totalCardsPlayed += 1;
    }, 1900);
}

function playerTakesCard(){
    //If card slot is still available, display new card.
    if (playersCards.third.getAttribute("class") === "empty"){
        playersCards.third.setAttribute("class", `card large ${cards[totalCardsPlayed].face}`)
        //Update array and running total, check if player bust factoring in aces being 1 or 11
        addCardToPlayersHand();
    }
    else if (playersCards.fourth.getAttribute("class") === "empty"){
        playersCards.fourth.setAttribute("class", `card large ${cards[totalCardsPlayed].face}`)
        addCardToPlayersHand();
    }
    else if (playersCards.fifth.getAttribute("class") === "empty"){
        playersCards.fifth.setAttribute("class", `card large ${cards[totalCardsPlayed].face}`)
        addCardToPlayersHand();
    }
    else{
        buttonElements.hitButton.removeEventListener('click', playerTakesCard);
    }
}

function addCardToPlayersHand(){
    playersHand.push(cards[totalCardsPlayed].value);
    playersRunningTotal = playersHand.reduce((acc, num) => acc + num);
    dealCardAudio.play();
    if (playersRunningTotal > 21){
        checkIfPlayerBust();
    }    
    totalCardsPlayed += 1;
    updatePlayersOnscreenScore();
}

function dealerTakesCard(){
    //Same as playerTakesCard above but set to timers.  Function exits when dealer hits 17, 21, total is higher than player or dealer busts.
    setTimeout(() => {
        dealCardAudio.play();
        dealersCards.second.setAttribute("class", `card large ${cards[3].face}`);
        updateDealersOnscreenScore();
        if(dealerHasBlackjack || (dealersRunningTotal > playersRunningTotal)){
            roundOver();
        }
        else{
            setTimeout(() => {
                if(dealersRunningTotal < dealerRestsAmount && dealersRunningTotal <= playersRunningTotal){
                    dealersCards.third.setAttribute("class", `card large ${cards[totalCardsPlayed].face}`);
                    addCardToDealersHand();

                    setTimeout(() => {
                        if(dealersRunningTotal < dealerRestsAmount && dealersRunningTotal <= playersRunningTotal){
                            dealersCards.fourth.setAttribute("class", `card large ${cards[totalCardsPlayed].face}`);
                            addCardToDealersHand();

                            setTimeout(() => {
                                if(dealersRunningTotal < dealerRestsAmount && dealersRunningTotal <= playersRunningTotal){
                                    dealersCards.fifth.setAttribute("class", `card large ${cards[totalCardsPlayed].face}`);
                                    addCardToDealersHand();
                                    roundOver();
                                }else{roundOver();}
                            }, 550);

                        }else{roundOver();}
                    }, 550);

                }else{roundOver();}
            }, 550);
        }
    }, 550);


}

function addCardToDealersHand(){
    dealCardAudio.play();
    dealersHand.push(cards[totalCardsPlayed].value);
    dealersRunningTotal = dealersHand.reduce((acc, num) => acc + num);
    if (dealersRunningTotal > 21){
        checkIfDealerBust();
    }     
    totalCardsPlayed += 1;
    updateDealersOnscreenScore();
}

function checkIfBlackjack(array){
    //Takes array and sees if total is blackjack.
    const totalPoints = array.reduce((acc, num) => acc + num);
    if(totalPoints === 21){
        return true;
    }
    else{
        return false;
    }
}

function checkIfPlayerBust(){
    //If player has gone over 21, check if any of the cards are ace and change them to 1.
    playersHand.forEach((card, index) => {
        if(card === 11){
            playersHand[index] = 1;
            playersRunningTotal -= 10;
            updatePlayersOnscreenScore();
        }
    });
    if(playersRunningTotal > 21){
        roundOver();
    }
}

function checkIfDealerBust(){
    //As above.
    dealersHand.forEach((card, index) => {
        if(card === 11){
            dealersHand[index] = 1;
            dealersRunningTotal -= 10;
            updateDealersOnscreenScore();
        }
    });
    if(dealersRunningTotal > 21){
        roundOver();
    }
}

function roundOver(){
    //Prevent gameplay buttons from being clicked after round is over.
    removeGameplayEventListeners();
    //Run through all possible outcomes not already covered and display results on screen.
    if(playersRunningTotal > 21){
        displayElements.playersResult.innerText = "You bust!";
        displayElements.gameResult.innerText = "Dealer wins";
        countdownCurrentPot();
    }
    else if(dealersRunningTotal > 21){
        displayElements.dealersResult.innerText = "Dealer bust";
        displayElements.gameResult.innerText = "You win!";
        countupCurrentBank((currentPot*2));
        countdownCurrentPot();
    }
    else if(dealersRunningTotal === 21 && dealersCards.third.getAttribute("class") === "empty"){
        countdownCurrentPot();
        displayElements.dealersResult.innerHTML = "Dealer has Blackjack!";
        displayElements.gameResult.innerText = "Dealer wins.";
    }    
    else if(playersRunningTotal > dealersRunningTotal){
        countupCurrentBank((currentPot*2));
        countdownCurrentPot();
        displayElements.dealersResult.innerHTML = `Dealer rests on ${dealersRunningTotal}`;
        displayElements.playersResult.innerText = "You win!";
    }
    else if(dealersRunningTotal > playersRunningTotal){
        countdownCurrentPot();
        displayElements.playersResult.innerHTML = `You rested on ${playersRunningTotal}`;
        displayElements.dealersResult.innerHTML = `Dealer has ${dealersRunningTotal}`;
        displayElements.gameResult.innerText = "Dealer wins";
    }
    else{
        countupCurrentBank(currentPot);
        countdownCurrentPot();
        displayElements.gameResult.innerText = "It's a tie.";
    }    
    activatePlayAgainButton();
}

function countdownCurrentPot(){
    //"Animation" when money moves from pot.
    const intervalID = setInterval(timer, currentPot / 100)
    function timer(){
        if(currentPot > 0){
            currentPot -= 1;
            moneyElements.potElement.innerText = currentPot;
        }
        else{
            clearInterval(intervalID);
        }
    }
}

function countupCurrentBank(winnings){
    //"Animation" when money moves to bank.
    const intervalID = setInterval(timer, currentPot / 100)
    function timer(){
        if(winnings > 0){
            winnings -= 1;
            moneyElements.bankElement.innerHTML = `${currentBank += 1}`;
        }
        else{
            clearInterval(intervalID);
        }
    }
}

function removeBettingEventListerners(){
    //Ensure betting can't happen when round is already in play
    buttonElements.allInButton.removeEventListener('click', allIn);
    buttonElements.clearBetButton.removeEventListener('click', clearBet);
    buttonElements.dealButton.removeEventListener('click', dealCards);
    chipElements.chipValue05.removeEventListener('click', moveMoney);
    chipElements.chipValue10.removeEventListener('click', moveMoney);
    chipElements.chipValue25.removeEventListener('click', moveMoney);
    chipElements.chipValue50.removeEventListener('click', moveMoney);
    chipElements.chipValue100.removeEventListener('click', moveMoney);
}

function removeGameplayEventListeners(){
    //Ensure more cards can't be added once round is over
    buttonElements.hitButton.removeEventListener('click', playerTakesCard);
    buttonElements.doubleButton.removeEventListener('click', double);
    buttonElements.standButton.removeEventListener('click', playerStands);
}

function double(){
    //Can only be played on 3rd card. Doubles pot, updates ongoing totals then continues with normal gameplay.
    if (playersCards.third.getAttribute("class") === "empty"){
        playersCards.third.setAttribute("class", `card large ${cards[totalCardsPlayed].face}`)
        currentPot *= 2;
        moneyElements.potElement.innerText = currentPot;
        addCardToPlayersHand();
        updatePlayersOnscreenScore();
        removeBettingEventListerners();
        removeGameplayEventListeners();
        dealerTakesCard();
    }
}

function playerStands(){
    dealerTakesCard();
}

function updatePlayersOnscreenScore(){
    displayElements.playersCardTotalDisplay.innerText = playersRunningTotal;
};

function updateDealersOnscreenScore(){
    displayElements.dealersCardTotalDisplay.innerText = dealersRunningTotal;
}

function playAgain(){
    //Resets applicable variables without resetting the bank balance.
    shuffleDeckAudio.play();
    playersHand.length = 0;
    dealersHand.length = 0;
    playerHasBlackjack = false;
    dealerHasBlackjack = false;
    dealersRunningTotal = 0;
    playersRunningTotal = 0;
    totalCardsPlayed = 0;
    displayElements.dealersCardTotalDisplay.innerText = "";
    displayElements.playersCardTotalDisplay.innerText = "";
    displayElements.dealersResult.innerText = "";
    displayElements.playersResult.innerText = "";
    displayElements.gameResult.innerText = "";

    playersCards.first.setAttribute("class", "empty");
    playersCards.second.setAttribute("class", "empty");
    playersCards.third.setAttribute("class", "empty");
    playersCards.fourth.setAttribute("class", "empty");
    playersCards.fifth.setAttribute("class", "empty");

    dealersCards.first.setAttribute("class", "empty");
    dealersCards.second.setAttribute("class", "empty");
    dealersCards.third.setAttribute("class", "empty");
    dealersCards.fourth.setAttribute("class", "empty");
    dealersCards.fifth.setAttribute("class", "empty");

    init();
}
