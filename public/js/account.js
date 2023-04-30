const updateUserForm = document.querySelector('#update-user-form');
const changePasswordForm = document.querySelector('#change-password-form');
const feedbackContainer = document.querySelector('#account-feedback-container');

changePasswordForm.addEventListener('submit', changePassword);
updateUserForm.addEventListener('submit', updateUser);

async function changePassword(e) {
  e.preventDefault();
  const changePasswordButton = changePasswordForm.querySelector('button');
  updateUserForm.classList.add('loading');
  changePasswordForm.classList.add('loading');
  changePasswordButton.disabled = true;
  let headers = new Headers();
  headers.append('Content-Type', 'application/json');

  let response = await fetch('/auth/me/changePassword', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      currentPassword: changePasswordForm.currentPassword.value,
      newPassword: changePasswordForm.newPassword.value
    })
  });

  if(!response.ok) {
    if(response.status === 409) {
      let error = await response.json();
      let errorDiv = document.createElement('div');
      errorDiv.classList.add('failure-feedback');
      errorDiv.textContent = error.message;
      feedbackContainer.replaceChildren(errorDiv);
      changePasswordButton.disabled = false;
      updateUserForm.classList.remove('loading');
      changePasswordForm.classList.remove('loading');
      return;
    }

    if(response.status === 400) {
      let errors = await response.json();
      let ul = document.createElement('ul');
      ul.classList.add('form-errors');
      errors.forEach(message => ul.append(renderErrorLi(message)));
      feedbackContainer.replaceChildren(ul);
      changePasswordButton.disabled = false;
      updateUserForm.classList.remove('loading');
      changePasswordForm.classList.remove('loading');
      return;
    }

    let errorDiv = document.createElement('div');
    errorDiv.classList.add('failure-feedback');
    errorDiv.textContent = 'متاسفانه درخواست شما با مشکل روبه رو شد';
    feedbackContainer.replaceChildren(errorDiv);
    changePasswordButton.disabled = false;
    updateUserForm.classList.remove('loading');
    changePasswordForm.classList.remove('loading');
    return;
  }

  let successDiv = document.createElement('div');
  successDiv.classList.add('success-feedback');
  successDiv.textContent = 'تغییرات با موفقیت ثبت شد';
  feedbackContainer.replaceChildren(successDiv);
  setTimeout(() => {
    document.location.reload();
  }, 2000);
}

async function updateUser(e) {
  e.preventDefault();
  const updateUserButton = updateUserForm.querySelector('button');
  updateUserForm.classList.add('loading');
  changePasswordForm.classList.add('loading');
  updateUserButton.disabled = true;
  let headers = new Headers();
  headers.append('Content-Type', 'application/json');

  let response = await fetch('/auth/me', {
    method: 'PUT',
    headers,
    body: JSON.stringify({
      email: updateUserForm.email.value,
      fullName: updateUserForm.fullName.value
    })
  });

  if(!response.ok) {
    if(response.status === 409) {
      let error = await response.json();
      let errorDiv = document.createElement('div');
      errorDiv.classList.add('failure-feedback');
      errorDiv.textContent = error.message;
      feedbackContainer.replaceChildren(errorDiv);
      updateUserButton.disabled = false;
      updateUserForm.classList.remove('loading');
      changePasswordForm.classList.remove('loading');
      return;
    }

    if(response.status === 400) {
      let errors = await response.json();
      let ul = document.createElement('ul');
      ul.classList.add('form-errors');
      errors.forEach(message => ul.append(renderErrorLi(message)));
      feedbackContainer.replaceChildren(ul);
      updateUserButton.disabled = false;
      updateUserForm.classList.remove('loading');
      changePasswordForm.classList.remove('loading');
      return;
    }

    let errorDiv = document.createElement('div');
    errorDiv.classList.add('failure-feedback');
    errorDiv.textContent = 'متاسفانه درخواست شما با مشکل روبه رو شد';
    feedbackContainer.replaceChildren(errorDiv);
    updateUserButton.disabled = false;
    updateUserForm.classList.remove('loading');
    changePasswordForm.classList.remove('loading');
    return;
  }

  let successDiv = document.createElement('div');
  successDiv.classList.add('success-feedback');
  successDiv.textContent = 'تغییرات با موفقیت ثبت شد';
  feedbackContainer.replaceChildren(successDiv);
  setTimeout(() => {
    document.location.reload();
  }, 2000);
}

function renderErrorLi(message) {
  let li = document.createElement('li');
  li.innerHTML = message;
  return li;
}