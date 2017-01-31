import Player from './Player';
import RoundResult from './RoundResult';
import Deck from './Deck';

export default class EndlessWarGame {
  constructor(deck, numPlayers) {
    this._deck = deck;
    this._discardPile = new Deck(0,0);
    this._numPlayers = numPlayers;
    this._players = [];

    if (deck.currentSize < numPlayers) {
      throw new Error('Deck must at least the same size as the number of players');
    }

    for (let i = 1; i <= numPlayers; ++i) {
      this._players.push(new Player(`Player ${i}`));
    }

    this._distributeCards();
  }

  get deck() { return this._deck; }
  get discardPile () { return this._discardPile; }

  getPlayer(player) {
    // players are not zero indexed... didn't want to do that jujitsu from the
    // consumer.
    const pIndex = player - 1;
    return this._players[pIndex];
  }

  playRound() {
    const result = new RoundResult();
    const indicies = this._players.map((p, i) => { return i; });

    return this._resolveRound(indicies, result);
  }


  /*****************************************************************************
  * _resolveRound
  *
  * This is where all the magic happens.  We will recursively determine the outcome
  * of the round.  If the draws result in a war, we will keep calling this function
  * until all wars are resolved.  A complete record of the draws will be returned
  * along with the winner
  *****************************************************************************/

  _resolveRound(warringPlayers, result) {

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
          warringPlayerIndicies.push(warringPlayers[i]);
        }
      }

      // recurse
      this._discardDraw(draw);

      if(this._playersNeedCards()) {
        this._distributeCards();
      }

      return this._resolveRound(warringPlayerIndicies, result);
    } else {
      // break recursion
      let winner = this._players[warringPlayers[draw.indexOf(max)]]; //object equality....
      result.winner = winner;
      this._discardDraw(draw);

      if (this._playersNeedCards()) {
        this._distributeCards();
      }

      return result;
    }
  }

  _findCardWithMaxValue(cards) {
    return cards.reduce((a, b) => {
      // a is the value of the element we're looking at,
      // b is the value of the previous max
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce#Parameters
      return b.rank > a.rank ? b : a;
    }, {rank: 0});
  }

  _discardDraw(draw) {
    for(let i = 0; i < draw.length; ++i) {
      this._discardPile.add(draw[i]);
    }
    draw = null;
  }

  _playersNeedCards() {
    return this._players.filter(p => p.cardCount === 0).length > 0;
  }

  _distributeCards() {
    // place discard cards on deck
    const x = this._discardPile.currentSize;
    for (let i = 0; i < x; ++i) {
      let card = this._discardPile.deal();
      this._deck.add(card);
    }

    this._deck.shuffle();

    let numPasses = Math.floor(this._deck.currentSize / this._numPlayers);

    while(numPasses > 0) {
      for (let i = 0; i < this._numPlayers; ++i) {
        this._players[i].addCard(this._deck.deal());
      }
      --numPasses;
    }
  }
}
