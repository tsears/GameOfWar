// CLI driver -- quick way to spot check various funcitonality.

import Deck from './js/Deck';
import clc from 'cli-color';
import WarGame from './js/WarGame';

function printDeck(pDeck) {
  while(pDeck.currentSize !== 0) {
    const card = pDeck.deal();
    console.log(`Suit: ${card._suit}, Rank: ${card.rank}`);
  }
}

function printResult(roundOutcome) {
  console.log(`Winner: ${roundOutcome.winner.name}`);

  // supress linter - yes, I know I'm not making an assignment...
  roundOutcome.war ? console.log('War: ' + clc.green('Yes')) : console.log('War: ' + clc.red('No')); // jshint ignore:line

  roundOutcome.draws.map((d, i) => {
    const formattedDraw = d.map(c => { return `S${c.suit}-R${c.rank}`; });
    console.log(`Player ${i + 1}: ${formattedDraw}`);
  });
}

let deck = new Deck(4, 4);

console.log(clc.cyan('****************'));
console.log(clc.cyan('* Ordered Deck *'));
console.log(clc.cyan('****************\n'));

printDeck(deck);

console.log(clc.cyan('\n*****************'));
console.log(clc.cyan('* Shuffled Deck *'));
console.log(clc.cyan('*****************\n'));

deck = new Deck(4, 4);
deck.shuffle();

printDeck(deck);

console.log(clc.cyan('\n****************'));
console.log(clc.cyan('* Sample Round *'));
console.log(clc.cyan('****************\n'));

deck = new Deck(4, 13); // a real deck!
deck.shuffle();
let game = new WarGame(deck, 4);

let outcome = game.playRound();

printResult(outcome);

console.log(clc.cyan('\n**************'));
console.log(clc.cyan('* Sample War *'));
console.log(clc.cyan('**************\n'));

deck = new Deck(4, 13);
deck.shuffle();
game = new WarGame(deck, 4);

while (true) {
  let outcome = game.playRound();
  if (!outcome.war) {
    deck = new Deck(4, 13);
    deck.shuffle();
    game = new WarGame(deck, 4);
  } else {
    printResult(outcome);
    break;
  }
}

console.log(clc.cyan('\n**********************'));
console.log(clc.cyan('* Sample Double+ War *'));
console.log(clc.cyan('**********************\n'));

deck = new Deck(4, 13);
deck.shuffle();
game = new WarGame(deck, 4);
let doubleWar = false;

while (true) {
  game.playRound();
  let outcome = game.playRound();

  if (!outcome.draws.some(d => d.length === 3)) {
    // guarantee first war
    deck = new Deck(4, 13);
    deck.shuffle();
    game = new WarGame(deck, 4);
  } else {
    printResult(outcome);
    break;
  }
}

console.log(clc.cyan('\n*************************'));
console.log(clc.cyan('* Sample Three+ Way War *'));
console.log(clc.cyan('*************************\n'));

deck = new Deck(4, 13);
deck.shuffle();
game = new WarGame(deck, 4);

while (true) {
  game.playRound();
  let outcome = game.playRound();

  if (outcome.draws.filter(d => d.length > 1).length < 3) {
    // guarantee first war
    deck = new Deck(4, 13);
    deck.shuffle();
    game = new WarGame(deck, 4);
  } else {
    printResult(outcome);
    break;
  }
}
