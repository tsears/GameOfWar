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
    const result = new RoundResult();
    const indicies = this._players.map((p, i) => { return i; });

    return this._resolveWar(indicies, result);
  }

  // recursively perform draws until a winner is determined..
  _resolveWar(warringPlayers, result) {
    const draw = warringPlayers.map(i => {
      return this._players[i].revealCard();
    });

    // for .. of was giving babel fits... didn't want to run it down now.
    for(let j = 0; j < warringPlayers.length; ++j) {
      const playerIndex = warringPlayers[j];

      if (!result.draws[playerIndex]) { result.draws[playerIndex] = []; }
      result.draws[playerIndex].push(draw[j]);
    }

    const max = this._findCardWithMaxValue(draw);
    const atWar = draw.filter(c => c.rank === max.rank).length > 1;

    if (atWar) {
      result.war = true;

      const warringPlayerIndicies = [];
      for (let i = 0; i < draw.length; i++) {
        if (draw[i].rank === max.rank) {
          warringPlayerIndicies.push(i);
        }
      }

      // recurse
      return this._resolveWar(warringPlayerIndicies, result);
    } else {
      // break recursion
      let winner = this._players[draw.indexOf(max)]; //object equality....
      result.winner = winner;
      return result;
    }

    return;
  }

  _findCardWithMaxValue(cards) {
    return cards.reduce((a, b) => {
      // a is the value of the element we're looking at,
      // b is the value of the previous max
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce#Parameters
      return b.rank > a.rank ? b : a;
    }, {rank: 0});
  }
}
