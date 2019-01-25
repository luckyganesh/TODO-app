class UserDetail {
  constructor({id, name, password}) {
    this.id = id;
    this.name = name;
    this.password = password;
  }
  isSameId(id) {
    return this.id == id;
  }
  isSameUser(id, password) {
    return this.id == id && this.password == password;
  }
}

const isSameUser = function(userId,user){
  return user.isSameId(userId)
}

class AllUsersDetail {
  constructor() {
    this.users = [];
  }
  addUser(user) {
    this.users.push(user);
  }
  getUserDetail(userId) {
    return this.users.find(isSameUser.bind(null,userId));
  }
  isAlreadyPresent(userId) {
    return this.users.some(isSameUser.bind(null,userId));
  }
  validateUser(userId,password){
    return this.users.some(user => user.isSameUser(userId,password));
  }
}

module.exports = {
  AllUsersDetail,
  UserDetail
}