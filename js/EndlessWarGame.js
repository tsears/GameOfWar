import Player from './Player';
import RoundResult from './RoundResult';
import Deck from './Deck';
import WarGame from './WarGame';

export default class EndlessWarGame extends WarGame {
  constructor(deck, numPlayers) {
    super(deck, numPlayers);
  }

  get discardPile () { return this._discardPile; }

  _startGame() {
    this._discardPile = new Deck(0,0);
    this._distributeCards();
  }

  _prepForWar(draw) {
    this._discardDraw(draw);

    if(this._playersNeedCards()) {
      this._distributeCards();
    }
  }

  _finishRound(winner, draw, result) {
    result.winner = winner;
    this._discardDraw(draw);

    if (this._playersNeedCards()) {
      this._distributeCards();
    }

    return result;
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
