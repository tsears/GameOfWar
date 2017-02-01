/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _WarGame = __webpack_require__(1);
	
	var _WarGame2 = _interopRequireDefault(_WarGame);
	
	var _Deck = __webpack_require__(4);
	
	var _Deck2 = _interopRequireDefault(_Deck);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var War = function () {
	  function War(numSuits, numRanks, numPlayers) {
	    _classCallCheck(this, War);
	
	    // I would inject the deck as a dependency, so this class is just going to
	    // wrap another class that does....
	    this._numSuits = numSuits;
	    this._numRanks = numRanks;
	    this._numPlayers = numPlayers;
	
	    this._warGame = new _WarGame2.default(new _Deck2.default(this._numSuits, this._numRanks), this._numPlayers);
	  }
	
	  _createClass(War, [{
	    key: 'game',
	    get: function get() {
	      return this._warGame;
	    }
	  }]);
	
	  return War;
	}();
	
	exports.default = War;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.CardAwardMethod = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _Player = __webpack_require__(2);
	
	var _Player2 = _interopRequireDefault(_Player);
	
	var _RoundResult = __webpack_require__(3);
	
	var _RoundResult2 = _interopRequireDefault(_RoundResult);
	
	var _Deck = __webpack_require__(4);
	
	var _Deck2 = _interopRequireDefault(_Deck);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var CardAwardMethod = exports.CardAwardMethod = {
	  "Increasing": 0,
	  "Shuffled": 1
	};
	
	var WarGame = function () {
	  function WarGame(deck, numPlayers) {
	    var distributionMethod = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : CardAwardMethod.Increasing;
	
	    _classCallCheck(this, WarGame);
	
	    this._deck = deck;
	    this._numPlayers = numPlayers;
	    this._players = [];
	    this._playerCount = 0;
	    this._distributionMethod = distributionMethod;
	
	    if (deck.currentSize < numPlayers) {
	      throw new Error('Deck must at least the same size as the number of players');
	    }
	
	    for (var i = 1; i <= numPlayers; ++i) {
	      this._players.push(new _Player2.default('Player ' + i));
	      ++this._playerCount;
	    }
	
	    this._startGame();
	  }
	
	  _createClass(WarGame, [{
	    key: 'getPlayer',
	    value: function getPlayer(player) {
	      // players are not zero indexed... didn't want to do that jujitsu from the
	      // consumer.
	      var pIndex = player - 1;
	      return this._players[pIndex];
	    }
	  }, {
	    key: 'playRound',
	    value: function playRound() {
	      var result = new _RoundResult2.default();
	      var indicies = this._players.map(function (p, i) {
	        return i;
	      });
	
	      return this._resolveRound(indicies, result);
	    }
	  }, {
	    key: '_startGame',
	    value: function _startGame() {
	      this._distributeCards();
	    }
	
	    /*****************************************************************************
	    * _resolveRound
	    *
	    * This is where all the magic happens.  We will recursively determine the outcome
	    * of the round.  If the draws result in a war, we will keep calling this function
	    * until all wars are resolved.  A complete record of the draws will be returned
	    * along with the winner
	    *****************************************************************************/
	
	  }, {
	    key: '_resolveRound',
	    value: function _resolveRound(warringPlayers, result) {
	
	      var draw = this._draw(warringPlayers, result);
	      var max = this._findCardWithMaxValue(draw);
	      var atWar = draw.filter(function (c) {
	        return c && c.rank === max.rank;
	      }).length > 1;
	
	      if (atWar) {
	        result.war = true;
	
	        var warringPlayerIndicies = this._getWarringPlayerIndicies(draw, warringPlayers, max);
	
	        this._prepForWar(draw, warringPlayerIndicies, result);
	
	        return this._resolveRound(warringPlayerIndicies, result);
	      } else {
	        // break recursion
	        var winner = this._players[warringPlayers[draw.indexOf(max)]]; //object equality....
	
	        return this._finishRound(winner, draw, result);
	      }
	    }
	  }, {
	    key: '_prepForWar',
	    value: function _prepForWar(draw, warringPlayerIndicies, result) {
	      this._draw(warringPlayerIndicies, result);
	    }
	  }, {
	    key: '_finishRound',
	    value: function _finishRound(winner, draw, result) {
	      if (!winner) {
	        result.winner = null;
	      } else {
	        result.winner = winner;
	        this._awardCards(result.draws, winner);
	      }
	
	      if (this._gameIsOver()) {
	        result.gameOver = true;
	      }
	
	      return result;
	    }
	  }, {
	    key: '_draw',
	    value: function _draw(warringPlayers, result) {
	      var _this = this;
	
	      var draw = warringPlayers.map(function (i) {
	        return _this._players[i].revealCard();
	      });
	
	      for (var j = 0; j < warringPlayers.length; ++j) {
	        var playerIndex = warringPlayers[j];
	
	        if (!result.draws[playerIndex]) {
	          result.draws[playerIndex] = [];
	        }
	        result.draws[playerIndex].push(draw[j]);
	      }
	
	      return draw;
	    }
	
	    /*****************************************************************************
	    * _gameIsOver
	    *
	    * The game is over when one player has all *available cards* -- if the deck
	    * wasn't evenly divisible by the number of players, then excess cards would
	    * have been left on the deck, making a strict "a player has all the cards in
	    * the deck" impossible.
	    ******************************************************************************/
	
	  }, {
	    key: '_gameIsOver',
	    value: function _gameIsOver() {
	      return this._players.filter(function (p) {
	        return p.cardCount === 0;
	      }).length === this._numPlayers - 1;
	    }
	  }, {
	    key: '_getWarringPlayerIndicies',
	    value: function _getWarringPlayerIndicies(draw, players, warVal) {
	      var indicies = [];
	      for (var i = 0; i < draw.length; i++) {
	        if (draw[i] && draw[i].rank === warVal.rank) {
	          indicies.push(players[i]);
	        }
	      }
	
	      return indicies;
	    }
	  }, {
	    key: '_findCardWithMaxValue',
	    value: function _findCardWithMaxValue(cards) {
	      return cards.filter(function (c) {
	        return c;
	      }).reduce(function (a, b) {
	        // a is the value of the element we're looking at,
	        // b is the value of the previous max
	        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce#Parameters
	        return b.rank > a.rank ? b : a;
	      }, { rank: 0 });
	    }
	  }, {
	    key: '_awardCards',
	    value: function _awardCards(draws, winner) {
	      if (this._distributionMethod === CardAwardMethod.Increasing) {
	        this._awardCardsIncreasing(draws, winner);
	      } else if (this._distributionMethod === CardAwardMethod.Shuffled) {
	        this._awardCardsShuffled(draws, winner);
	      }
	    }
	  }, {
	    key: '_awardCardsIncreasing',
	    value: function _awardCardsIncreasing(draws, winner) {
	      for (var i = 0; i < draws.length; ++i) {
	        for (var j = 0; j < draws[i].length; ++j) {
	          if (draws[i][j]) {
	            winner.awardCard(draws[i][j]);
	          }
	        }
	      }
	    }
	  }, {
	    key: '_awardCardsShuffled',
	    value: function _awardCardsShuffled(draws, winner) {
	      var tempDeck = new _Deck2.default(0, 0);
	      for (var i = 0; i < draws.length; ++i) {
	        for (var j = 0; j < draws[i].length; ++j) {
	          if (draws[i][j]) {
	            tempDeck.add(draws[i][j]);
	          }
	        }
	      }
	
	      tempDeck.shuffle();
	
	      while (tempDeck.currentSize > 0) {
	        winner.awardCard(tempDeck.deal());
	      }
	    }
	  }, {
	    key: '_distributeCards',
	    value: function _distributeCards() {
	      this._deck.shuffle();
	
	      var numPasses = Math.floor(this._deck.currentSize / this._numPlayers);
	
	      while (numPasses > 0) {
	        for (var i = 0; i < this._numPlayers; ++i) {
	          this._players[i].addCard(this._deck.deal());
	        }
	        --numPasses;
	      }
	    }
	  }, {
	    key: 'deck',
	    get: function get() {
	      return this._deck;
	    }
	  }, {
	    key: 'playerCount',
	    get: function get() {
	      return this._playerCount;
	    }
	  }]);
	
	  return WarGame;
	}();
	
	exports.default = WarGame;

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Player = function () {
	  function Player(name) {
	    _classCallCheck(this, Player);
	
	    this._name = name;
	    this._cards = [];
	  }
	
	  _createClass(Player, [{
	    key: "addCard",
	    value: function addCard(card) {
	      this._cards.push(card);
	    }
	  }, {
	    key: "awardCard",
	    value: function awardCard(card) {
	      this._cards.unshift(card);
	    }
	  }, {
	    key: "revealCard",
	    value: function revealCard() {
	      return this._cards.pop();
	    }
	  }, {
	    key: "cardCount",
	    get: function get() {
	      return this._cards.length;
	    }
	  }, {
	    key: "score",
	    get: function get() {
	      return this._cards.length;
	    }
	  }, {
	    key: "name",
	    get: function get() {
	      return this._name;
	    }
	  }]);
	
	  return Player;
	}();
	
	exports.default = Player;

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var RoundResult = function () {
	  function RoundResult() {
	    _classCallCheck(this, RoundResult);
	
	    this._draws = [];
	    this._war = false;
	    this._winner = null;
	    this._gameOver = false;
	  }
	
	  _createClass(RoundResult, [{
	    key: "draws",
	    get: function get() {
	      return this._draws;
	    }
	  }, {
	    key: "war",
	    get: function get() {
	      return this._war;
	    },
	    set: function set(v) {
	      this._war = v;
	    }
	  }, {
	    key: "winner",
	    get: function get() {
	      return this._winner;
	    },
	    set: function set(v) {
	      this._winner = v;
	    }
	  }, {
	    key: "gameOver",
	    get: function get() {
	      return this._gameOver;
	    },
	    set: function set(v) {
	      this._gameOver = v;
	    }
	  }]);
	
	  return RoundResult;
	}();
	
	exports.default = RoundResult;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _Card = __webpack_require__(5);
	
	var _Card2 = _interopRequireDefault(_Card);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Deck = function () {
	  function Deck(numSuits, numRanks) {
	    _classCallCheck(this, Deck);
	
	    this._numSuits = numSuits;
	    this._numRanks = numRanks;
	    this._cards = [];
	    this._initialSize = 0; // yes, this is just suits * ranks. but we'll count for fun
	
	    for (var i = 1; i <= numSuits; ++i) {
	      for (var j = 1; j <= numRanks; ++j) {
	        ++this._initialSize;
	        this._cards.push(new _Card2.default(i, j));
	      }
	    }
	  }
	
	  _createClass(Deck, [{
	    key: 'deal',
	    value: function deal() {
	      return this._cards.pop(); //LIFO
	    }
	  }, {
	    key: 'add',
	    value: function add(card) {
	      return this._cards.push(card);
	    }
	  }, {
	    key: 'shuffle',
	    value: function shuffle() {
	      var newOrder = [];
	      var oldOrder = this._cards.slice(); // we will leave the initial ordering in tact until the shuffle is complete...
	
	      do {
	        var randomIndex = Math.floor(Math.random() * oldOrder.length);
	        var randomCard = oldOrder.splice(randomIndex, 1)[0];
	        newOrder.push(randomCard);
	      } while (oldOrder.length > 0);
	
	      this._cards = newOrder;
	    }
	  }, {
	    key: 'numSuits',
	    get: function get() {
	      return this._numSuits;
	    }
	  }, {
	    key: 'numRanks',
	    get: function get() {
	      return this._numRanks;
	    }
	  }, {
	    key: 'currentSize',
	    get: function get() {
	      return this._cards.length;
	    }
	  }, {
	    key: 'initialSize',
	    get: function get() {
	      return this._initialSize;
	    }
	  }]);
	
	  return Deck;
	}();
	
	exports.default = Deck;

/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Card = function () {
	  function Card(suit, rank) {
	    _classCallCheck(this, Card);
	
	    this._suit = suit;
	    this._rank = rank;
	  }
	
	  _createClass(Card, [{
	    key: "suit",
	    get: function get() {
	      return this._suit;
	    }
	  }, {
	    key: "rank",
	    get: function get() {
	      return this._rank;
	    }
	  }]);
	
	  return Card;
	}();
	
	exports.default = Card;

/***/ }
/******/ ]);
//# sourceMappingURL=game-of-war.js.map