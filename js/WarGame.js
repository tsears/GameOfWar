import Player from './Player';

export default class WarGame {
  constructor(deck, numPlayers) {
    this._deck = deck;
    this._numPlayers = numPlayers;
    this._players = [];

    if (deck.initalSize % numPlayers !== 0 ) {
      // if there is a remainder, then it wasn't evenly divisble...
      throw new Error('Invalid player/deck combo');
    }

    for (let i = 0; i < numPlayers; ++i) {
      this._players.push(new Player(`Player ${i}`));
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
}
