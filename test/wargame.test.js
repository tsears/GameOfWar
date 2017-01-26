import WarGame from '../js/WarGame';
import Deck from '../js/Deck';
import Card from '../js/Card';

describe('War Game Tests', () => {
  describe('Setup', () => {
      it('Sets up the correct number of players', () => {
        let deck = new Deck(1,3);
        const game = new WarGame(deck, 3);

        expect(game.players.length).toBe(3);
      });

      it('Uses the deck passed', () => {
        let deck = new Deck(1, 1);
        const game = new WarGame(deck, 1);

        expect(game.deck).toBe(deck);
      });

      it('Doesn\'t allow fewer cards than there are players', () => {
        let deck = new Deck(1,2);

        // 3 players, 2 cards...
        expect(() => { const x = new WarGame(deck, 3); }).toThrow();
      });

      it('Requires the total number of cards to be evenly divisible by the number of players', () => {
        let deck = new Deck(1, 4);

        expect(() => { const x = new WarGame(deck, 3); }).toThrow();
      });

      it('Evenly divides the deck between players', () => {
          let deck = new Deck(3, 3);
          const game = new WarGame(deck, 3);

          const p1 = game.getPlayer(1);
          const p2 = game.getPlayer(2);
          const p3 = game.getPlayer(3);

          expect(p1.cardCount).toBe(3);
          expect(p2.cardCount).toBe(3);
          expect(p3.cardCount).toBe(3);
      });
  });

  describe('Play Tests', () => {
    // I am going to make shuffling the deck the responsibility of the caller.
    // That way we can actually exploit the default ordering of the deck to
    // perform tests

    // flagrant abuse of duck typing...
    class MockDeck {
      constructor() {
        this.cards = [
          new Card(1, 3),
          new Card(1, 4),
          new Card(1, 1),

          new Card(1, 5),
          new Card(1, 1),
          new Card(1, 1),

          new Card(2, 2),
          new Card(1, 2),
          new Card(1, 1),
        ];

        this.initialSize = 6;
      }

      get currentSize() { return this.cards.length; }
      deal() { return this.cards.shift(); }
    }

    it('Determines winner correctly without a tie', () => {
      let deck = new Deck(1, 3);
      const game = new WarGame(deck, 3);
      const result = game.playRound();

      // player 3 is guaranteed to have the high card;
      expect(result.winner.name).toBe('Player 3');
    });

    it('Correctly reports a war occured', () => {
      const deck = new MockDeck();
      const game = new WarGame(deck, 3);
      const result = game.playRound();

      expect(result.war).toBe(true);
    });

    it('Determines the correct winner in a two-player war in a 3 player game', () => {
      const deck = new MockDeck();

      const game = new WarGame(deck, 3);
      let result = game.playRound();

      expect(result.winner.name).toBe('Player 1');
    });

    it('Determines the correct winner in a three-player war in a 3 player game', () => {
        const deck = new MockDeck();
        // ensure a 3 way war on the first pass
        deck.cards.push(new Card(1,1));
        deck.cards.push(new Card(1,1));
        deck.cards.push(new Card(1,1));

        const game = new WarGame(deck, 3);
        let result = game.playRound();

        // after that, it'll be a war between Players 1 and 2, or a repeat of the
        // above test
        expect(result.winner.name).toBe('Player 1');
    });
  });
});
