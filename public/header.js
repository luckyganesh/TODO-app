const createHeader = function () {
  const name = createElementWithContent('h1', userId);
  const logoutButton = createButton('logout');
  const logoutRef = createElement('a');
  logoutRef.href = '/logout';
  logoutRef.appendChild(logoutButton);
  const header = document.getElementById('header')
  appendChilds(header, [name, logoutRef]);
}