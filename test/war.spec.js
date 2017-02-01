import War from '../js/War';

describe('War Wrapper Tests', () => {
    let warGame;

    beforeEach(() => {
        // 1 suit, 6 ranks, 2 players
        warGame = new War(1, 5, 2);
    });

    it('Creates a deck with 1 suit', () => {
      expect(warGame.game.deck.numSuits).toBe(1);
    });

    it('Creates a deck with 5 ranks', () => {
      expect(warGame.game.deck.numRanks).toBe(5);
    });

    it('Creates a game with 2 players', () => {
      expect(warGame.game.playerCount).toBe(2);
    });
});
