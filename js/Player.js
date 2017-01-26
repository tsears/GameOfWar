export default class Player {
  constructor(name) {
    this._name = name;
    this._cards = [];
  }

  get cardCount() { return this._cards.length; }
  get name() { return this._name; }

  addCard(card) {
    this._cards.push(card);
  }

  revealCard() {
    return this._cards.pop();
  }
}
