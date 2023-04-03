const CURRENT_URL_ID = location.pathname.substring(location.pathname.lastIndexOf('/') + 1);
const editContainer = document.querySelector('#edit-container');

window.addEventListener('load', fetchLink);

async function updateLink(e) {
  e.preventDefault();
  let editFormWrapper = editContainer.querySelector('#edit-form-wrapper');
  let dangerZone = editContainer.querySelector('#danger-zone');
  editFormWrapper.classList.add('loading');
  dangerZone.classList.add('loading');
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
        editFormWrapper.classList.remove('loading');
        dangerZone.classList.remove('loading');
        e.target.disabled = false;
        errorFeedbackDiv.innerHTML = error.message;
        editContainer.prepend(errorFeedbackDiv);
        return;
      }

      if(response.status === 400) {
        let errors = await response.json();
        editFormWrapper.classList.remove('loading');
        dangerZone.classList.remove('loading');
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
    editFormWrapper.classList.remove('loading');
    dangerZone.classList.remove('loading');
    e.target.disabled = false;
    console.error(err);
  }
}

async function fetchLink() {
  if(!CURRENT_URL_ID) {
    return document.location.href = '/dashboard';
  }

  try {
    let response = await fetch('/api/urls/' + CURRENT_URL_ID);
    if(response.status === 404) {
      return document.location.href = '/dashboard';
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
  let header = document.createElement('header');
  header.id = 'edit-header';
  let heading = document.createElement('h2');
  heading.textContent = data.protocol + '://' + data.original_url;
  let linkActivationStateDiv = document.createElement('div');
  let linkActivationStateSpan = document.createElement('span');
  linkActivationStateSpan.textContent = data.is_active ? 'فعال' : 'غیرفعال';
  linkActivationStateDiv.append(linkActivationStateSpan);
  header.append(heading, linkActivationStateDiv);

  let stasticsDiv = document.createElement('section');
  let stasticsTopSegment = document.createElement('div');
  stasticsTopSegment.classList.add('top-segment');
  let stasticsHeading = document.createElement('h4');
  stasticsHeading.textContent = 'آمار لینک';
  let stasticsIcon = document.createElement('i');
  stasticsIcon.classList.add('fa-solid', 'fa-chart-pie');
  stasticsTopSegment.append(stasticsIcon, stasticsHeading);
  let stasticsBottomSegment = document.createElement('div');
  stasticsBottomSegment.classList.add('bottom-segment');
  let clickCountDiv = document.createElement('div');
  clickCountDiv.classList.add('click-count');
  let span1 = document.createElement('span');
  let span2 = document.createElement('span');
  span1.textContent = 'تعداد بازدید: ';
  span2.textContent = data.click_count;
  clickCountDiv.append(span1, span2);
  stasticsBottomSegment.append(clickCountDiv);
  stasticsDiv.append(stasticsTopSegment, stasticsBottomSegment);

  let editFormWrapper = document.createElement('section');
  editFormWrapper.id = 'edit-form-wrapper';
  let editFormTopSegment = document.createElement('div');
  editFormTopSegment.classList.add('top-segment');
  let editFormIcon = document.createElement('i');
  editFormIcon.classList.add('fa-solid', 'fa-circle-info');
  let editFormHeading = document.createElement('h4');
  editFormHeading.textContent = 'اطلاعات لینک';
  editFormTopSegment.append(editFormIcon, editFormHeading);
  let editFormBottomSegment = document.createElement('div');
  editFormBottomSegment.classList.add('bottom-segment');
  let editForm = document.createElement('form');
  editForm.id = 'edit-form';
  let inputWrapper = document.createElement('div');
  let label = document.createElement('label');
  let input = document.createElement('input');
  label.htmlFor = 'urlId';
  label.textContent = 'مشخصه لینک';
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
  editFormBottomSegment.append(editForm);
  editFormWrapper.append(editFormTopSegment, editFormBottomSegment);

  let dangerZoneDiv = document.createElement('section');
  dangerZoneDiv.id = 'danger-zone';
  let deactivateWrapper = document.createElement('div');
  deactivateWrapper.classList.add('danger-item');
  let deactivateButton = document.createElement('button');
  deactivateButton.classList.add('btn', 'danger');
  deactivateButton.textContent = data.is_active ? 'غیرفعال کردن لینک' : 'فعالسازی لینک';
  deactivateButton.addEventListener('click', async (e) => {
    editFormWrapper.classList.add('loading');
    dangerZoneDiv.classList.add('loading');
    e.target.disabled = true;

    let response = await fetch('/api/urls/' + CURRENT_URL_ID + '/switchActivationState', {
      method: 'POST'
    });

    // 1. Proper error handling on both client and server side.
    if(!response.ok) {
      errorFeedbackDiv.innerHTML = 'مشکلی رخ داده است لطفا مجددا تلاش کنید.';
      return;
    }

    // document.location.href = '/dashboard';
    document.location.reload();
  });
  let deactivateNote = document.createElement('span');
  deactivateNote.style.display = 'block';
  deactivateNote.style.fontSize = '0.8rem';
  deactivateNote.textContent = 'توجه: در صورت غیرفعال کردن لینک میتوانید مجددا آن را به حالت فعال برگردانید.';
  deactivateWrapper.append(deactivateButton, deactivateNote);

  let deleteWrapper = document.createElement('div');
  deleteWrapper.classList.add('danger-item');
  let deleteButton = document.createElement('button');
  deleteButton.classList.add('btn', 'danger');
  deleteButton.textContent = 'حذف لینک';
  deleteButton.addEventListener('click', async (e) => {
    editFormWrapper.classList.add('loading');
    dangerZoneDiv.classList.add('loading');
    e.target.disabled = true;

    let response = await fetch('/api/urls/' + CURRENT_URL_ID, {
      method: 'DELETE'
    });

    if(!response.ok) {
      const errorFeedbackDiv = document.createElement('div');
      errorFeedbackDiv.classList.add('failure-feedback');

      if(response.status === 404) {
        e.target.disabled = false;
        editFormWrapper.classList.remove('loading');
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
  let deleteNote = document.createElement('span');
  deleteNote.style.display = 'block';
  deleteNote.style.fontSize = '0.8rem';
  deleteNote.textContent = 'توجه: با حذف لینک امکان برگرداندن آن وجود نخواهد داشت. شما همچنین می توانید لینک موردنظر را موقتا غیرفعال نمایید.';
  deleteWrapper.append(deleteButton, deleteNote);

  dangerZoneDiv.append(deactivateWrapper, deleteWrapper);

  return [header, stasticsDiv, editFormWrapper, dangerZoneDiv];
}