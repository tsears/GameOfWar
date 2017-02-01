import WarGame from './WarGame';
import Deck from './Deck';

export default class War {
  constructor(numSuits, numRanks, numPlayers) {
    // I would inject the deck as a dependency, so this class is just going to
    // wrap another class that does....
    this._numSuits = numSuits;
    this._numRanks = numRanks;
    this._numPlayers = numPlayers;

    this._warGame = new WarGame(new Deck(this._numSuits, this._numRanks), this._numPlayers);
  }

  get game() { return this._warGame; }
}
