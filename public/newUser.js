const addUser = function () {
  const form = document.getElementById('form');
  let properties = ['name', 'id', 'password'];
  if (isInvalid(properties, form)) {
    console.log('inValid');
    return;
  }
  let details = getFormData(properties, form);
  fetch('/createNewUser', {
    method: 'POST',
    body: JSON.stringify(details)
  }).then(res => {
    return res.json();
  }).then(data => {
    if (data.status == 0) {
      document.getElementById('error').style.visibility = 'visible';
      form.id.value = "";
      return;
    }
    form.reset();
    document.getElementById('error').style.visibility = 'hidden';
    return;
  })
}