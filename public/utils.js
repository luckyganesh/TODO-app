const isEmpty = function (value) {
  return value == "";
}

const isInvalid = function (properties, form) {
  return properties.some(property => isEmpty(form[property]['value']))
}

const getValue = function (form, object, property) {
  object[property] = form[property]['value'];
  return object;
}

const getFormData = function (properties, form) {
  return properties.reduce(getValue.bind(null, form), {})
}

const createElement = tag => document.createElement(tag);

const createTag = function (tag, content) {
  const element = createElement(tag);
  element.innerText = content;
  return element;
}

const createButton = function (innerText) {
  const button = createTag('button', innerText);
  return button;
}

const placeElements = function (tag, attributes) {
  Object.keys(attributes).forEach(attribute => tag[attribute] = attributes[attribute]);
}

const getElementOfId = id => document.getElementById(id);

const createElementWithId = function (tag, id) {
  const element = createElement(tag);
  placeElements(element, { id })
  return element;
}

const createElementWithContent = function (tag, innerText) {
  const element = createElement(tag);
  placeElements(element, { innerText })
  return element;
}

const createElementWithNameAndValue = function (tag, name, value) {
  const element = createElement(tag);
  placeElements(element, { name, value });
  return element;
}

const appendChilds = function (tag, children) {
  children.forEach(child => tag.appendChild(child));
}

const placeAttribute = function (attribute, elements, value) {
  elements.forEach(element => element[attribute] = value);
}
