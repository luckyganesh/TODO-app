const isEmpty = function(value){
  return value == "";
}

const isInvalid = function (properties,form) {
  return properties.some(property => isEmpty(form[property]['value']))
}

const getValue = function(form,object,property){
  object[property] = form[property]['value'];
  return object;
}

const getFormData = function(properties,form){
  return properties.reduce(getValue.bind(null,form),{})
}