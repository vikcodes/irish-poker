
import firebase from '../firebase/firebase.js';
const db = firebase.firestore();


//Returns a promise, needs to be resolved with .then and .catch to get the return value
//Each game is identified by a user in firebase, so the game uid is the game id
const createGame = (gamename, password, username) => {
    document.cookie = "username=" + username;
    //document.cookie = "first=" + true;
    endGame();
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
    //document.cookie = "first=" + true;
    endGame();
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

const retrieveGameId = (callback) => {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      return callback(user);
    } else {
      // No user is signed in.
      console.log('Game has not been signed in yet');
    }
  });
}

//Adds a player to the map of players in the game id doc, hand is set to an empty map
const addPlayer = (username, gameId) => {
    let players = {};
    let playersMap = {};
    players[username] = {}; //player's hand is empty initially
    playersMap['playersMap'] = players;
    db.collection("game").doc(gameId).set(playersMap, {merge: true});
}

//expecting cards to be a map of value -> {order, flipped}
const updatePlayerHand = (username, cards) => {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // Game is signed in.
      let players = {};
      let playersMap = {};
      players[username] = cards;
      playersMap['playersMap'] = players;
      db.collection("game").doc(user.uid).set(playersMap, {merge: true});
    } else {
      // No user is signed in.
      console.log('Game has not been signed in yet');
    }
  });
}

//expecting pyramid to be a map of value -> {order, row, flipped}
const updatePyramid = (pyramid) => {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // Game is signed in.
      let pyramidMap = {};
      pyramidMap['pyramidMap'] = pyramid;
      pyramidMap['firstTime'] = false;
      db.collection("game").doc(user.uid).set(pyramidMap, {merge: true});
    } else {
      // No user is signed in.
      console.log('Game has not been signed in yet');
    }
  });
}

//Deletes the game by deleting the game id document
//Game uid and firebase user still exists, though
const resetGame = () => {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // Game is reset to waiting
      let begin = {'begin': false};
      db.collection("game").doc(user.uid).set(begin, {merge: true});
    } else {
      // No user is signed in.
      console.log('Game has not been signed in yet');
    }
  });
}

const retrievePyramid = (callback) => {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // Game is signed in.
      db.collection("game").doc(user.uid).onSnapshot(doc => {
        if (!doc.data().pyramidMap) {
          console.log('No such pyramid!');
        } else {
          //console.log('Pyramid data:', doc.data().pyramidMap);
          callback(doc.data().pyramidMap);
        }
      }, err => {
        console.log('Error getting game when retrieving pyramid', err);
      });
    } else {
      // No user is signed in.
      console.log('Game has not been signed in yet');
    }
  });
}

const retrievePlayerHand = (username, callback) => {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // Game is signed in.
      db.collection("game").doc(user.uid).onSnapshot(doc => {
        if (!doc.data().playersMap[username]) {
          console.log('No such player hand!');
        } else {
          //console.log('Player data:', doc.data().playersMap[username]);
          callback(doc.data().playersMap[username]);
        }
      }, err => {
        console.log('Error getting game when retrieving player hand', err);
      });
    } else {
      // No user is signed in.
      console.log('Game has not been signed in yet');
    }
  });
}

//returns array of player usernames
const retrievePlayers = (callback) => {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // Game is signed in.
      db.collection("game").doc(user.uid).onSnapshot(doc => {
        if (!doc.exists) {
          console.log('No such players!');
        } else if (doc.data().playersMap){
          //console.log('Player data:', Object.keys(doc.data().playersMap));
          callback(Object.keys(doc.data().playersMap));
        }
      }, err => {
        console.log('Error getting game when retrieving players', err);
      });
    } else {
      // No user is signed in.
      console.log('Game has not been signed in yet');
    }
  });
}

const beginGame = () => {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // Game is signed in.
      let begin = {'begin': true, 'firstTime': true};
      db.collection("game").doc(user.uid).set(begin, {merge: true});
    } else {
      // No user is signed in.
      console.log('Game has not been signed in yet');
    }
  });
}

const retrieveBeginGame = (callback) => {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // Game is signed in.
      db.collection("game").doc(user.uid).onSnapshot(doc => {
        if (!doc.exists) {
          console.log('No such game to begin!');
        } else {
          //console.log('Begin:', doc.data().begin);
          callback(doc.data());
        }
      }, err => {
        console.log('Error getting game when retrieving begin', err);
      });
    } else {
      // No user is signed in.
      console.log('Game has not been signed in yet');
    }
  });
}

const endGame = () => {
  firebase.auth().signOut().then(function() {
      // Sign-out successful.
      console.log('Signed out');
    }).catch(function(error) {
      // An error happened.
      console.log('no sign out',  error);
    });
}

export {resetGame, createGame, addPlayer, updatePlayerHand, updatePyramid, retrievePyramid, retrievePlayerHand, retrievePlayers, signIn, retrieveGameId, beginGame, retrieveBeginGame};