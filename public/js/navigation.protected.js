const profileButton = document.querySelector('.navigation-profile-button');
const profileDropdown = document.querySelector('.navigation-profile-dropdown');
const expandChevron = document.querySelector('.expand-chevron');

profileButton.addEventListener('click', () => {
  expandChevron.classList.toggle('fa-chevron-down');
  expandChevron.classList.toggle('fa-chevron-up');
  profileDropdown.classList.toggle('hidden');
})
