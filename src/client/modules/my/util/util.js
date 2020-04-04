
import firebase from '../firebase/firebase.js';
const db = firebase.firestore();


//Returns a promise, needs to be resolved with .then and .catch to get the return value
//Each game is identified by a user in firebase, so the game uid is the game id
const createGame = (gamename, password, username) => {
    document.cookie = "username=" + username;
    firebase.auth().createUserWithEmailAndPassword(gamename, password)
    .then(function(game) {
        db.collection("game").doc(game.user.uid).set({
            game: game.user.uid,
            begin: false
        });
        addPlayer(username, game.user.uid);
    })
    .catch(function(error) {
        console.log("Error creating the game id with game name and password: ", error);
    });
}

const signIn = (gamename, password, username) => {
    document.cookie = "username=" + username;
    firebase.auth().signInWithEmailAndPassword(gamename, password)
    .then(function(game) {
      db.collection("game").doc(game.user.uid).set({
        game: game.user.uid,
        begin: false
      }, {merge: true});
      addPlayer(username, game.user.uid);
    })
    .catch(function(error) {
        console.log("Error signing in with game id and password: ", error);
    });
}

const retrieveGameId = () => {
  let game = firebase.auth().currentUser;
        if (game) {
          // User is signed in.
          //console.log('game, ', game);
          return game.uid;
        } else {
            console.log('No game being played');
        }
}

//Adds a player to the map of players in the game id doc, hand is set to an empty map
const addPlayer = (username, gameId) => {
    let players = {};
    let playersMap = {};
    players[username] = {}; //player's hand is empty initially
    playersMap['playersMap'] = players;
    db.collection("game").doc(gameId).set(playersMap, {merge: true});
}

//expecting cards to be a map of value -> {order, row, flipped}
const updatePlayerHand = (username, cards, gameId) => {
    let players = {};
    let playersMap = {};
    players[username] = cards;
    playersMap['playersMap'] = players;
    db.collection("game").doc(gameId).set(playersMap, {merge: true});
}

//expecting pyramid to be a map of value -> {order, row, flipped}
const updatePyramid = (pyramid, gameId) => {
    let pyramidMap = {};
    pyramidMap['pyramidMap'] = pyramid;
    db.collection("game").doc(gameId).set(pyramidMap, {merge: true});
}

//Deletes the game by deleting the game id document
//Game uid and firebase user still exists, though
const resetGame = (gameId) => {
    db.collection("game").doc(gameId).delete()
    .then(function() {
        console.log("Game successfully deleted!");
    }).catch(function(error) {
        console.error("Error removing game id: ", error);
    });
}

const retrievePyramid = (gameId, callback) => {
    db.collection("game").doc(gameId).onSnapshot(doc => {
        if (!doc.data().pyramidMap) {
          console.log('No such pyramid!');
        } else {
          console.log('Pyramid data:', doc.data().pyramidMap);
          callback(doc.data().pyramidMap);
        }
      }, err => {
        console.log('Error getting game when retrieving pyramid', err);
      });
}

const retrievePlayerHand = (username, gameId, callback) => {
    db.collection("game").doc(gameId).onSnapshot(doc => {
        if (!doc.data().playersMap[username]) {
          console.log('No such player hand!');
        } else {
          console.log('Player data:', doc.data().playersMap[username]);
          callback(doc.data().playersMap[username]);
        }
      }, err => {
        console.log('Error getting game when retrieving player hand', err);
      });
}

//returns array of player usernames
const retrievePlayers = (gameId, callback) => {
    db.collection("game").doc(gameId).onSnapshot(doc => {
        if (!doc.exists) {
          console.log('No such players!');
        } else if (doc.data().playersMap){
          //console.log('Player data:', Object.keys(doc.data().playersMap));
          callback(Object.keys(doc.data().playersMap));
        }
      }, err => {
        console.log('Error getting game when retrieving players', err);
      });
}

const beginGame = (gameId) => {
  let begin = {'begin': true};
  db.collection("game").doc(gameId).set(begin, {merge: true});
}

const retrieveBeginGame = (gameId, callback) => {
  db.collection("game").doc(gameId).onSnapshot(doc => {
    if (!doc.exists) {
      console.log('No such game to begin!');
    } else {
      console.log('Begin:', doc.data().begin);
      callback(doc.data().begin);
    }
  }, err => {
    console.log('Error getting game when retrieving begin', err);
  });
}

export {resetGame, createGame, addPlayer, updatePlayerHand, updatePyramid, retrievePyramid, retrievePlayerHand, retrievePlayers, signIn, retrieveGameId, beginGame, retrieveBeginGame};