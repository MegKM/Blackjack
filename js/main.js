/*Then you will receive two cards from the dealer. 
The dealer’s also dealt two cards, with one of them face-up so you can see what it is. 
In blackjack games, an ace can be worth 1 or 11, while number cards are worth their face value and face cards 
(jack, queen and king), are all worth 10.

If your first two cards add up to 21, i.e. you get an ace and a card worth 10, 
you’ll win the game, so long as the dealer doesn’t have a 21 also. 
If the dealer’s first hand is worth 21 and yours isn’t, you’ll lose.

There are several courses of action you can take if your hand doesn’t add up to 21:

–           Hit. You receive an additional card.

–           Stand. You receive no more cards and keep your hand as it is.

–           Double. Double you bet, take one more card and stand

If your hand ever goes over 21 – you have bust and have lost that hand. 
If the dealer busts and you don’t, you win. Once you’ve acted, it’s the dealer’s turn. 
The dealer can’t decide what to do; instead, the dealer has to stick to rules depending on 
what the value of their hand is. In most games, the dealer has to hit on a soft 17, in others 
the dealer has to stand on this hand.

A soft hand is any line-up of cards containing an ace. 
If you have a soft hand, you can draw an additional card without going bust. 
This is because you can have the ace count as 1 instead of 11. 
A hard hand is any hand that doesn’t contain  ace, or a hand with ace that has to be counted as 1. 
Otherwise you’d go bust. For example, a hand containing a 6, and 8 and an ace is hard: if the ace is 11, 
your total would be 25 and you’d be out; the ace, therefore, has to count as 1, bringing your total to 15. */

/*----- constants -----*/
const suits = ['s', 'c', 'd', 'h'];
const ranks = ['02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K', 'A'];

/*----- state variables -----*/
let currentPot = 0;

/*----- cached elements  -----*/
const buttonElements = {
    betButton: document.getElementById('bet-button'),
    allInButton: document.getElementById('all-in-button'),
    clearBetButton: document.getElementById('clear-bet-button'),
    hitButton: document.getElementById('hit-button'),
    doubleButton: document.getElementById('double-button'),
    standButton: document.getElementById('stand-button'),
}

const chipElements = {
    chipValue05: document.getElementById('chip-value5'),
    chipValue10: document.getElementById('chip-value10'),
    chipValue25: document.getElementById('chip-value25'),
    chipValue50: document.getElementById('chip-value50'),
    chipValue100: document.getElementById('chip-value100'),
}

const potElement = document.getElementById('current-pot');

/*----- event listeners -----*/
document.querySelector('body').addEventListener('click', function (event){
    console.log(event.target);
})

chipElements.chipValue05.addEventListener('click', addMoneyToPot);
chipElements.chipValue10.addEventListener('click', addMoneyToPot);
chipElements.chipValue25.addEventListener('click', addMoneyToPot);
chipElements.chipValue50.addEventListener('click', addMoneyToPot);
chipElements.chipValue100.addEventListener('click', addMoneyToPot);

buttonElements.clearBetButton.addEventListener('click', clearBet);

/*----- functions -----*/
function buildOriginalDeck () {
    const deck = [];
    suits.forEach((suit) => {
        ranks.forEach((rank) => {
            deck.push({
                face: suit + rank,
                value: Number(rank) || (rank === 'A' ? 11 : 10)
            });
        });
    });
    return deck;
}

function shuffleDeck () {
    const shuffled = [...originalDeck]; // make a copy
    shuffled.sort(() => 0.5 - Math.random()); // randomly return negative or positive number
    return shuffled;
}

function addMoneyToPot(event){
    // console.log(currentPot);
    if(event.target === chipElements.chipValue05){
        currentPot += 5;
        console.log(currentPot);
        potElement.innerText = currentPot
    }
    if(event.target === chipElements.chipValue10){
        currentPot += 10
        potElement.innerText = currentPot
    }
    if(event.target === chipElements.chipValue25){
        currentPot += 25
        potElement.innerText = currentPot
    }
    if(event.target === chipElements.chipValue50){
        currentPot += 50
        potElement.innerText = currentPot
    }
    if(event.target === chipElements.chipValue100){
        currentPot += 100
        potElement.innerText = currentPot
    }
}

function clearBet(){
    currentPot = 0;
    potElement.innerText = 0;
}