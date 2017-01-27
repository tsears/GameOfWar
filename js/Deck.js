import Card from './Card';

export default class Deck {
  constructor(numSuits, numRanks) {
    this._numSuits = numSuits;
    this._numRanks = numRanks;
    this._cards = [];
    this._initialSize = 0; // yes, this is just suits * ranks. but we'll count for fun

    for (let i = 1; i <= numSuits; ++i) {
      for (let j = 1; j <= numRanks; ++j) {
        ++this._initialSize;
        this._cards.push(new Card(i, j));
      }
    }
  }

  get numSuits() { return this._numSuits; }
  get numRanks() { return this._numRanks; }
  get currentSize() { return this._cards.length; }
  get initialSize() { return this._initialSize; }

  deal = () => {
    return this._cards.shift(); //FIFO
  };

  shuffle = () => {
    let newOrder = [];
    let oldOrder = this._cards.slice(); // we will leave the initial ordering in tact until the shuffle is complete...

    do {
      let randomIndex = Math.floor(Math.random() * oldOrder.length);
      let randomCard = oldOrder.splice(randomIndex, 1)[0];
      newOrder.push(randomCard);
    } while(oldOrder.length > 0);

    this._cards = newOrder;
  };
}
