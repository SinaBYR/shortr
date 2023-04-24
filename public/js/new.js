const form = document.querySelector('form');
const feedbackContainer = document.querySelector('#new-feedback-container');

form.addEventListener('submit', createNewShortUrl);

async function createNewShortUrl(e) {
  e.preventDefault();
  let headers = new Headers();
  headers.append('Content-Type', 'application/json');

  let response = await fetch('/api/new', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      url: form.url.value,
      protocol: form.protocol.value
    })
  });

  if(!response.ok) {
    let errors = await response.json();
    let ul = document.createElement('ul');
    ul.classList.add('form-errors');
    errors.forEach(message => ul.append(renderErrorLi(message)));
    feedbackContainer.replaceChildren(ul);
    return;
  }

  let newRecord = await response.json();
  let div = document.createElement('div');
  div.classList.add('success-feedback');
  let span = document.createElement('span');
  span.textContent = 'لینک کوتاه با موفقیت ساخته شد';
  let anchor = document.createElement('a');
  anchor.style.marginRight = '1rem';
  anchor.textContent = 'مشاهده';
  anchor.href = '/edit/' + newRecord.url_id;
  div.append(span, anchor);
  feedbackContainer.replaceChildren(div);
  form.reset();
}

function renderErrorLi(message) {
  let li = document.createElement('li');
  li.textContent = message;
  return li;
}