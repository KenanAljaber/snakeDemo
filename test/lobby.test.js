const test = require('node:test');
const assert = require('node:assert/strict');
const lobby = require('../lobby.js');

const { joinPlayer, leavePlayer, listPlayers, setReady } = lobby;

test('joinPlayer rejects non-string or empty playerId', () => {
  assert.throws(() => joinPlayer(null), { name: 'TypeError' });
  assert.throws(() => joinPlayer(''), { name: 'TypeError' });
  assert.throws(() => joinPlayer(5), { name: 'TypeError' });
  assert.throws(() => joinPlayer('   '), { name: 'TypeError' });
});

test('joinPlayer can add players and rejects duplicates and overcapacity', () => {
  // clear state to start fresh
  listPlayers().forEach(p => leavePlayer(p.playerId));

  joinPlayer('alice');
  joinPlayer('bob');

  // duplicate join
  assert.throws(() => joinPlayer('alice'), /Player already joined/);

  // over capacity
  assert.throws(() => joinPlayer('charlie'), /Lobby is full/);

  const players = listPlayers();
  assert.deepEqual(players, [
    { playerId: 'alice', ready: false },
    { playerId: 'bob', ready: false },
  ]);
});

test('leavePlayer removes player; no error if player not found', () => {
  // Clear lobby again
  listPlayers().forEach(p => leavePlayer(p.playerId));

  joinPlayer('dave');
  joinPlayer('ellen');

  leavePlayer('dave');
  assert.deepEqual(listPlayers(), [ { playerId: 'ellen', ready: false } ]);

  // leaving non-existent
  assert.doesNotThrow(() => leavePlayer('nonexistent'));
  // leaving after already removed
  leavePlayer('dave');
});

test('setReady toggles readiness only with exactly two players', () => {
  // Clear lobby
  listPlayers().forEach(p => leavePlayer(p.playerId));

  joinPlayer('fiona');

  assert.throws(() => setReady('fiona', true), /exactly two players/);

  joinPlayer('george');

  // Non-boolean isReady
  assert.throws(() => setReady('fiona', 'yes'), { name: 'TypeError' });

  // Player not in lobby
  assert.throws(() => setReady('ghost', true), /Player not found/);

  setReady('fiona', true);
  setReady('george', false);

  let players = listPlayers();
  assert.deepEqual(players.find(p => p.playerId === 'fiona').ready, true);
  assert.deepEqual(players.find(p => p.playerId === 'george').ready, false);

  // Remove one player, then setReady should fail
  leavePlayer('fiona');
  assert.throws(() => setReady('george', true), /exactly two players/);
});

test('listPlayers returns correct player states', () => {
  // Clean and setup
  listPlayers().forEach(p => leavePlayer(p.playerId));
  joinPlayer('hank');
  joinPlayer('irene');

  setReady('hank', true);
  setReady('irene', true);

  const players = listPlayers();
  assert.deepEqual(players, [
    { playerId: 'hank', ready: true },
    { playerId: 'irene', ready: true },
  ]);
});
