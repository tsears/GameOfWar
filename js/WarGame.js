import Player from './Player';
import RoundResult from './RoundResult';
import Deck from './Deck';

export const CardAwardMethod = {
  "Increasing" : 0,
  "Shuffled" : 1
};

export default class WarGame {
  constructor(deck, numPlayers, distributionMethod = CardAwardMethod.Increasing) {
    this._deck = deck;
    this._numPlayers = numPlayers;
    this._players = [];
    this._playerCount = 0;
    this._distributionMethod = distributionMethod;

    if (deck.currentSize < numPlayers) {
      throw new Error('Deck must at least the same size as the number of players');
    }

    for (let i = 1; i <= numPlayers; ++i) {
      this._players.push(new Player(`Player ${i}`));
      ++this._playerCount;
    }

    this._startGame();
  }

  get deck() { return this._deck; }
  get playerCount() { return this._playerCount; }

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

  _startGame() {
    this._distributeCards();
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

      const warringPlayerIndicies = this._getWarringPlayerIndicies(draw, warringPlayers, max);

      this._prepForWar(draw, warringPlayerIndicies, result);

      return this._resolveRound(warringPlayerIndicies, result);
    } else {
      // break recursion
      let winner = this._players[warringPlayers[draw.indexOf(max)]]; //object equality....

      return this._finishRound(winner, draw, result);
    }
  }

  _prepForWar(draw, warringPlayerIndicies, result) {
    this._draw(warringPlayerIndicies, result);
  }

  _finishRound(winner, draw, result) {
    if (!winner) {
      result.winner = null;
    } else {
      result.winner = winner;
      this._awardCards(result.draws, winner);
    }

    if (this._gameIsOver()) {
      result.gameOver = true;
    }

    return result;
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

  _getWarringPlayerIndicies(draw, players, warVal) {
    const indicies = [];
    for (let i = 0; i < draw.length; i++) {
      if (draw[i] && draw[i].rank === warVal.rank) {
        indicies.push(players[i]);
      }
    }

    return indicies;
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
    if (this._distributionMethod === CardAwardMethod.Increasing) {
      this._awardCardsIncreasing(draws, winner);
    } else if (this._distributionMethod === CardAwardMethod.Shuffled) {
      this._awardCardsShuffled(draws, winner);
    }
  }

  _awardCardsIncreasing(draws, winner) {
    this._getDrawsThen(draws, (card) => {
      winner.awardCard(card);
    });
  }

  _awardCardsShuffled(draws, winner) {
    const tempDeck = new Deck(0,0);
    this._getDrawsThen(draws, (card) => {
      tempDeck.add(card);
    });

    tempDeck.shuffle();

    while(tempDeck.currentSize > 0) {
      winner.awardCard(tempDeck.deal());
    }
  }

  _getDrawsThen(draws, action) {
    const out = [];

    for(let i = 0; i < draws.length; ++i) {
      for (let j = 0; j < draws[i].length; ++j) {
        if(draws[i][j]) {
          action(draws[i][j]);
        }
      }
    }

    return out;
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
