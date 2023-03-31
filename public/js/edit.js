const CURRENT_URL_ID = location.pathname.substring(location.pathname.lastIndexOf('/') + 1);
const editContainer = document.querySelector('#edit-container');

window.addEventListener('load', fetchLink);

async function updateLink(e) {
  e.preventDefault();
  editContainer.querySelector('#edit-form-container').classList.add('loading');
  e.target.disabled = true;
  if(editContainer.firstElementChild.classList.contains('failure-feedback')) {
    editContainer.firstElementChild.remove();
  }

  let form = document.querySelector('#edit-form');
  let headers = new Headers();
  headers.append('Content-Type', 'application/json');

  try {
    let response = await fetch('/api/urls/' + CURRENT_URL_ID, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({
        urlId: form.urlId.value
      })
    });
  
    if(!response.ok) {
      const errorFeedbackDiv = document.createElement('div');
      errorFeedbackDiv.classList.add('failure-feedback');
      
      if(response.status === 409) {
        let error = await response.json();
        e.target.disabled = false;
        errorFeedbackDiv.innerHTML = error.message;
        editContainer.prepend(errorFeedbackDiv);
        return;
      }

      if(response.status === 400) {
        let errors = await response.json();
        e.target.disabled = false;
        errors.forEach(message => {
          let messageDiv = document.createElement('div');
          messageDiv.innerHTML = message;
          errorFeedbackDiv.append(messageDiv);
        })
        editContainer.prepend(errorFeedbackDiv);
        return;        
      }

      errorFeedbackDiv.innerHTML = 'مشکلی رخ داده است لطفا مجددا تلاش کنید.';
      return;
    }

    let linkData = await response.json();
    const div = document.createElement('div');
    div.classList.add('success-feedback');
    div.innerHTML = 'تغییرات با موفقیت ثبت شد';
    editContainer.prepend(div);
  
    setTimeout(() => location.href = '/edit/' + linkData.url_id, 1000);
  } catch(err) {
    e.target.disabled = false;
    console.error(err);
  }
}

async function fetchLink() {
  try {
    let response = await fetch('/api/urls/' + CURRENT_URL_ID);
    if(response.status === 404) {
      return location.href = '/dashboard';
    }
    let result = await response.json();
    renderElement(editContainer, createElements(result));
  } catch(err) {
    console.error(err);
  }
}

function renderElement(parent, children) {
  parent.prepend(...children);
}

function createElements(data) {
  let heading = document.createElement('h2');
  heading.innerHTML = data.protocol + '://' + data.original_url;
  let clickCountDiv = document.createElement('div');
  clickCountDiv.classList.add('click-count');
  let span1 = document.createElement('span');
  let span2 = document.createElement('span');
  span1.innerHTML = 'تعداد بازدید: ';
  span2.innerHTML = data.click_count;
  clickCountDiv.append(span1, span2);
  let editFormContainer = document.createElement('section');
  editFormContainer.id = 'edit-form-container';
  let editForm = document.createElement('form');
  editForm.id = 'edit-form';
  let inputWrapper = document.createElement('div');
  let label = document.createElement('label');
  let input = document.createElement('input');
  label.htmlFor = 'urlId';
  label.innerHTML = 'آدرس لینک کوتاه شده';
  input.type = 'text';
  input.name = 'urlId';
  input.id = 'urlId';
  input.value = location.pathname.substring(location.pathname.lastIndexOf('/') + 1);
  let span3 = document.createElement('span');
  span3.innerHTML = '/ shortr.ir';
  span3.style.paddingRight = '1rem';
  inputWrapper.append(label, input, span3);
  let submitButton = document.createElement('button');
  submitButton.classList.add('btn', 'primary');
  submitButton.type = 'submit';
  submitButton.innerHTML = 'ثبت';
  submitButton.addEventListener('click', updateLink);
  editForm.append(inputWrapper, submitButton);
  let dangerZoneDiv = document.createElement('div');
  dangerZoneDiv.id = 'edit-danger-zone';
  let deleteButton = document.createElement('button');
  deleteButton.classList.add('btn', 'danger');
  deleteButton.innerHTML = 'حذف لینک';
  deleteButton.addEventListener('click', async (e) => {
    editFormContainer.classList.add('loading');
    e.target.disabled = true;

    let response = await fetch('/api/urls/' + CURRENT_URL_ID, {
      method: 'DELETE'
    });

    if(!response.ok) {
      const errorFeedbackDiv = document.createElement('div');
      errorFeedbackDiv.classList.add('failure-feedback');

      if(response.status === 404) {
        e.target.disabled = false;
        editFormContainer.classList.remove('loading');
        let error = await response.json();
        errorFeedbackDiv.innerHTML = error.message;
        editContainer.prepend(errorFeedbackDiv);
        return;
      }

      errorFeedbackDiv.innerHTML = 'مشکلی رخ داده است لطفا مجددا تلاش کنید.';
      return;
    }

    document.location.href = '/dashboard';
  });
  dangerZoneDiv.append(deleteButton);
  editFormContainer.append(editForm, dangerZoneDiv);

  return [heading, clickCountDiv, editFormContainer];
}