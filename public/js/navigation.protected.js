const profileButton = document.querySelector('.navigation-profile-button');
const profileDropdown = document.querySelector('.navigation-profile-dropdown');
const expandChevron = document.querySelector('.expand-chevron');

profileButton.addEventListener('click', () => {
  expandChevron.classList.toggle('fa-chevron-down');
  expandChevron.classList.toggle('fa-chevron-up');
  profileDropdown.classList.toggle('hidden');
})

const burger = document.querySelector('#navigation-protected-burger');
burger.addEventListener('click', () => {
  const mobileMenu = document.querySelector('.mobile-menu');
  mobileMenu.classList.toggle('open');
  burger.classList.toggle('open');
})