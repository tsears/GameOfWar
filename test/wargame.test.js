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

      it('Evenly divides the deck between players', () => {
          const deck = new Deck(3, 3);
          const game = new WarGame(deck, 3);

          const p1 = game.getPlayer(1);
          const p2 = game.getPlayer(2);
          const p3 = game.getPlayer(3);

          expect(p1.cardCount).toBe(3);
          expect(p2.cardCount).toBe(3);
          expect(p3.cardCount).toBe(3);
      });

      it ('Has the correct number of cards left over after the initial deal', () => {
        const deck = new Deck(1, 3);
        const game = new WarGame(deck, 2);

        expect(game.deck.currentSize).toBe(1);
      });
  });

  describe('Play Tests', () => {
    // I am going to make shuffling the deck the responsibility of the caller.
    // That way we can actually exploit the default ordering of the deck to
    // perform tests

    // flagrant abuse of duck typing...
    class MockDeck {
      constructor() {
        this.cards = [];
      }

      get currentSize() { return this.cards.length; }
      deal() { return this.cards.pop(); }
      add(card) { this.cards.push(card); }

      shuffle() { return; }
    }

    it('Determines winner correctly without a tie', () => {
      let deck = new MockDeck();
      deck.add(new Card(1,1));
      deck.add(new Card(1,3));

      const game = new WarGame(deck, 2);
      const result = game.playRound();

      // player 1 is guaranteed to have the high card;
      expect(result.winner.name).toBe('Player 1');
      expect(result.draws[0][0].rank).toBe(3);
      expect(result.war).toBe(false);
    });

    it('Correctly reports a war occured', () => {
      const deck = new MockDeck();
      deck.add(new Card(2,2));
      deck.add(new Card(3,2));
      deck.add(new Card(1,1));
      deck.add(new Card(2,2));

      const game = new WarGame(deck, 2);

      const result = game.playRound();
      expect(result.war).toBe(true);
    });

    it('Determines the correct winner in a two-player war in a 3 player game', () => {
      const deck = new MockDeck();
      deck.add(new Card(2,2)); // p3 card 1
      deck.add(new Card(2,2)); // p2 card 1
      deck.add(new Card(2,1)); // p1 card 1
      deck.add(new Card(1,1)); // p3 card 2
      deck.add(new Card(1,5)); // p2 card 2
      deck.add(new Card(1,1)); // p1 card 2 (not used)

      const game = new WarGame(deck, 3);
      let result = game.playRound();

      // player 2 goes to war with player 3, player 2 wins.
      expect(result.war).toBe(true);
      expect(result.draws[0].length).toBe(1);
      expect(result.draws[1].length).toBe(2);
      expect(result.draws[2].length).toBe(2);
      expect(result.winner.name).toBe('Player 2');
    });

    it('Determines the correct winner in a three-player war in a 3 player game', () => {
        const deck = new MockDeck();
        // ensure a 3 way war on the first pass
        deck.cards.push(new Card(1,1)); // p3 card 1
        deck.cards.push(new Card(1,1)); // p2 card 1
        deck.cards.push(new Card(1,1)); // p1 card 1

        deck.cards.push(new Card(1,2)); // p3 card 2
        deck.cards.push(new Card(1,10)); // p2 card 2
        deck.cards.push(new Card(1,1)); // p1 card 2

        const game = new WarGame(deck, 3);
        let result = game.playRound();

        expect(result.winner.name).toBe('Player 2');
    });

    it ('correctly determines winner in 2 player game', () => {
        const deck = new MockDeck();
        deck.cards.push(new Card(1,1));
        deck.cards.push(new Card(2,2));

        const game = new WarGame(deck, 2);
        const result = game.playRound();

        expect(result.gameOver).toBe(true);
        expect(result.winner.name).toBe('Player 1');
    });
  });
});
