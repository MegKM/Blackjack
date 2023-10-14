
/*----- constants -----*/
const suits = ['s', 'c', 'd', 'h'];
const ranks = ['02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K', 'A'];

/*----- state variables -----*/
let currentPot = 0;
let currentBank = 1000;
let cards = '';

// might need to add to function to call on init

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
    if(event.target === chipElements.chipValue05){
        moveMoneyToPot(5);
        deductMoneyFromBank(5);
    }
    if(event.target === chipElements.chipValue10){
        moveMoneyToPot(10);
        deductMoneyFromBank(10);
    }
    if(event.target === chipElements.chipValue25){
        moveMoneyToPot(25);
        deductMoneyFromBank(25);
    }
    if(event.target === chipElements.chipValue50){
        moveMoneyToPot(50);
        deductMoneyFromBank(50);
    }
    if(event.target === chipElements.chipValue100){
        moveMoneyToPot(100);
        deductMoneyFromBank(100);
    }
}

// could possibly combine these two functions
function moveMoneyToPot(amount){
    currentPot += amount;
    moneyElements.potElement.innerText = currentPot;
}

function deductMoneyFromBank(amount){
    currentBank -= amount;
    moneyElements.bankElement.innerText = currentBank;
}

function clearBet(){
    currentBank += currentPot;
    currentPot = 0;  
    moneyElements.potElement.innerText = currentPot;
    moneyElements.bankElement.innerText = currentBank;
}

function allIn(){
    currentPot += currentBank;
    currentBank = 0;
    moneyElements.potElement.innerText = currentPot;
    moneyElements.bankElement.innerText = currentBank;
}

function dealCards(){
    if(currentPot === 0){
        return;
    }

    removeBettingEventListerners();
    activateGameplayEventListerners();

    setTimeout(() => {    
        playersCards.first.setAttribute("class", `card large ${cards[totalCardsPlayed].face}`);
        playersHand.push(cards[totalCardsPlayed].value);
        totalCardsPlayed += 1;
    }, 250);

    setTimeout(() => {
        dealersCards.first.setAttribute("class", `card large ${cards[totalCardsPlayed].face}`);
        dealersHand.push(cards[totalCardsPlayed].value);
        totalCardsPlayed += 1;
    }, 500);

    setTimeout(() => {
        playersCards.second.setAttribute("class", `card large ${cards[totalCardsPlayed].face}`);
        playersHand.push(cards[totalCardsPlayed].value);
        totalCardsPlayed += 1;
    }, 750);


    let cardSuit = cards[totalCardsPlayed].face.slice(0,1);
    if(cardSuit === 's' || cardSuit === 'c'){
        cardSuit = "back-blue"
    }else{
        cardSuit= "back-red"
    }

    setTimeout(() => {
        dealersCards.second.setAttribute("class", `card large ${cardSuit}`);
        dealersHand.push(cards[totalCardsPlayed].value);
        totalCardsPlayed += 1;
    }, 1000);

    dealersRunningTotal = dealersHand.reduce((acc, num) => acc + num);
    playersRunningTotal = playersHand.reduce((acc, num) => acc + num);
    updatePlayersOnscreenScore();
    dealerHasBlackjack = checkIfBlackjack(dealersHand);
    playerHasBlackjack = checkIfBlackjack(playersHand);
    if (playerHasBlackjack && dealerHasBlackjack){
        roundOver();
    }
    if(playerHasBlackjack){
        displayElements.playersResult.innerText = "You have blackjack!";
        dealerTakesCard();
    };
}

function playerTakesCard(){
    if (playersCards.third.getAttribute("class") === "empty"){
        playersCards.third.setAttribute("class", `card large ${cards[totalCardsPlayed].face}`)
        playersRunningTotal += cards[totalCardsPlayed].value;
        updatePlayersOnscreenScore();
        totalCardsPlayed += 1 
        if(checkIfPlayerBust()) {roundOver()};
    }
    else if (playersCards.fourth.getAttribute("class") === "empty"){
        playersCards.fourth.setAttribute("class", `card large ${cards[totalCardsPlayed].face}`)
        playersRunningTotal += cards[totalCardsPlayed].value;
        updatePlayersOnscreenScore();
        totalCardsPlayed += 1 
        if(checkIfPlayerBust()) {roundOver()};
    }
    else if (playersCards.fifth.getAttribute("class") === "empty"){
        playersCards.fifth.setAttribute("class", `card large ${cards[totalCardsPlayed].face}`)
        playersRunningTotal += cards[totalCardsPlayed].value;
        updatePlayersOnscreenScore();
        totalCardsPlayed += 1 
        if(checkIfPlayerBust()) {roundOver()};
    }
    else{
        buttonElements.hitButton.removeEventListener('click', playerTakesCard);
    }
}

