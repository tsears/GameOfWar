import Player from './Player';
import RoundResult from './RoundResult';
import Deck from './Deck';

export default class WarGame {
  constructor(deck, numPlayers) {
    this._deck = deck;
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

    const draw = this._draw(warringPlayers, result);

    const max = this._findCardWithMaxValue(draw);
    const atWar = draw.filter(c => c && c.rank === max.rank).length > 1;

    if (atWar) {
      result.war = true;

      const warringPlayerIndicies = [];
      for (let i = 0; i < draw.length; i++) {
        if (draw[i] && draw[i].rank === max.rank) {
          warringPlayerIndicies.push(warringPlayers[i]);
        }
      }

      this._draw(warringPlayerIndicies, result);

      return this._resolveRound(warringPlayerIndicies, result);
    } else {
      // break recursion
      let winner = this._players[warringPlayers[draw.indexOf(max)]]; //object equality....

      if (!winner) {
        result.winner = null;
      } else {
        result.winner = winner;
        this._awardCards(result.draws, winner);
      }

      if (this._gameIsOver()) {
        // console.log('game over!');
        // console.log(`num players: ${this._numPlayers} empty players ${this._players.filter(p => p.cardCount === 0).length}` );
        result.gameOver = true;
      }

      return result;
    }
  }

  _draw(warringPlayers, result) {
    const draw = warringPlayers.map(i => { return this._players[i].revealCard(); });

    for(let j = 0; j < warringPlayers.length; ++j) {
      const playerIndex = warringPlayers[j];

      if (!result.draws[playerIndex]) { result.draws[playerIndex] = []; }
      result.draws[playerIndex].push(draw[j]);
    }

    return draw;
  }

  /*****************************************************************************
  * _gameIsOver
  *
  * The game is over when one player has all *available cards* -- if the deck
  * wasn't evenly divisible by the number of players, then excess cards would
  * have been left on the deck, making a strict "a player has all the cards in
  * the deck" impossible.
  ******************************************************************************/

  _gameIsOver() {
    return this._players.filter(p => p.cardCount === 0).length === this._numPlayers - 1;
  }

  _findCardWithMaxValue(cards) {
    return cards.filter(c => c).reduce((a, b) => {
      // a is the value of the element we're looking at,
      // b is the value of the previous max
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce#Parameters
      return b.rank > a.rank ? b : a;
    }, {rank: 0});
  }

  _awardCards(draws, winner) {
    for(let i = 0; i < draws.length; ++i) {
      for (let j = 0; j < draws[i].length; ++j) {
        if(draws[i][j]) {
          winner.awardCard(draws[i][j]);
        }
      }
    }
  }

  _distributeCards() {
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
