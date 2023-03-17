const form = document.querySelector('form');

form.addEventListener('submit', createNewShortUrl);

async function createNewShortUrl(e) {
  e.preventDefault();

  let headers = new Headers();
  headers.append('Content-Type', 'application/json');

  let response = await fetch('/api/new', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      url: form.url.value
    })
  });

  if(!response.ok) {
    let errors = await response.json();
    let ul = document.querySelector('.form-errors');

    if(ul) {
      ul.innerHTML = '';
      errors.forEach(err => {
        ul.innerHTML += renderErrorLi(err);
      })
      return;
    }

    ul = document.createElement('ul');
    ul.classList.add('form-errors');
    errors.forEach(err => {
      ul.innerHTML += renderErrorLi(err);
    })
    return form.parentNode.insertBefore(ul, form);
  }

  let div = document.createElement('div');
  div.classList.add('success-feedback');
  div.innerHTML = 'لینک کوتاه جدید ساخته شد';
  form.parentNode.prepend(div);
  form.reset();
  setTimeout(() => div.remove(), 5000);
}

function renderErrorLi(message) {
  let template = `
    <li>
      <strong>${message}</strong>
    </li>
  `;

  return template;
}