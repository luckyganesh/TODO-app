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
    let message = document.getElementById('message');
    if (data.status == 1) {
      message.innerText = 'sorry already existing user id';
      message.className = 'red';
      form.id.value = "";
      return;
    }
    form.reset();
    message.innerText = 'Your Account Created Successfully';
    message.className = 'green';
    return;
  })
}