function dealerTakesCard(){
    dealersCards.second.setAttribute("class", `card large ${cards[3].face}`)
    updateDealersOnscreenScore();
    console.log(dealersHand)
    if(dealerHasBlackjack){
        roundOver();
    }

    if(dealersRunningTotal < dealerRestsAmount){
        dealersCards.third.setAttribute("class", `card large ${cards[totalCardsPlayed].face}`);
        dealersRunningTotal += cards[totalCardsPlayed].value;
        updateDealersOnscreenScore();
        totalCardsPlayed += 1;
        if(dealersRunningTotal < dealerRestsAmount){
            dealersCards.fourth.setAttribute("class", `card large ${cards[totalCardsPlayed].face}`)
            dealersRunningTotal += cards[totalCardsPlayed].value;
            updateDealersOnscreenScore();
            totalCardsPlayed += 1
            if(dealersRunningTotal < dealerRestsAmount){
                dealersCards.fifth.setAttribute("class", `card large ${cards[totalCardsPlayed].face}`)
                dealersRunningTotal += cards[totalCardsPlayed].value;
                updateDealersOnscreenScore();
                roundOver();
            }
            else{
                roundOver();
            }
        }
        else{
            roundOver();
        }
    }
    else{
        roundOver();
    }

}

function checkIfBlackjack(array){
    const totalPoints = array.reduce((acc, num) => acc + num);
    if(totalPoints === 21){
        return true;
    }
    else{
        return false;
    }
}

function checkIfPlayerBust(){
    if(playersRunningTotal > 21){
        currentPot = 0;
        return true;
    }
}

function roundOver(){
    removeGameplayEventListeners();
    console.log("player: ", playersRunningTotal);
    console.log("dealer: ", dealersRunningTotal);

    if(playersRunningTotal > 21){
        displayElements.playersResult.innerText = "You bust!";
        displayElements.gameResult.innerText = "Dealer wins.";
    }
    else if(dealersRunningTotal > 21){
        displayElements.dealersResult.innerText = "Dealer bust";
        displayElements.gameResult.innerText = "You win!";
        currentBank += currentPot * 2;
        currentPot = 0;
        moneyElements.potElement.innerText = currentPot;
        moneyElements.bankElement.innerText = currentBank;
    }    
    else if(playersRunningTotal > dealersRunningTotal){
        currentBank += currentPot * 2;
        currentPot = 0;
        displayElements.dealersResult.innerHTML = `Dealer rests on ${dealersRunningTotal}`;
        displayElements.playersResult.innerText = "You win!";
        moneyElements.potElement.innerText = currentPot;
        moneyElements.bankElement.innerText = currentBank;
    }
    else if(dealersRunningTotal > playersRunningTotal){
        currentPot = 0;
        displayElements.playersResult.innerHTML = `You rested on ${playersRunningTotal}`;
        displayElements.dealersResult.innerHTML = `Dealer has ${dealersRunningTotal}`;
        displayElements.gameResult.innerText = "Dealer wins.";
        moneyElements.potElement.innerText = currentPot;
    }
    else{
        currentBank += currentPot;
        currentPot = 0;
        displayElements.gameResult.innerText = "It's a tie.";
        moneyElements.potElement.innerText = currentPot;
        moneyElements.bankElement.innerText = currentBank;
    }    
    console.log("round over");
    activatePlayAgainButton();

}

function removeBettingEventListerners(){
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
    buttonElements.hitButton.removeEventListener('click', playerTakesCard);
    buttonElements.doubleButton.removeEventListener('click', double);
    buttonElements.standButton.removeEventListener('click', playerStands);
}

function double(){
    if (playersCards.third.getAttribute("class") === "empty"){
        playersCards.third.setAttribute("class", `card large ${cards[4].face}`)
        totalCardsPlayed += 1 
        if(checkIfPlayerBust()) {roundOver()};
        currentPot *= 2;
        moneyElements.potElement.innerText = currentPot;
        removeBettingEventListerners();
        removeGameplayEventListeners();
    }
    playersRunningTotal += cards[4].value;
    dealerTakesCard();
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
