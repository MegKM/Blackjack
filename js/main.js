/*----- constants -----*/
const suits = ['s', 'c', 'd', 'h'];
const ranks = ['02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K', 'A'];

const sounds = {
    'dealCard': 'assets/sounds/card-dealt.mp3',
    'shuffleDeck': 'assets/sounds/deck-shuffled.wav',
    'pokerChip': 'assets/sounds/poker-chip.wav',
    'allInChips': 'assets/sounds/all-in.wav',
    'success': 'assets/sounds/success.wav',
}

const music = {
    'upbeat': 'assets/sounds/upbeat.wav',
    'adventure': 'assets/sounds/adventure.wav',
    'calming': 'assets/sounds/calming.mp3',
}

const audioPlayer = new Audio();
const musicPlayer = new Audio();

/*----- state variables -----*/
let currentPot = 0;
let currentBank = 1000;
let cards = '';
let adventureMusic = true;
let calmingMusic = false;
let upbeatMusic = false;


const playersHand = [];
const dealersHand = [];
let playerHasBlackjack = false;
let dealerHasBlackjack = false;
let gameIsInPlay = true;
let firstGameShowInstructions = true;
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

const instructionElements = {
    startHand: document.getElementById('instruction-text-start'),
    playHand: document.getElementById('instruction-text-play'),
    newHand: document.getElementById('instruction-text-play-again'),
    howToPlay: document.getElementById('how-to-play'),
    howToPlayButton: document.getElementById('how-to-play-button'),
}

