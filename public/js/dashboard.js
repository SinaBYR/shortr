const table = document.querySelector('#links-table');

window.addEventListener('load', async () => {
  try {
    table.classList.add('loading');
    let data = await fetchUserLinks();
    renderTableRows(data);
    table.classList.remove('loading');
  } catch(err) {
    const dashboardContainer = table.parentElement.parentElement;
    table.remove();
    let errorContainer = document.createElement('div');
    errorContainer.classList.add('failure-feedback');
    errorContainer.style.margin = '1rem auto';
    errorContainer.style.maxWidth = '780px';
    let errorHeading = document.createElement('h2');
    errorHeading.style.textAlign = 'center';
    errorHeading.textContent = err.message;
    errorContainer.append(errorHeading);
    dashboardContainer.replaceWith(errorContainer);  
  }
})

async function fetchUserLinks() {  
  let response = await fetch('/api/links');
  // errors will be handled inside load event handler of this page.
  if(!response.ok) {
    if(response.status === 500) {
      throw new Error('متاسفانه مشکلی در سرور رخ داده است. لطفا بعدا دوباره امتحان کنید.');
    }

    throw new Error('متاسفانه مشکلی رخ داده است. لطفا بعدا دوباره امتحان کنید.');
  };
  let result = await response.json();
  return result;
}

function renderTableRows(data) {
  if(!data.length) {
    const tableContainer = table.parentElement;
    let div = document.createElement('div');
    div.classList.add('empty-table-indicator'); 
    div.textContent = 'لینکی برای نمایش وجود ندارد';
    return tableContainer.append(div);
  }

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
  td4.textContent = shortLink.is_active ? 'فعال' : 'غیرفعال';
  editLink.href = '/edit/' + shortLink.url_id;
  editLink.textContent = 'تغییر';
  td5.append(editLink);
  tr.append(td1, td2, td3, td4, td5);

  return tr;
}