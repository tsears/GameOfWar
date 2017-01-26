import Player from './Player';
import RoundResult from './RoundResult';

export default class WarGame {
  constructor(deck, numPlayers) {
    this._deck = deck;
    this._numPlayers = numPlayers;
    this._players = [];

    if (this._deck.initialSize % numPlayers !== 0 ) {
      // if there is a remainder, then it wasn't evenly divisble...
      throw new Error('Invalid player/deck combo');
    }

    for (let i = 1; i <= numPlayers; ++i) {
      this._players.push(new Player(`Player ${i}`));
    }

    let j = 0;
    while(this._deck.currentSize > 0) {
      let receivingPlayerIndex = j % numPlayers;
      let card = this._deck.deal();
      this._players[receivingPlayerIndex].addCard(card);
      ++j;
    }
  }

  get deck() { return this._deck; }
  get players() { return this._players; }

  getPlayer(player) {
    // players are not zero indexed... didn't want to do that jujitsu from the
    // consumer.
    const pIndex = player - 1;
    return this._players[pIndex];
  }

  playRound() {
    const draw = this._players.map(p => p.revealCard());

    const max = draw.reduce((a, b) => {
      // a is the value of the element we're looking at,
      // b is the value of the previous max
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce#Parameters
      return b.rank > a.rank ? b : a;
    }, {rank: 0});

    // if there are multiple elements with the max for a value, we will go to war on
    // the next round...

    const war = draw.filter(c => c.rank === max.rank).length > 1;
    const result = new RoundResult();
    draw.map((d, i) => {
      result.draws[i] = [];
      result.draws[i].push(d);
    });

    if (war) {
      result.war = true;
      return result;
    } else {
      let winner = this._players[draw.indexOf(max)]; //object equality....
      result.winner = winner;
      return result;
    }
  }
}
