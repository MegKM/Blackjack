# Blackjack Game

## Overview

This is a version of the card game Blackjack created using HTML, CSS and JavaScript.  The game can be found [here](https://megkm.github.io/Blackjack/).

The objective of the game is to get as close as possible to 21 without going over as well as having a higher card score than the dealer.

### The rules
The standard rules of Blackjack can be found on [this site](https://bicyclecards.com/how-to-play/blackjack).  
The below rules are specific to gameplay for this game (a simplified version can be found at the bottom of the gameplay screen, as well has on screen prompts for the player that disappear after the first round).  

* Only the betting buttons (the chip images, _All in_ and _Clear bet_) on the left panel can be used initially.  Once a bet of the player's choosing has been placed the _Deal_ button becomes clickable.
* When the player hits _Deal_ several things happen:
    * All buttons on the left hand panel become inactive.
    * The buttons under the main game area become active.
    * The player, followed by the dealer, are dealt two cards each, in sequence.  All are face up except the dealer's second card which remains face down.
* The player then has three options:
    * **Hit** - to be dealt another card (up to a hand of 5).
    * **Double** - player doubles their bet, receives 1 more card then stands.
    * **Stand** - player passes the play to the dealer without taking any more cards.
* Once the player has made their selection it is the dealer's turn.
* The dealer's hidden card is revealed and the dealer will then draw more cards, if required, with the aim of getting at least 17 before resting.
    * An exception here (and a variation from standard Blackjack gameplay) is that the dealer will rest early if it has already eclipsed the player's total score.
* The results of the game are displayed on the right hand panel and the money moves between the bank and the pot accordingly.
* Once play is complete the _Play again_ becomes active and the game resets whilst maintaining the amount in the bank.
* If the player runs out of money, the _Play again_ button becomes _Click to restart game_ which reloads the page once clicked.

#### Blackjack
The following outcomes apply when the dealer, player or both get dealt Blackjack (their hand is two cards the add up to 21).
* The dealer gets Blackjack and the player does not:
    * Play proceeds as normal, with Blackjack being recealed at the end.
* The player gets Blackjack and the dealer does not:
    * Play ends and the player receives 3 X their bet.
* Both the dealer and the player get Blackjack:
    * Play ends and the player gets their money back.

## Gameplay Layout
![Image of initial game view](gameplay-screenshots/initial-view.png)

![Image of round complete view](gameplay-screenshots/round-complete.png)

![Image of 'how to play' screen](gameplay-screenshots/how-to-play-screen.png)

![Image of game with cards dealt](gameplay-screenshots/Gameplay-layout.png)

## Technologies Used
* JavaScript
* CSS
* HTML
* CardStarter CSS Library

## Known bugs
<img style="float: right;" src="gameplay-screenshots/works-on-my-machine.png">
It is currently only possible to be dealt 5 cards each for both the dealer and the player.  It's unlikely, but possible, that you could reach 5 cards without going bust and want to be dealt another.  This is prevented by the main gameplay buttons going inactive (and for the dealer it just jumps ahead to the winner calculation code block).

"Uncaught (in promise) DOMException error" is occasion triggered by audio files playing on top of each other.



## Next Steps
* There is no 'split' function.  In traditional Blackjack, if the player is dealt two of the same value card they have the option to 'split' the cards and play each as a separate hand.
* Add the possibility of drawing more than 5 cards for both the dealer and the player.
* Add media queries so the game scales well on smaller screens.





