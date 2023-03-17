const form = document.querySelector('form');
const feedbackContainer = document.querySelector('#feedback-container');

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
  span.innerHTML = 'لینک کوتاه با موفقیت ساخته شد';
  let anchor = document.querySelector('a');
  anchor.style.marginRight = '1rem';
  anchor.innerHTML = 'مشاهده';
  anchor.href = newRecord.url_id;
  div.append(span, anchor);
  feedbackContainer.replaceChildren(div);
  form.reset();
}

function renderErrorLi(message) {
  let li = document.createElement('li');
  li.innerHTML = message;
  return li;
}