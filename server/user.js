module.exports = class User {
  constructor() {
    this.users = [];
  }

  getUsers(room) {
    return this
            .users
            .filter(u => u.room === room)
            .map(u => u.username);
  }

  getRooms() {
    return this
            .users
            .map(u => u.room);
  }

  getUser(id) {
    return this.users.filter(u => u.id === id)[0];
  }

  addUser(id, username, room) {
    if (id && username && room) {
      const userObj = { id, username, room };
      this.users.push(userObj);
      return userObj;
    }
    return {};
  }

  removeUser(id) {
    const user = this.getUser(id);

    if (user) {
      this.users = this.users.filter(u => u.id !== id);
    }

    return user;
  }

  isUsernameTaken(username) {
    const existingUser = this.users.filter(u => u.username === username)[0];
    if (existingUser) {
      return true;
    }
    return false;
  }
};
