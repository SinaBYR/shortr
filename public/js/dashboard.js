const table = document.querySelector('#urls-table');

window.addEventListener('load', async () => {
  table.classList.add('loading');
  let data = await fetchUserLinks();
  renderTableRows(data);
  table.classList.remove('loading');
})

async function fetchUserLinks() {
  let response = await fetch('/api/urls');
  if(!response.ok) console.log(response.statusText);
  let result = await response.json();
  return result;
}

function renderTableRows(data) {
  const tableBody = table.querySelector('tbody');
  data.forEach(record => {
    tableBody.prepend(createTableRow(record));
  })
}

function createTableRow(shortLink) {
  let tr = document.createElement('tr');
  let td1 = document.createElement('td');
  let td2 = document.createElement('td');
  let td3 = document.createElement('td');
  let td4 = document.createElement('td');
  let td5 = document.createElement('td');
  let a1 = document.createElement('a');
  let a2 = document.createElement('a');

  td2.textContent = shortLink.url;
  td3.textContent = 'shortr.ir/' + shortLink.url_id;
  td4.textContent = 'فعال';
  a1.href = '/edit/' + shortLink.url_id;
  a1.textContent = 'تغییر';
  a2.href = '';
  a2.role = 'button';
  a2.onclick = async e => {
    e.preventDefault();

    table.classList.add('loading');

    let response = await fetch('/api/urls/' + shortLink.url_id, {
      method: 'DELETE'
    });

    if(!response.ok) {
      // 1. Show error
      let message = await response.json();
      console.log(message);
      return;
    }

    table.classList.remove('loading');
    tr.remove();
  }
  a2.textContent = 'حذف';
  a2.style.marginRight = '1rem';
  td5.append(a1, a2);
  tr.append(td1, td2, td3, td4, td5);

  return tr;
}