class Users {
  constructor(){
    this.users = [];
  }
  addUser(user){
    this.users.push(user);
  }
}

class cookies {
  constructor(){
    this.cookies = [];
  }
  addCookie(cookie){
    this.cookies.push(cookie);
  }
  isIncludes(cookie){
    return this.cookies.includes(cookie);
  }
  deleteCookie(cookie){
    
  }
}