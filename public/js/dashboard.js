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
  let editLink = document.createElement('a');

  td2.textContent = shortLink.url;
  td3.textContent = 'shortr.ir/' + shortLink.url_id;
  td4.textContent = 'فعال';
  editLink.href = '/edit/' + shortLink.url_id;
  editLink.textContent = 'تغییر';
  td5.append(editLink);
  tr.append(td1, td2, td3, td4, td5);

  return tr;
}