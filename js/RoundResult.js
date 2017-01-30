export default class RoundResult {
  constructor() {
    this._draws = [];
    this._war = false;
    this._winner = null;
    this._gameOver = false;
  }

  get draws() { return this._draws; }

  get war() { return this._war; }
  set war(v) { this._war = v; }

  get winner() { return this._winner; }
  set winner(v) { this._winner = v; }

  get gameOver() { return this._gameOver; }
  set gameOver(v) { this._gameOver = v; }
}
