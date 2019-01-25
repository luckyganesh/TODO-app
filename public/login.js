const verifyUser = function(){
  const form = document.getElementById('form');
  let properties = ['id','password'];
  if(isInvalid(properties,form)){
    return ;
  }
  let details = getFormData(properties,form);
  fetch('/login',{
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
    form.onsubmit = null;
    form.method = "POST";
    form.action = "/getCookie";
    form.submit();
    return;
  })
}