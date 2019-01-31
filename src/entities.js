const deleteElement = function (todo, index) {
  return todo.slice(0, index).concat(todo.slice(index + 1));
}

class Task {
  constructor(id, status, content) {
    this.id = id;
    this.status = status;
    this.content = content;
  }

  getTask() {
    let { id, status, content } = this;
    return { id, status, content };
  }

  toggleStatus() {
    this.status = !this.status;
  }

  modifyContent(newContent) {
    this.content = newContent;
  }

  isSameTask(taskId) {
    return this.id == taskId;
  }
}

class Tasks {
  constructor() {
    this.tasks = [];
  }

  isTaskPresent(taskId) {
    return this.tasks.some(task => task.isSame(taskId));
  }

  getTask(taskId) {
    return this.tasks.find(task => task.isSameTask(taskId));
  }

  getTasks() {
    return this.tasks;
  }

  getTaskIndex(taskId) {
    return this.tasks.findIndex(task => task.isSameTask(taskId));
  }

  modifyTaskContent(taskId, newContent) {
    let task = this.getTask(taskId);
    task.modifyContent(newContent);
  }

  addTask(task) {
    this.tasks.push(task)
  }

  deleteTask(taskId) {
    let taskIndex = this.getTaskIndex(taskId);
    this.tasks = deleteElement(this.tasks, taskIndex);
  }

  toggleTaskStatus(taskId) {
    let task = this.getTask(taskId);
    task.toggleStatus();
  }
}

class Todo {
  constructor(details, tasks) {
    this.details = details
    this.tasks = tasks;
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
    let { details, tasks } = this;
    return { details, tasks: tasks.getTasks() };
  }

  isTaskPresent(taskId) {
    return this.tasks.some(task => task.isSame(taskId));
  }

  getTask(taskId) {
    this.tasks.getTask(taskId);
  }

  getTasks() {
    return this.tasks.getTasks();
  }

  modifyTaskContent(taskId, newContent) {
    this.tasks.modifyTaskContent(taskId, newContent);
  }

  addTask(task) {
    this.tasks.addTask(task);
  }

  deleteTask(taskId) {
    this.tasks.deleteTask(taskId);
  }

  toggleTaskStatus(taskId) {
    this.tasks.toggleTaskStatus(taskId);
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

  isTaskPresent(todoId, taskId) {
    if (!this.isTodoPresent(todoId)) return false;
    let todo = this.getTodo(todoId);
    return todo.isTaskPresent(taskId);
  }

  getTask(todoId, taskId) {
    let todo = this.getTodo(todoId);
    return todo.getTask(taskId);
  }

  getTasks(todoId) {
    let todo = this.getTodo(todoId);
    return todo.getTasks();
  }

  modifyTodoTaskContent(todoId, taskId, newContent) {
    let todo = this.getTodo(todoId);
    todo.modifyTaskContent(taskId, newContent);
  }

  addTaskToTodo(todoId, task) {
    let todo = this.getTodo(todoId);
    todo.addTask(task);
  }

  deleteTaskInTodo(todoId, taskId) {
    let todo = this.getTodo(todoId);
    todo.deleteTask(taskId);
  }

  toggleTodoTaskStatus(todoId, taskId) {
    let todo = this.getTodo(todoId);
    todo.toggleTaskStatus(taskId);
  }
}

class User {
  constructor(details, todos) {
    this.details = details;
    this.todos = todos;
  }

  getId() {
    return this.details.getId();
  }

  isSameId(userId) {
    return this.details.isSameId(userId);
  }

  isSameUser(id, password) {
    return this.details.isSameUser(id, password);
  }

  getUserDetails() {
    return this.details.getDetails();
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

  isTaskPresent(todoId, taskId) {
    return this.todos.isTaskPresent(todoId, taskId);
  }

  getTask(todoId, taskId) {
    return this.todos.getTask(todoId, taskId);
  }

  getTasks(todoId) {
    return this.todos.getTasks(todoId);
  }

  modifyTodoTaskContent(todoId, taskId, newContent) {
    this.todos.modifyTodoTaskContent(todoId, taskId, newContent);
  }

  addTaskToTodo(todoId, task) {
    this.todos.addTaskToTodo(todoId, task);
  }

  deleteTaskInTodo(todoId, taskId) {
    this.todos.deleteTaskInTodo(todoId, taskId);
  }

  toggleTodoTaskStatus(todoId, taskId) {
    this.todos.toggleTodoTaskStatus(todoId, taskId);
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
  getId() {
    return this.id;
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
    return this.users.find(user => user.isSameId(userId));
  }
  getUserDetail(userId) {
    return this.getUser(userId).getUserDetails();
  }
  isAlreadyPresent(userId) {
    return this.users.some(user => user.isSameId(userId));
  }
  validateUser(userId, password) {
    return this.users.some(user => user.isSameId(userId, password));
  }
}


module.exports = {
  Task,
  Tasks,
  Todo,
  Todos,
  User,
  UserDetail,
  Users
}