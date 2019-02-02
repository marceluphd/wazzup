export interface IUser {
  id: string;
  username: string;
  room: string;
}

export default class User {
  constructor(public users: IUser[] = []) {}

  public getUsers(room: string): Array<IUser['username']> {
    return this.users.filter(u => u.room === room).map(u => u.username);
  }

  public getRooms(): Array<IUser['room']> {
    return this.users.map(u => u.room);
  }

  public getUser(id: string): IUser {
    return this.users.filter(u => u.id === id)[0];
  }

  public addUser(id: string, username: string, room: string): IUser | object {
    if (id && username && room) {
      const userObj = { id, username, room };
      this.users.push(userObj);
      return userObj;
    }
    return {};
  }

  public removeUser(id: string): IUser {
    const user = this.getUser(id);

    if (user) {
      this.users = this.users.filter(u => u.id !== id);
    }

    return user;
  }

  public isUsernameTaken(username: string): boolean {
    const existingUser = this.users.filter(u => u.username === username)[0];
    if (existingUser) {
      return true;
    }
    return false;
  }
}
