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

          expect(p1.cards.length).toBe(3);
          expect(p2.cards.length).toBe(3);
          expect(p3.cards.length).toBe(3);
      });
  });

  describe('Play Tests', () => {
    // I am going to make shuffling the deck the responsibility of the caller.
    // That way we can actually exploit the default ordering of the deck to
    // perform tests

    it('Determines winner correctly without a tie', () => {
      let deck = new Deck(1, 3);
      const game = new WarGame(deck, 3);
      const winner = game.playRound();

      // player 3 is guaranteed to have the high card;
      expect(winner.name).toBe('Player 3');
    });

    it('Determines the correct winner in a war', () => {
      // flagrant abuse of duck typing...
      let FakeDeck = () => {
        this.cards = [
          new Card(1, 1),
          new Card(2, 1),
          new Card(1, 2),
          new Card(1, 3),
          new Card(1, 4),
          new Card(1, 5)
        ];

        deal = () => { return this.cards.shift(); };
      };

      const deck = new FakeDeck();
      const game = new WarGame(deck, 2);
      let winner = game.playRound();

      expect(winner).toBeNull();

      winner = game.playRound();
      expect(winner.name).toBe('Player 2');
    });
  });
});
