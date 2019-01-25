const isEmpty = function(value){
  return value == "";
}
const isInvalid = function (form) {
  let properties = ['name','id','password'];
  return properties.some(property => isEmpty(form[property]['value']))
}

const uploadData = function(form,object,property){
  object[property] = form[property]['value'];
  return object;
}

const getFormData = function(form){
  let properties = ['name','id','password'];
  return properties.reduce(uploadData.bind(null,form),{})
}

const addUser = function(){
  const form = document.getElementById('form');
  if(isInvalid(form)){
    console.log('inValid');
    return ;
  }
  let details = getFormData(form);
  fetch('/upload',{
    method:'POST',
    body: JSON.stringify(details)
  }).then(res => {
    return res.json();
  }).then(data => {
    if(data.status == 0){
      document.getElementById('error').style.visibility = 'visible';
      form.id.value = "";
      return ;
    }
    form.reset();
    document.getElementById('error').style.visibility = 'hidden';
    return ;
  })
}