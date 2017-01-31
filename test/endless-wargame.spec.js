import EndlessWarGame from '../js/EndlessWarGame';
import Deck from '../js/Deck';
import Card from '../js/Card';

describe('Endless War Game Tests', () => {
  describe('Setup', () => {
      it('Sets up the correct number of players', () => {
        let deck = new Deck(1,3);
        const game = new EndlessWarGame(deck, 3);

        expect(game.playerCount).toBe(3);
      });

      it('Uses the deck passed', () => {
        let deck = new Deck(1, 1);
        const game = new EndlessWarGame(deck, 1);

        expect(game.deck).toBe(deck);
      });

      it('Doesn\'t allow fewer cards than there are players', () => {
        let deck = new Deck(1,2);

        // 3 players, 2 cards...
        expect(() => { const x = new EndlessWarGame(deck, 3); }).toThrow();
      });

      it('Evenly divides the deck between players', () => {
          const deck = new Deck(3, 3);
          const game = new EndlessWarGame(deck, 3);

          const p1 = game.getPlayer(1);
          const p2 = game.getPlayer(2);
          const p3 = game.getPlayer(3);

          expect(p1.cardCount).toBe(3);
          expect(p2.cardCount).toBe(3);
          expect(p3.cardCount).toBe(3);
      });

      it ('Has the correct number of cards left over after the initial deal', () => {
        const deck = new Deck(1, 3);
        const game = new EndlessWarGame(deck, 2);

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

      const game = new EndlessWarGame(deck, 2);
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

      const game = new EndlessWarGame(deck, 2);

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

      const game = new EndlessWarGame(deck, 3);
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

        const game = new EndlessWarGame(deck, 3);
        let result = game.playRound();

        expect(result.winner.name).toBe('Player 2');
    });

    it('Places used cards in the discard pile', () => {
        const deck = new MockDeck();
        deck.cards.push(new Card(1,5)); // p2 card 1
        deck.cards.push(new Card(1,1)); // p1 card 1
        deck.cards.push(new Card(1,1)); // p2 card 2
        deck.cards.push(new Card(1,1)); // p1 card 2

        const game = new EndlessWarGame(deck, 2);
        const result = game.playRound(); // expect 2 cards to be consumed

        expect(result.winner.name).toBe('Player 2');
        expect(game.discardPile.currentSize).toBe(2);
    });

    it('Distributes cards from discard pile when player(s) run out', () => {
        const deck = new MockDeck();
        deck.add(new Card(2,2)); // p3 card 1
        deck.add(new Card(2,2)); // p2 card 1
        deck.add(new Card(2,1)); // p1 card 1
        deck.add(new Card(1,1)); // p3 card 2
        deck.add(new Card(1,5)); // p2 card 2
        deck.add(new Card(1,1)); // p1 card 2
        deck.add(new Card(1,1)); // p3 card 3
        deck.add(new Card(1,5)); // p2 card 3
        deck.add(new Card(1,10)); // p1 card 3 (not used)

        const game = new EndlessWarGame(deck, 3);

        // player 2 & 3 consme 2 cards each, player 1 consumes 1
        let result = game.playRound();
        /* After:
            p1: [s1r1, s1r10]
            p2: [s1r5]
            p3: [s1r1]
            discard: [s2r2, s2r2, s2r1, s1r5, s1r1]*/

        expect(game.discardPile.currentSize).toBe(5);

        // this should trigger a deal from the discard pile
        result = game.playRound();


        expect(result.war).toBe(false);
        // there should have been 8 cards on the discard pile and 0 on the deck,
        // each player should be given 2 and the 2 should be on the deck.  0 should
        // remain in the discard pile.

        expect(result.winner.name).toBe('Player 2');
        expect(game.getPlayer(1).cardCount).toBe(3);
        expect(game.getPlayer(2).cardCount).toBe(2);
        expect(game.getPlayer(3).cardCount).toBe(2);
        expect(game.discardPile.currentSize).toBe(0);
        expect(game.deck.currentSize).toBe(2);
    });
  });
});
