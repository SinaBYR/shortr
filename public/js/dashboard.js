window.addEventListener('load', async () => {
  let data = await fetchUserLinks();
  renderTableRows(data);
})

async function fetchUserLinks() {
  let response = await fetch('/api/urls');
  if(!response.ok) console.log(response.statusText);
  let result = await response.json();
  return result;
}

function renderTableRows(data) {
  const tableBody = document.querySelector('#urls-table').querySelector('tbody');
  data.forEach(record => {
    tableBody.prepend(createTableRow(record));
  })
}

function createTableRow(urlRecord) {
  let tr = document.createElement('tr');
  let td1 = document.createElement('td');
  let td2 = document.createElement('td');
  let td3 = document.createElement('td');
  let td4 = document.createElement('td');
  let td5 = document.createElement('td');
  let a1 = document.createElement('a');
  let a2 = document.createElement('a');

  td2.textContent = urlRecord.original_url;
  td3.textContent = 'shortr.ir/' + urlRecord.url_id;
  td4.textContent = 'فعال';
  a1.href = '/update_page + id_of_url';
  a1.textContent = 'تغییر';
  a2.href = '/delete_the_item';
  a2.textContent = 'حذف';
  a2.style.marginRight = '1rem';
  td5.append(a1, a2);
  tr.append(td1, td2, td3, td4, td5);

  return tr;
}