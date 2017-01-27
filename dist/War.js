var War =
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
	
	var _WarGame = __webpack_require__(1);
	
	var _WarGame2 = _interopRequireDefault(_WarGame);
	
	var _Deck = __webpack_require__(4);
	
	var _Deck2 = _interopRequireDefault(_Deck);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	module.exports = {
	  Game: _WarGame2.default,
	  Deck: _Deck2.default
	};

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _Player = __webpack_require__(2);
	
	var _Player2 = _interopRequireDefault(_Player);
	
	var _RoundResult = __webpack_require__(3);
	
	var _RoundResult2 = _interopRequireDefault(_RoundResult);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var WarGame = function () {
	  function WarGame(deck, numPlayers) {
	    _classCallCheck(this, WarGame);
	
	    _initialiseProps.call(this);
	
	    this._deck = deck;
	    this._numPlayers = numPlayers;
	    this._players = [];
	
	    if (this._deck.initialSize % numPlayers !== 0) {
	      // if there is a remainder, then it wasn't evenly divisble...
	      throw new Error('Invalid player/deck combo');
	    }
	
	    for (var i = 1; i <= numPlayers; ++i) {
	      this._players.push(new _Player2.default('Player ' + i));
	    }
	
	    var j = 0;
	    while (this._deck.currentSize > 0) {
	      var receivingPlayerIndex = j % numPlayers;
	      var card = this._deck.deal();
	      this._players[receivingPlayerIndex].addCard(card);
	      ++j;
	    }
	  }
	
	  _createClass(WarGame, [{
	    key: 'deck',
	    get: function get() {
	      return this._deck;
	    }
	  }, {
	    key: 'players',
	    get: function get() {
	      return this._players;
	    }
	
	    /*****************************************************************************
	    * _resolveRound
	    *
	    * This is where all the magic happens.  We will recursively determine the outcome
	    * of the round.  If the draws result in a war, we will keep calling this function
	    * until all wars are resolved.  A complete record of the draws will be returned
	    * along with the winner
	    *****************************************************************************/
	
	  }]);
	
	  return WarGame;
	}();
	
	var _initialiseProps = function _initialiseProps() {
	  var _this = this;
	
	  this.getPlayer = function (player) {
	    // players are not zero indexed... didn't want to do that jujitsu from the
	    // consumer.
	    var pIndex = player - 1;
	    return _this._players[pIndex];
	  };
	
	  this.playRound = function () {
	    var result = new _RoundResult2.default();
	    var indicies = _this._players.map(function (p, i) {
	      return i;
	    });
	
	    return _this._resolveRound(indicies, result);
	  };
	
	  this._resolveRound = function (warringPlayers, result) {
	    var draw = warringPlayers.map(function (i) {
	      return _this._players[i].revealCard();
	    });
	
	    // for .. of was giving babel fits... didn't want to run it down now.
	    for (var _j = 0; _j < warringPlayers.length; ++_j) {
	      var playerIndex = warringPlayers[_j];
	
	      if (!result.draws[playerIndex]) {
	        result.draws[playerIndex] = [];
	      }
	      result.draws[playerIndex].push(draw[_j]);
	    }
	
	    var max = _this._findCardWithMaxValue(draw);
	    var atWar = draw.filter(function (c) {
	      return c.rank === max.rank;
	    }).length > 1;
	
	    if (atWar) {
	      result.war = true;
	
	      var warringPlayerIndicies = [];
	      for (var i = 0; i < draw.length; i++) {
	        if (draw[i].rank === max.rank) {
	          warringPlayerIndicies.push(warringPlayers[i]);
	        }
	      }
	
	      // recurse
	      return _this._resolveRound(warringPlayerIndicies, result);
	    } else {
	      // break recursion
	      var winner = _this._players[warringPlayers[draw.indexOf(max)]]; //object equality....
	      result.winner = winner;
	      return result;
	    }
	  };
	
	  this._findCardWithMaxValue = function (cards) {
	    return cards.reduce(function (a, b) {
	      // a is the value of the element we're looking at,
	      // b is the value of the previous max
	      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce#Parameters
	      return b.rank > a.rank ? b : a;
	    }, { rank: 0 });
	  };
	};
	
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
	    var _this = this;
	
	    _classCallCheck(this, Deck);
	
	    this.deal = function () {
	      return _this._cards.shift(); //FIFO
	    };
	
	    this.shuffle = function () {
	      var newOrder = [];
	      var oldOrder = _this._cards.slice(); // we will leave the initial ordering in tact until the shuffle is complete...
	
	      do {
	        var randomIndex = Math.floor(Math.random() * oldOrder.length);
	        var randomCard = oldOrder.splice(randomIndex, 1)[0];
	        newOrder.push(randomCard);
	      } while (oldOrder.length > 0);
	
	      _this._cards = newOrder;
	    };
	
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
//# sourceMappingURL=War.js.map