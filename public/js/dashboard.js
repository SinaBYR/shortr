const profileButton = document.querySelector('.navigation-profile-button');
const profileDropdown = document.querySelector('.navigation-profile-dropdown');
const expandChevron = document.querySelector('.expand-chevron');

profileButton.addEventListener('click', () => {
  expandChevron.classList.toggle('fa-chevron-down');
  expandChevron.classList.toggle('fa-chevron-up');
  profileDropdown.classList.toggle('hidden');
})

const table = document.querySelector('#urls-table');
window.addEventListener('load', async e => {
  let response = await fetch('/api/urls');
  if(!response.ok) console.log(response.statusText);
  let result = await response.json();
  result.forEach(record => {
    table.innerHTML += renderRowTemplate(record);
  })
})

function renderRowTemplate(urlRecord) {
  let template = `
    <tr>
      <td></td>
      <td>${urlRecord.original_url}</td>
      <td>shortr.ir/${urlRecord.url_id}</td>
      <td>فعال</td>
      <td>
        <a href="/update_page + id_of_url">تغییر</a>
        <a href="">حذف</a>
      </td>
    </tr>
  `;
  return template;
}