import Deck from '../js/Deck';

describe('Deck Tests', () => {
  describe('Creation', () => {
    it('Creates a deck of the correct size', () => {
        const deck = new Deck(3, 5);
        expect(deck.currentSize).toBe(15);
        expect(deck.initialSize).toBe(15);
    });

    it('Creates the expected cards', () => {
      const deck = new Deck(2, 2);
      const card1 = deck.deal();
      const card2 = deck.deal();
      const card3 = deck.deal();
      const card4 = deck.deal();

      /// deck is unshuffled, should be in a sensible order...
      expect(card1.suit).toBe(2);
      expect(card1.rank).toBe(2);
      expect(card2.suit).toBe(2);
      expect(card2.rank).toBe(1);
      expect(card3.suit).toBe(1);
      expect(card3.rank).toBe(2);
      expect(card4.suit).toBe(1);
      expect(card4.rank).toBe(1);
    });
  });

  describe('Deal', () => {
    const deck = new Deck(2, 2);
    const card = deck.deal();

    it('Deals a card with the correct rank and suit', () => {
      expect(card.suit).toBe(2);
      expect(card.rank).toBe(2);
    });
  });

  describe('Shuffle', () => {
    // a new deck will always be ordered....
    it('Returns a different order than strict increasing', () => {
      // note: I've had to do a card shuffler before as an exercise for another
      // position... in a unit test I choose **ONLY** to care if **ANY** card is
      // not in the default position.. testing the degree of randomness is better
      // left for an integration or manual test...

      // the odds of any particular deck configuration are 1 in 52! (astronomically small)
      // in short, there should be effectively a zero chance of the deck staying in the
      // same order.... http://gizmodo.com/there-are-more-ways-to-arrange-a-deck-of-cards-than-ato-1553612843

      const deck = new Deck(4, 13);
      deck.shuffle();
      let initialSuit = 1;
      let initialRank = 1;
      let different = false;
      let cardsDrawn = 0;

      outer:
      for(let i = 1; i <= 4; ++i) {
        for(let j = 1; j <= 13; ++j ) {
          const card = deck.deal();
          if (card.suit !== i || card.rank !== j) {
            ++cardsDrawn;
            different = true;
            break outer; // this will very likely break on the first element..
          }
        }
      }

      expect(different).toBe(true);
      expect(deck.currentSize).toBe(52 - cardsDrawn);
    });
  });
});