const audioElements = {
    playButton: document.getElementById('play-button'),
    pauseButton: document.getElementById('pause-button'),
    nextSongButton: document.getElementById('next-song-button')
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

instructionElements.howToPlayButton.addEventListener('click', toggleVisbility);

audioElements.playButton.addEventListener('click', playMusic);
audioElements.pauseButton.addEventListener('click', stopMusic);
audioElements.nextSongButton.addEventListener('click', nextSong);

/*----- functions -----*/
init()

//Gets the deck of cards, allows betting to happen, stops playAgain from being clickable.
function init(){
    cards = buildDeck();
    activateBettingEventListerners();
    buttonElements.playAgainButton.removeEventListener('click', playAgain);
}

//Build the deck and shuffles it into a random order.
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

//Moves money from bank to pot depending on chip value clicked.
function moveMoney(event){
    audioPlayer.pause();
    audioPlayer.src = sounds.pokerChip;
    audioPlayer.play();
    if(event.target === chipElements.chipValue05 && currentBank >= 5){
        moveMoneyToPot(5);
    }
    if(event.target === chipElements.chipValue10 && currentBank >= 10){
        moveMoneyToPot(10);
    }
    if(event.target === chipElements.chipValue25 && currentBank >= 25){
        moveMoneyToPot(25);
    }
    if(event.target === chipElements.chipValue50 && currentBank >= 50){
        moveMoneyToPot(50);
    }
    if(event.target === chipElements.chipValue100 && currentBank >= 100){
        moveMoneyToPot(100);
    }
}

//Displays results of moving money to pot on screen.
function moveMoneyToPot(amount){
    currentPot += amount;
    moneyElements.potElement.innerText = currentPot;
    currentBank -= amount;
    moneyElements.bankElement.innerText = currentBank;
}

//Move all money in pot back to bank when 'Clear bet' button is clicked.
function clearBet(){
    currentBank += currentPot;
    currentPot = 0;  
    moneyElements.potElement.innerText = currentPot;
    moneyElements.bankElement.innerText = currentBank;
}

//Move all money in bank to pot when 'All in' button is clicked.
function allIn(){
    audioPlayer.pause();
    audioPlayer.src = sounds.allInChips;
    audioPlayer.play();
    currentPot += currentBank;
    currentBank = 0;
    moneyElements.potElement.innerText = currentPot;
    moneyElements.bankElement.innerText = currentBank;
}

//Allowed the original setTimout calls to be replaced with a 'sleep' function.
async function sleep(milliseconds){
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

//Deal the first four cards, two each to player and dealer keeping the 2nd dealer card hidden.
async function dealCards(){
    const sleepAmount = 500;
    //If bet hasn't been placed, game cannot start.
    if(currentPot === 0){
        return;
    }
    //Prevent player from adding more money or trying to deal again once game has started.
    removeBettingEventListerners();
    //Hides first round instruction in left panal and shows in main game board.
    if(firstGameShowInstructions){
        instructionElements.startHand.setAttribute("style", "visibility: hidden");
        instructionElements.playHand.setAttribute("style", "visibility: visible");
    }
    //Deals cards to player and dealer, add them to new dedicated arrays and running totals.
    await sleep(sleepAmount);
    audioPlayer.pause();
    audioPlayer.src = sounds.dealCard;
    audioPlayer.play();    
    playersCards.first.setAttribute("class", `card large ${cards[totalCardsPlayed].face} card-shadow`);
    playersHand.push(cards[totalCardsPlayed].value);
    totalCardsPlayed += 1;

    await sleep(sleepAmount);
    audioPlayer.pause();
    audioPlayer.src = sounds.dealCard;
    audioPlayer.play();
    dealersCards.first.setAttribute("class", `card large ${cards[totalCardsPlayed].face} card-shadow`);
    dealersHand.push(cards[totalCardsPlayed].value);
    totalCardsPlayed += 1;
 
    await sleep(sleepAmount);
    audioPlayer.pause();
    audioPlayer.src = sounds.dealCard;
    audioPlayer.play();
    playersCards.second.setAttribute("class", `card large ${cards[totalCardsPlayed].face} card-shadow`);
    playersHand.push(cards[totalCardsPlayed].value);
    playersRunningTotal = checkIfBust(playersHand);    
    totalCardsPlayed += 1;

    await sleep(sleepAmount);
    //Hides the value of the dealers 2nd card while still adding the value to the dealer's array and running total.
    let cardSuit = cards[totalCardsPlayed].face.slice(0,1);
    if(cardSuit === 's' || cardSuit === 'c'){
        cardSuit = "back-blue";
    }else{
        cardSuit= "back-red";
    };

    audioPlayer.pause();
    audioPlayer.src = sounds.dealCard;
    audioPlayer.play();
    dealersCards.second.setAttribute("class", `card large ${cardSuit} card-shadow`);
    dealersHand.push(cards[totalCardsPlayed].value);
    dealersRunningTotal = checkIfBust(dealersHand);

    updatePlayersOnScreenScore();

    //Check if either player alone or player & dealer have blackjack, game ends accordingly. If not, continues with normal gameplay.
    dealerHasBlackjack = checkIfBlackjack(dealersHand);
    playerHasBlackjack = checkIfBlackjack(playersHand);

    await sleep(sleepAmount);
    if(playerHasBlackjack && dealerHasBlackjack || playerHasBlackjack && !dealerHasBlackjack){
        audioPlayer.pause();
        audioPlayer.src = sounds.dealCard;
        audioPlayer.play();
        dealersCards.second.setAttribute("class", `card large ${cards[totalCardsPlayed].face} card-shadow`);
        updateDealersOnScreenScore();
        if(firstGameShowInstructions){
            instructionElements.playHand.setAttribute("style", "visibility: hidden");
            instructionElements.newHand.setAttribute("style", "visibility: visible");
            }
        roundOver();
    }
    else{
        totalCardsPlayed += 1;
        activateGameplayEventListerners();
    }
        
}

//Can only be played on 3rd card. Doubles pot, updates ongoing totals then continues with normal gameplay.
function double(){
    if(playersHand.length < 3 && currentBank >= (currentPot * 2)){
        playersCards.third.setAttribute("class", `card large ${cards[totalCardsPlayed].face} card-shadow`);
        currentPot *= 2;
        moneyElements.potElement.innerText = currentPot;
        playersRunningTotal = addCard(playersHand);
        updatePlayersOnScreenScore();
        if(playersRunningTotal > 21){
            roundOver();
        }
        removeBettingEventListerners();
        removeGameplayEventListeners();
        dealerTakesCard();
    }
}

//When player presses 'Hit': checks for next available card slot, adds card.  Moves to dealers turn once all 5 slots are full.
function playerTakesCard(){
    if(playersHand.length < 3){
        playersCards.third.setAttribute("class", `card large ${cards[totalCardsPlayed].face} card-shadow`);
        playersRunningTotal = addCard(playersHand); 
        if(playersRunningTotal > 21){
            roundOver();
        }
        updatePlayersOnScreenScore();
    }
    else if(playersHand.length < 4){
        playersCards.fourth.setAttribute("class", `card large ${cards[totalCardsPlayed].face} card-shadow`);
        playersRunningTotal = addCard(playersHand); 
        if(playersRunningTotal > 21){
            roundOver();
        }
        updatePlayersOnScreenScore();
    }
    else if(playersHand.length < 5){
        playersCards.fifth.setAttribute("class", `card large ${cards[totalCardsPlayed].face} card-shadow`);
        playersRunningTotal = addCard(playersHand); 
        if(playersRunningTotal > 21){
            roundOver();
        }
        updatePlayersOnScreenScore();
    }
    else{
        buttonElements.hitButton.removeEventListener('click', playerTakesCard);
        dealerTakesCard();
    }
};

//Same as playerTakesCard above but set to timers.  Function exits when dealer hits 17, 21, total is higher than player or dealer busts. 
async function dealerTakesCard(){
    let sleepAmount = 500;
    await sleep(sleepAmount);
    audioPlayer.pause();
    audioPlayer.src = sounds.dealCard;
    audioPlayer.play();
    dealersCards.second.setAttribute("class", `card large ${cards[3].face} card-shadow`);
    updateDealersOnScreenScore();

    if(dealerHasBlackjack && dealersHand.length < 3){
        roundOver();
    }
    if(dealersRunningTotal > playersRunningTotal && dealersRunningTotal <= 21){
        roundOver();
    }
    else{
        await sleep(sleepAmount);
        if(dealersRunningTotal < dealerRestsAmount && dealersRunningTotal <= playersRunningTotal){
            dealersCards.third.setAttribute("class", `card large ${cards[totalCardsPlayed].face} card-shadow`);
            dealersRunningTotal = addCard(dealersHand);
            if(dealersRunningTotal > 21){
                roundOver();
            }
            updateDealersOnScreenScore();               

            await sleep(sleepAmount);
            if(dealersRunningTotal < dealerRestsAmount && dealersRunningTotal <= playersRunningTotal){
                dealersCards.fourth.setAttribute("class", `card large ${cards[totalCardsPlayed].face} card-shadow`);
                dealersRunningTotal = addCard(dealersHand);
                if(dealersRunningTotal > 21){
                    roundOver();
                }
                updateDealersOnScreenScore();

                await sleep(sleepAmount);
                if(dealersRunningTotal < dealerRestsAmount && dealersRunningTotal <= playersRunningTotal){
                    dealersCards.fifth.setAttribute("class", `card large ${cards[totalCardsPlayed].face} card-shadow`);
                    dealersRunningTotal = addCard(dealersHand);
                    if(dealersRunningTotal > 21){
                        roundOver();
                    }
                    updateDealersOnScreenScore();
                    roundOver();
                }else{
                    roundOver();
                }
            }else{
                roundOver();
            }
        }else{
            roundOver();
        }
    }   
}

//Takes array and sees if total is blackjack.
function checkIfBlackjack(array){
    const totalPoints = array.reduce((acc, num) => acc + num);
    if(array.length < 3 && totalPoints === 21){
        return true;
    }
    else{
        return false;
    }
};

//Updates the given array and running total, check if bust occured factoring in aces being 1 or 11.
function addCard(array){
    audioPlayer.pause();
    audioPlayer.src = sounds.dealCard;
    audioPlayer.play();
    array.push(cards[totalCardsPlayed].value);
    let runningTotal = array.reduce((acc, num) => acc + num);
    if(runningTotal > 21){
        runningTotal = checkIfBust(array);
    }    
    totalCardsPlayed += 1;
    return runningTotal;
}

//Loops through the given array and changes the first instance off 11 to 1 if required
function checkIfBust(array){
    let runningTotal = array.reduce((acc, num) => acc + num);
    array.forEach((card, index) => {
        if(card === 11){
            if(runningTotal > 21){
                array[index] = 1; 
                runningTotal -= 10; 
            }
        }
    });
    return runningTotal;
}

//Determins the winner of the hand, displays the results on screen, moves money accordinly
function roundOver(){
    if(gameIsInPlay === true){
        //Prevents gameplay buttons from being clicked after round is over.
        removeGameplayEventListeners();
        //Run through all possible outcomes not already covered.
        if(playerHasBlackjack && dealerHasBlackjack){
            countupCurrentBank(currentPot);
            countdownCurrentPot();
            displayElements.gameResult.innerText = "Both you and the dealer have Blackjack!";
        }
        else if(playerHasBlackjack && !dealerHasBlackjack){
            displayElements.playersResult.innerText = "You have blackjack!";
            displayElements.gameResult.innerHTML = `Dealer pays triple: ${currentPot * 3}`;
            playSuccessAudio();
            countupCurrentBank((currentPot*3));
            countdownCurrentPot();
        }
        else if(playersRunningTotal > 21){
            displayElements.playersResult.innerText = "You bust!";
            displayElements.gameResult.innerHTML = `You lost ${currentPot}.`;
            countdownCurrentPot();
            checkIfGameOver();
            gameIsInPlay = false; 
        }
        else if(dealersRunningTotal > 21){
            let winnings = currentPot * 2;
            displayElements.dealersResult.innerText = "Dealer bust.";
            displayElements.playersResult.innerText = "You win!";
            displayElements.gameResult.innerHTML = `You won ${winnings}!`;
            playSuccessAudio();
            countupCurrentBank(winnings);
            countdownCurrentPot();
            gameIsInPlay = false; 
        }
        else if(dealersRunningTotal === 21 && dealersHand.length < 3){
            displayElements.dealersResult.innerHTML = "Dealer has Blackjack!";
            displayElements.gameResult.innerHTML = `You lost ${currentPot}.`;
            countdownCurrentPot();
            checkIfGameOver();
            gameIsInPlay = false; 
        }    
        else if(playersRunningTotal > dealersRunningTotal){
            let winnings = currentPot * 2;
            displayElements.dealersResult.innerHTML = `Dealer rests on ${dealersRunningTotal}.`;
            displayElements.playersResult.innerText = "You win!";
            displayElements.gameResult.innerHTML = `You won ${winnings}.`;
            playSuccessAudio();
            countupCurrentBank(winnings);
            countdownCurrentPot();
            gameIsInPlay = false; 
        }
        else if(dealersRunningTotal > playersRunningTotal){
            displayElements.dealersResult.innerHTML = `Dealer rests on ${dealersRunningTotal}.`;
            displayElements.gameResult.innerHTML = `You lost ${currentPot}.`;
            countdownCurrentPot();
            checkIfGameOver();
            gameIsInPlay = false; 
        }
        else{
            displayElements.dealersResult.innerText = "It's a tie!";
            displayElements.gameResult.innerText = `Your bet of ${currentPot} was returned.`;
            countupCurrentBank(currentPot);
            countdownCurrentPot();
            gameIsInPlay = false; 
        }    
        if(firstGameShowInstructions){
            instructionElements.playHand.setAttribute("style", "visibility: hidden");
            instructionElements.newHand.setAttribute("style", "visibility: visible");
        }
        setTimeout(activatePlayAgainButton, 1000);
    }
}

//Checks is the player has run out of money, changes 'Play again' to 'Reset game'.  Refreshes the page.
function checkIfGameOver(){
    if(currentBank === 0){
        buttonElements.playAgainButton.removeEventListener("click", playAgain);
        buttonElements.playAgainButton.addEventListener("click", refreshPage);
        buttonElements.playAgainButton.innerText = "Click to restart game";

        function refreshPage(){
            location.reload();
        }
    }
}

//"Animation" when money moves from pot.   
function countdownCurrentPot(){
    let time = 1000 / (currentPot % 100);
    const intervalID = setInterval(timer, time);
    function timer(){
        if(currentPot > 0){
            if(currentPot > 300){
                currentPot -=10;
            }
            else{
                currentPot -= 1;
            }
            moneyElements.potElement.innerText = currentPot;
        }
        else{
            clearInterval(intervalID);
        }
    }
}

//"Animation" when money moves to bank.
function countupCurrentBank(winnings){
    let time = 1000 / (currentPot % 100);
    let newBankAmount = currentBank + winnings;
    const intervalID = setInterval(timer, time);
    function timer(){
        if(currentBank < newBankAmount){
            if(newBankAmount > 300){
                currentBank += 10;
            } else{
                currentBank += 1;
            }            
            moneyElements.bankElement.innerHTML = currentBank;
        }
        else{
            clearInterval(intervalID);
        }
    }
}

function playSuccessAudio(){
    audioPlayer.pause();
    audioPlayer.src = sounds.success;
    audioPlayer.volume *= 0.75
    audioPlayer.play();
}

//Ensure betting can't happen when round is already in play
function removeBettingEventListerners(){
    buttonElements.allInButton.removeEventListener('click', allIn);
    buttonElements.clearBetButton.removeEventListener('click', clearBet);
    buttonElements.dealButton.removeEventListener('click', dealCards);
    chipElements.chipValue05.removeEventListener('click', moveMoney);
    chipElements.chipValue10.removeEventListener('click', moveMoney);
    chipElements.chipValue25.removeEventListener('click', moveMoney);
    chipElements.chipValue50.removeEventListener('click', moveMoney);
    chipElements.chipValue100.removeEventListener('click', moveMoney);
};

//Ensure more cards can't be added once round is over.
function removeGameplayEventListeners(){
    buttonElements.hitButton.removeEventListener('click', playerTakesCard);
    buttonElements.doubleButton.removeEventListener('click', double);
    buttonElements.standButton.removeEventListener('click', playerStands);
}

//Moves gameplay from player to dealer.
function playerStands(){
    dealerTakesCard();
}

//Updates the running total for the player on screen.
function updatePlayersOnScreenScore(){
    displayElements.playersCardTotalDisplay.innerText = playersRunningTotal;
};

//Updates the running total for the dealer on screen.
function updateDealersOnScreenScore(){
    displayElements.dealersCardTotalDisplay.innerText = dealersRunningTotal;
}

//Shows the "how to play" instructions when button clicked.
function toggleVisbility(){
    instructionElements.howToPlay.classList.toggle("hide-how-to-play");
}

//When the play button is clicked music starts to play independantly to the sound effects audio
function playMusic(){
    musicPlayer.src = music.adventure;
    musicPlayer.volume = 0.5;
    musicPlayer.play();
    musicPlayer.loop = true;
}

//Pause button stops the music
function stopMusic(){
    musicPlayer.pause();
}

//Arrow botton changes the music to the next track
function nextSong(){
    musicPlayer.pause();
    if(adventureMusic){
        musicPlayer.src = music.calming;
        musicPlayer.volume = 1;
        musicPlayer.play();
        calmingMusic = true;
        adventureMusic = false;
    }
    else if (calmingMusic){
        musicPlayer.src = music.upbeat;
        musicPlayer.volume = 0.4;
        musicPlayer.play();
        calmingMusic = false;
        upbeatMusic = true;
    }
    else{
        musicPlayer.src = music.adventure;
        musicPlayer.volume = 0.5;
        musicPlayer.play();
        upbeatMusic = false;
        adventureMusic = true;
    }
}

//Resets applicable variables without resetting the bank balance when the 'Play again' button is clicked.
function playAgain(){
    audioPlayer.src = sounds.shuffleDeck;
    audioPlayer.play();
    playersHand.length = 0;
    dealersHand.length = 0;
    playerHasBlackjack = false;
    dealerHasBlackjack = false;
    gameIsInPlay = true;
    dealersRunningTotal = 0;
    playersRunningTotal = 0;
    totalCardsPlayed = 0;
    displayElements.dealersCardTotalDisplay.innerText = "0";
    displayElements.playersCardTotalDisplay.innerText = "0";
    displayElements.dealersResult.innerText = "";
    displayElements.playersResult.innerText = "";
    displayElements.gameResult.innerText = "";
    instructionElements.newHand.setAttribute("style", "visibility: hidden");
    firstGameShowInstructions = false;

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
