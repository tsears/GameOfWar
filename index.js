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

console.log(clc.cyan('\n******************************'));
console.log(clc.cyan('* Endless War - Sample Round *'));
console.log(clc.cyan('******************************\n'));

deck = new Deck(4, 13); // a real deck!
deck.shuffle();
let game = new WarGame(deck, 4);

let outcome = game.playRound();

printResult(outcome);

console.log(clc.cyan('\n****************************'));
console.log(clc.cyan('* Endless War - Sample War *'));
console.log(clc.cyan('****************************\n'));

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

console.log(clc.cyan('\n************************************'));
console.log(clc.cyan('* Endless War - Sample Double+ War *'));
console.log(clc.cyan('************************************\n'));

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

console.log(clc.cyan('\n***************************************'));
console.log(clc.cyan('* Endless War - Sample Three+ Way War *'));
console.log(clc.cyan('***************************************\n'));

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


console.log(clc.cyan('\n*****************************************'));
console.log(clc.cyan('* Endless War - Simulate 1000000 rounds *'));
console.log(clc.cyan('*****************************************\n'));

deck = new Deck(4, 13);
deck.shuffle();
game = new WarGame(deck, 2);

const start = new Date();

console.log(clc.blackBright('Starting Simulation...'));
const outcomes = [];
for (let i = 0; i < 1000000; ++i) {
  outcomes.push(game.playRound());
}
const end = new Date();

const span = end.getTime() - start.getTime();
const secondsDiff = Math.floor(span / (1000));
console.log(clc.blackBright(`Simulation complete in ${secondsDiff} seconds`));

console.log(`Wars: ${outcomes.filter(o => o.war).length}`);
console.log(`Player 1 Wins: ${outcomes.filter(o => o.winner && o.winner.name === 'Player 1').length}`);
console.log(`Player 2 Wins: ${outcomes.filter(o => o.winner && o.winner.name === 'Player 2').length}`);
// console.log(`Player 3 Wins: ${outcomes.filter(o => o.winner && o.winner.name === 'Player 3').length}`);
// console.log(`Player 4 Wins: ${outcomes.filter(o => o.winner && o.winner.name === 'Player 4').length}`);
