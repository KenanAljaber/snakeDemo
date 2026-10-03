import { EventEmitter } from 'events';

export class Lobby extends EventEmitter {
  constructor() {
    super();
    this.players = new Map();
  }

  connectPlayer(id) {
    if (!this.players.has(id)) {
      this.players.set(id, { id });
      this.emit('playerConnected', id);
    }
  }

  disconnectPlayer(id) {
    if (this.players.has(id)) {
      this.players.delete(id);
      this.emit('playerDisconnected', id);
    }
  }

  getConnectedPlayers() {
    return Array.from(this.players.values());
  }

  canStartGame() {
    return this.players.size >= 2;
  }
}

export class LobbyUI {
  constructor(lobby, onStart) {
    this.lobby = lobby;
    this.onStart = onStart;
    this.playersListElement = []; // Simplified as array instead of DOM element
    this.startButtonEnabled = false;

    this.lobby.on('playerConnected', () => this.updateUI());
    this.lobby.on('playerDisconnected', () => this.updateUI());
  }

  updateUI() {
    this.playersListElement = this.lobby.getConnectedPlayers().map(p => p.id);
    this.startButtonEnabled = this.lobby.canStartGame();
  }

  startGame() {
    if (this.startButtonEnabled && this.onStart) {
      this.onStart();
    }
  }
}

export class NetworkConnection {
  constructor(lobby, playerId) {
    this.lobby = lobby;
    this.playerId = playerId;
    this.connected = false;
  }

  connect() {
    if (!this.connected) {
      this.connected = true;
      this.lobby.connectPlayer(this.playerId);
    }
  }

  disconnect() {
    if (this.connected) {
      this.connected = false;
      this.lobby.disconnectPlayer(this.playerId);
    }
  }

  isConnected() {
    return this.connected;
  }
}
