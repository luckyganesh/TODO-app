const deleteElement = function (todo, index) {
  return todo.slice(0, index).concat(todo.slice(index + 1));
}

class Item {
  constructor(id, status, content) {
    this.id = id;
    this.status = status;
    this.content = content;
  }

  getItem() {
    let { id, status, content } = this;
    return { id, status, content };
  }

  toggleStatus() {
    this.status = !this.status;
  }

  modifyContent(newContent) {
    this.content = newContent;
  }

  isSameItem(itemId) {
    return this.id == itemId;
  }
}

class Items {
  constructor() {
    this.items = [];
  }

  isItemPresent(itemId) {
    return this.items.some(item => item.isSame(itemId));
  }

  getItem(itemId) {
    return this.items.find(item => item.isSameItem(itemId));
  }

  getItems() {
    return this.items;
  }

  getItemIndex(itemId) {
    return this.items.findIndex(item => item.isSameItem(itemId));
  }

  modifyItemContent(itemId, newContent) {
    let item = this.getItem(itemId);
    item.modifyContent(newContent);
  }

  addItem(item) {
    this.items.push(item)
  }

  deleteItem(itemId) {
    let itemIndex = this.getItemIndex(itemId);
    this.items = deleteElement(this.items, itemIndex);
  }

  toggleItemStatus(itemId) {
    let item = this.getItem(itemId);
    item.toggleStatus();
  }
}

class Todo {
  constructor(details, items) {
    this.details = details
    this.items = items;
  }

  isSameTodo(todoId) {
    return this.details.id == todoId;
  }

  getDetails() {
    return this.details;
  }

  modifyDetails(newTitle, newDescription) {
    this.details.title = newTitle;
    this.details.description = newDescription;
  }

  getTodo() {
    let { details, items } = this;
    return { details, items: items.getItems() };
  }

  isItemPresent(itemId) {
    return this.items.some(item => item.isSame(itemId));
  }

  getItem(itemId) {
    this.items.getItem(itemId);
  }

  getItems() {
    return this.items.getItems();
  }

  modifyItemContent(itemId, newContent) {
    this.items.modifyItemContent(itemId, newContent);
  }

  addItem(item) {
    this.items.addItem(item);
  }

  deleteItem(itemId) {
    this.items.deleteItem(itemId);
  }

  toggleItemStatus(itemId) {
    this.items.toggleItemStatus(itemId);
  }
}

class Todos {
  constructor() {
    this.todos = [];
  }

  isTodoPresent(todoId) {
    return this.todos.some(todo => todo.isSameTodo(todoId));
  }

  getNewTodoId() {
    return this.todos.length + 1;
  }

  getTodo(todoId) {
    return this.todos.find(todo => todo.isSameTodo(todoId));
  }

  modifyTodoDetails(todoId, { newTitle, newDescription }) {
    const todo = this.getTodo(todoId);
    todo.modifyDetails(newTitle, newDescription);
  }

  getTodoJson(todoId) {
    return this.getTodo(todoId).getTodo()
  }

  getTodos() {
    return this.todos;
  }

  getTodosDetails() {
    return this.todos.map(todo => todo.getDetails());
  }

  getTodoDetails(todoId) {
    const todo = this.getTodo(todoId);
    return todo.getDetails();
  }

  getTodoIndex(todoId) {
    return this.todos.findIndex(todo => todo.isSameTodo(todoId));
  }

  addTodo(todo) {
    this.todos.push(todo);
  }

  deleteTodo(todoId) {
    console.log(todoId);
    let index = this.getTodoIndex(todoId);
    this.todos = deleteElement(this.todos, index);
  }

  isItemPresent(todoId, itemId) {
    if (!this.isTodoPresent(todoId)) return false;
    let todo = this.getTodo(todoId);
    return todo.isItemPresent(itemId);
  }

  getItem(todoId, itemId) {
    let todo = this.getTodo(todoId);
    return todo.getItem(itemId);
  }

  getItems(todoId) {
    let todo = this.getTodo(todoId);
    return todo.getItems();
  }

  modifyTodoItemContent(todoId, itemId, newContent) {
    let todo = this.getTodo(todoId);
    todo.modifyItemContent(itemId, newContent);
  }

  addItemToTodo(todoId, item) {
    let todo = this.getTodo(todoId);
    todo.addItem(item);
  }

  deleteItemInTodo(todoId, itemId) {
    let todo = this.getTodo(todoId);
    todo.deleteItem(itemId);
  }

  toggleTodoItemStatus(todoId, itemId) {
    let todo = this.getTodo(todoId);
    todo.toggleItemStatus(itemId);
  }
}

class User {
  constructor(details, todos) {
    this.details = details;
    this.todos = todos;
  }

  isSameUser(userId) {
    return this.details.id === userId;
  }

  isTodoPresent(todoId) {
    return this.todos.isTodoPresent(todoId);
  }

  getTodo(todoId) {
    return this.todos.getTodo(todoId);
  }

  getTodoJson(todoId) {
    return this.todos.getTodoJson(todoId);
  }

  getTodos() {
    return this.todos.getTodos();
  }

  getTodosDetails() {
    return this.todos.getTodosDetails();
  }

  getTodoDetails(todoId) {
    return this.todos.getTodoDetails(todoId);
  }

  getTodoIndex(todoId) {
    return this.todos.getTodoIndex(todoId);
  }

  addTodo(todo) {
    this.todos.addTodo(todo);
  }

  deleteTodo(todoId) {
    this.todos.deleteTodo(todoId);
  }

  isItemPresent(todoId, itemId) {
    return this.todos.isItemPresent(todoId, itemId);
  }

  getItem(todoId, itemId) {
    return this.todos.getItem(todoId, itemId);
  }

  getItems(todoId) {
    return this.todos.getItems(todoId);
  }

  modifyTodoItemContent(todoId, itemId, newContent) {
    this.todos.modifyTodoItemContent(todoId, itemId, newContent);
  }

  addItemToTodo(todoId, item) {
    this.todos.addItemToTodo(todoId, item);
  }

  deleteItemInTodo(todoId, itemId) {
    this.todos.deleteItemInTodo(todoId, itemId);
  }

  toggleTodoItemStatus(todoId, itemId) {
    this.todos.toggleTodoItemStatus(todoId, itemId);
  }

  modifyTodoDetails(todoId, details) {
    this.todos.modifyTodoDetails(todoId, details);
  }

  getNewTodoId() {
    return this.todos.getNewTodoId();
  }
}

class UserDetail {
  constructor({ id, name, password }) {
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

const isSameUser = function (userId, user) {
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
    return this.users.find(isSameUser.bind(null, userId));
  }
  isAlreadyPresent(userId) {
    return this.users.some(isSameUser.bind(null, userId));
  }
  validateUser(userId, password) {
    return this.users.some(user => user.isSameUser(userId, password));
  }
}

class Users {
  constructor() {
    this.users = [];
  }
  addUser(user) {
    this.users.push(user);
  }
  getUser(userId) {
    return this.users.find(user => user.isSameUser(userId));
  }
}


module.exports = {
  Item,
  Items,
  Todo,
  Todos,
  User,
  AllUsersDetail,
  UserDetail,
  Users
}