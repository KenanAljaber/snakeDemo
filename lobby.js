// In-memory lobby state module for snakeDemo
// CommonJS module

const MAX_PLAYERS = 2;

// Lobby state
const players = new Map(); // key: playerId, value: { ready: boolean }

function validatePlayerId(playerId) {
  if (typeof playerId !== 'string' || playerId.trim() === '') {
    throw new TypeError('playerId must be a non-empty string');
  }
}

function joinPlayer(playerId) {
  validatePlayerId(playerId);
  if (players.has(playerId)) {
    throw new Error('Player already joined');
  }
  if (players.size >= MAX_PLAYERS) {
    throw new Error('Lobby is full');
  }
  players.set(playerId, { ready: false });
}

function leavePlayer(playerId) {
  validatePlayerId(playerId);
  players.delete(playerId); // no error if playerId not found
}

function listPlayers() {
  // return array of { playerId, ready }
  return Array.from(players, ([playerId, value]) => ({ playerId, ready: value.ready }));
}

function setReady(playerId, isReady) {
  validatePlayerId(playerId);
  if (typeof isReady !== 'boolean') {
    throw new TypeError('isReady must be a boolean');
  }
  if (players.size !== MAX_PLAYERS) {
    throw new Error('Readiness can only be set when exactly two players are in the lobby');
  }
  if (!players.has(playerId)) {
    throw new Error('Player not found in lobby');
  }
  players.get(playerId).ready = isReady;
}

module.exports = {
  joinPlayer,
  leavePlayer,
  listPlayers,
  setReady,
};
