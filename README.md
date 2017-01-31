# Game Of War #

A javascript-based take on the [card game War](https://en.wikipedia.org/wiki/War_(card_game)).
Implemented as a library to be used in other applications.  Sample applications are
included, a console-based node application, and a web version in the site branch.

(TODO: document site branch)

## Quickly running the node version ##

### Prereqs ###
* Node 6+
* babel-cli (npm install -g babel-cli);

~~~
npm run build && npm run app
~~~

## The longer version ##

A [Vagrantfile](http://vagrantup.com) is provided so that the code can be built and tested in
a consistent environment (Ubuntu 14.04).  Install Vagrant and Virtualbox, then simply run 'vagrant up'
in the vm/ directory.

~~~
cd vm/
vagrant up
vagrant ssh
cd /code
npm install

npm run build && npm run app
~~~

## Development ##

A gulpfile is provided that will handle watch for file changes and handle transpiling,
concatenation, and unit testing.  

## API ##

### Basic Usage ###

~~~js
deck = new Deck(4, 13);
deck.shuffle();
game = new WarGame(deck, 4);

let gameOutcome;
do {
  gameOutcome = game.playRound();
} while (!gameOutcome.gameOver)
~~~

_Note: The algorithm for giving cards back to the winner has a tendency to create games
that go on forever -- it's worthwhile to add a check to kill the game after a few thousand
rounds, like below:_

~~~js
deck = new Deck(4, 13);
deck.shuffle();
game = new WarGame(deck, 4);

let gameOutcome;
let roundCount = 0;
do {
  gameOutcome = game.playRound();
  if (++roundCount > 5000) { break; }
} while (!gameOutcome.gameOver)

printResult(gameOutcome);

if (roundCount === 5001) {
  console.log('The players got bored and moved on to something else');
} else {
  console.log(`Winner: ${gameOutcome.winner.name} with ${gameOutcome.winner.score} cards`);
}
~~~

### WarGame ###

#### Rules ####

1. Game ends when a player has amassed all cards.

2. When two (or more) players go to war, each player draws 2 cards, the latter of
which is used to resolve (or continue) the war.  If a player runs out of cards during
a war (by drawing their last card as the first card of the war), they lose, as the
winner is determined by the maximum card rank of the longest draw of the round.

3. At the end of a round, the winner collects the cards and places them on the bottom
of his/her discard pile _in the order they were revealed by each player, starting with the
first_.  E.g. In 4-player game where Player 1 goes to war with Player 4 and wins, the
cards would be added to the _bottom_ of Player 1's deck in the following order:

~~~
1. Player 1 Card 1
2. Player 1 Card 2
3. Player 1 Card 3 <-- the winning card
4. Player 2 Card 1
5. Player 3 Card 1
6. Player 4 Card 1
7. Player 4 Card 2
8. Player 4 Card 3
~~~

_Tweaking this rule can have drastic effects on the round count of games.  As currently
implemented, 70%+ games go longer than 5000 rounds (unless there's a bug)_

#### Constructor ####

~~~c#
const game = new WarGame(Deck deck, int numPlayers);
~~~

#### Properties ####

##### WarGame.deck #####

The current deck.  This will contain any cards that couldn't be dealt in the beginning
of the game without having players start with different numbers of cards.

~~~c#
Deck deck = game.deck
~~~

#### Methods ####

##### WarGame.getPlayer() #####

Gets the 1-indexed player in the game. (Which is to say that the first player is
'Player 1', not 'Player 0')

~~~c#
Player player1 = game.getPlayer(1);
~~~

##### WarGame.playRound() #####

Advances the game by a single round, including resolving any wars.

~~~c#
RoundResult result = game.playRound();
~~~

### EndlessWarGame ###

#### Rule Difference ####

The key difference is that the game never ends.  At the end of the round, all cards
are placed in a global discard pile.  When a player runs out of cards, the discard pile
is added to the deck, shuffled, and the cards _are distributed evenly between all
players in the game_.

The api for EndlessWarGame includes everything from WarGame (in an OO language we'd
have them implement the same interface).  It also exposes a property for the discard
pile.


#### Sample ####

~~~js

const deck = new Deck(4, 13);
deck.shuffle();
const game = new EndlessWarGame(deck, 2);
const outcomes = [];

for (let i = 0; i < 1000000; ++i) {
  outcomes.push(game.playRound());
}

console.log(`Wars: ${outcomes.filter(o => o.war).length}`);
console.log(`Player 1 Wins: ${outcomes.filter(o => o.winner && o.winner.name === 'Player 1').length}`);
console.log(`Player 2 Wins: ${outcomes.filter(o => o.winner && o.winner.name === 'Player 2').length}`);

~~~

#### Properties ####

##### EndlessWarGame.discardPile #####

~~~js
Deck discardPile = game.discardPile
~~~

## Support Classes ##

### Round Result ###

Summarizes the round.

#### Properties ####

##### draws #####

~~~js
[int][Card] draws;
~~~

A two-dimensional array containing the cards played by each player in the round,
with the most recent card being at the highest index.

~~~js
draws = [
  [card, card, card], // Player 1's Cards
  [card],             // Player 2's Cards
  [card],             // Player 3's Cards
  [card, card, card]  // Player 4's Cards
]
~~~

##### war #####

~~~js
bool war
~~~

True if a war occurred during the round, false otherwise.

##### winner #####

~~~js
Player winner
~~~

The Player object corresponding to the winner of the round.  Can be null if players
run out of cards in a war at the same time.

##### gameOver #####

~~~js
bool gameOver
~~~

In standard war, this means that one player has amassed all the cards and won the
game.  Not used in EndlessWarGame.

### Player ###

Represents a player and their current stack.

#### Constructor ####

~~~js
const player = new Player(playerName)
~~~

#### Properties ####

##### cardCount #####

~~~cs
int cardCount
~~~

The current size of the player's stack.

##### score #####

Same as cardCount.

##### name #####

~~~cs
string name
~~~

The player's name.

#### Methods ####

##### addCard() #####

Places a Card on the _top_ of the player's stack.

~~~js
/// 2-2, 3-3
let card = new Card(1, 1);
player.addCard(card);
// 2-2, 3-3, 1-1
~~~

##### awardCard() #####

Places a Card on the _bottom_ of the player's stack.

~~~js
// 2-2 3-3
let card = new Card(1, 1);
player.addCard(card);
// 1-1 2-2 3-3
~~~

##### revealCard() #####

Removes a card from the _top_ of the player's stack.

~~~js
// 2-2 3-3
let card = player.revealCard();
// card = 3-3
// stack = 2-2
~~~

### Deck ###

Represents a deck of Cards.

#### Constructor ####

~~~js
const deck = new Deck(numberOfSuits, numberOfRanks)
~~~

#### Properties ####

##### numSuits #####

The number of unique suits in the deck.  The suits are strictly increasing between
1 and numSuits.  Naming the suits (e.g. Clubs, Hearts, etc..) is left to the consumer.

~~~js
int suits = deck.numSuits;
~~~

##### numRanks #####

The number of ranked cards per suit.  The ranks are strictly increasing between 1
and numRanks, inclusive.

~~~js
int ranks = deck.numRanks;
~~~

##### currentSize #####

The number of cards on the deck at this moment.

~~~js
int cSize = deck.currentSize
~~~

##### initialSize #####

The initial size of the deck (number of cards at deck creation).

~~~js
int iSize = deck.initialSize
~~~

#### Methods ####

##### deal() #####

Removes a card from the top of the deck.

~~~js
Card card = deck.deal();
~~~

##### add(Card card) #####

Adds the card to the _top_ of the deck.

~~~js
const card = new Card(2,2).;
deck.add(card);
~~~

##### shuffle() #####

Randomly re-arranges the order of the cards that are currently in the deck.

~~~js
const deck = new Deck(1, 3)   //[1, 2, 3]
deck.shuffle();               //[?, ?, ?]
~~~

### Card ###

Represents a single card.

#### Constructor ####

The deck will handle the creation of cards in a sensible order with respect to suits
and ranks.  However the Card class can be used to add additional cards.  Maybe your
war game needs a nuke?  Add a card with a rank of 1000 to the deck.  Guaranteed to
end a war immediately, at least until someone makes a bigger nuke ;).

~~~js
const card = new Card(int suit, int rank);
~~~

#### Properties ####

##### suit #####

The suit of the current card.

~~~js
int suit = card.suit;
~~~

##### rank #####

The rank of the current card.

~~~js
int rank = card.rank;
~~~

## License ##

MIT, see LICENSE
