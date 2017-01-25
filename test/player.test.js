import Player from '../js/Player';

describe('Player Tests', () => {
  let player = null;

  const card1 = new Card(1, 1);
  const card2 = new Card(1, 2);

  beforeEach(() => {
    player = new Player('Foo');
    player.addCard(card1);
    player.addCard(card2);
  });

  it('Gets cards that are dealt', () => {
    expect(player.cardCount).toBe(2);
  });

  it('Reveals last card first', () => {
    const card = player.revealCard();

    expect(card.suit).toBe(1);
    expect(card.rank).toBe(2);
  })

  it('Removes card once revealed', () => {
    const card = player.revealCard();
    expect(player.cardCount).toBe(1);
  })
});
