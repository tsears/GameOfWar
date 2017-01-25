export default class Player {
  constructor(name) {
    this._name = name;
    this._cards = [];
  }

  get cardCount() { return this._cards.length; }

  addCard(card) {
    this._cards.push(card);
  }

  revealCard() {
    return this._cards.pop();
  }
}
