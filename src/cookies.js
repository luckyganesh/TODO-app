class Cookie {
  constructor({id,userId}){
    this.id = id;
    this.userId = userId;
  }
  isSame(id){
    return this.id == id
  }
}

const deleteElement = function(list,index){
  return list.slice(0,index).concat(list.slice(index+1));
}

class Cookies {
  constructor(){
    this.cookies = [];
  }
  getCookies(){
    return this.cookies;
  }
  addCookie(cookie){
    this.cookies.push(cookie);
  }
  isPresent(id){
    return this.cookies.some(cookie => cookie.isSame(id));
  }
  deleteCookie(cookieId){
    let index = this.cookies.findIndex(cookie => cookie.isSame(cookieId));
    if(index < 0) return ;
    this.cookies = deleteElement(this.cookies,index);
  }
}

module.exports ={
  Cookie,
  Cookies
}