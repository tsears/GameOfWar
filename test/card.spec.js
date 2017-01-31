import Card from '../js/Card';

describe('Card Test', () => {

  it('Returns given rank', () => {
    const card = new Card(1, 1);
    expect(card.rank).toBe(1);
  });

  it('Returns given suit', () => {
    const card = new Card(2, 2);
    expect(card.suit).toBe(2);
  });
});
