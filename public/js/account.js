const updateUserForm = document.querySelector('#update-user-form');
const updatePasswordForm = document.querySelector('#update-password-form');
const feedbackContainer = document.querySelector('#account-feedback-container');

updateUserForm.addEventListener('submit', updateUser);

async function updateUser(e) {
  e.preventDefault();
  const updateUserButton = updateUserForm.querySelector('button');
  updateUserForm.classList.add('loading');
  updatePasswordForm.classList.add('loading');
  updateUserButton.disabled = true;
  let headers = new Headers();
  headers.append('Content-Type', 'application/json');

  let response = await fetch('/api/me', {
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
      updatePasswordForm.classList.remove('loading');
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
      updatePasswordForm.classList.remove('loading');
      return;
    }

    let errorDiv = document.createElement('div');
    errorDiv.classList.add('failure-feedback');
    errorDiv.textContent = 'متاسفانه درخواست شما با مشکل روبه رو شد';
    feedbackContainer.replaceChildren(errorDiv);
    updateUserButton.disabled = false;
    updateUserForm.classList.remove('loading');
    updatePasswordForm.classList.remove('loading');
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