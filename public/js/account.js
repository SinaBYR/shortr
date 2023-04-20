const updateUserForm = document.querySelector('#update-user-form');
const updatePasswordForm = document.querySelector('#update-password-form');
const feedbackContainer = document.querySelector('#account-feedback-container');

updateUserForm.addEventListener('submit', updateUser);

async function updateUser(e) {
  e.preventDefault();
  const updateUserButton = updateUserForm.querySelector('button');
  updateUserForm.classList.add('loading');
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
    let error = await response.json();
    let errorDiv = document.createElement('div');
    errorDiv.classList.add('failure-feedback');
    errorDiv.textContent = error.message;
    feedbackContainer.replaceChildren(errorDiv);
    updateUserButton.disabled = false;
    updateUserForm.classList.remove('loading');
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