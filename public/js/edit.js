const editContainer = document.querySelector('#edit-container');

window.addEventListener('load', fetchLink);

async function fetchLink() {
  let urlId = location.pathname.substring(location.pathname.lastIndexOf('/') + 1);

  let response = await fetch('/api/urls/' + urlId);
  let result = await response.json();
  console.log(result);
  renderElement(editContainer, createElements(result));
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
  span1.innerHTML = 'تعداد کلیک: ';
  span2.innerHTML = data.click_count;
  clickCountDiv.append(span1, span2);
  let editFormContainer = document.createElement('section');
  editFormContainer.id = 'edit-form-container';
  let editForm = document.createElement('form');
  editForm.id = 'edit-form';
  let inputWrapper = document.createElement('div');
  let label = document.createElement('label');
  let input = document.createElement('input');
  label.htmlFor = 'url';
  label.innerHTML = 'آدرس لینک کوتاه شده';
  input.type = 'text';
  input.name = 'url';
  input.id = 'url';
  input.value = location.pathname.substring(location.pathname.lastIndexOf('/') + 1);
  let span3 = document.createElement('span');
  span3.innerHTML = '/ shortr.ir';
  span3.style.paddingRight = '1rem';
  inputWrapper.append(label, input, span3);
  let button = document.createElement('button');
  button.classList.add('btn', 'primary');
  button.type = 'submit';
  button.innerHTML = 'ثبت';
  editForm.append(inputWrapper, button);
  editFormContainer.append(editForm);

  return [heading, clickCountDiv, editFormContainer];
}