const headingTag = document.querySelector('.login-container h2');
const switchFormContainer = document.getElementsByClassName('switch-form')[0];
const switchFormButton = switchFormContainer.getElementsByTagName('button')[0];
const switchFormSpan = switchFormContainer.getElementsByTagName('span')[0];

const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const loginFormHelp = document.getElementById('login-form');
const registerFormHelp = document.getElementById('register-form');

let isLoggingIn = registerForm.classList.contains('hidden');

switchFormContainer.addEventListener('click', () => {
  if(isLoggingIn) {
    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
    switchFormSpan.innerHTML = 'حساب کاربری دارید؟';
    switchFormButton.innerHTML = 'وارد شوید';
    headingTag.innerHTML = 'ثبت نام';
    isLoggingIn = false;
    return;
  }

  registerForm.classList.add('hidden');
  loginForm.classList.remove('hidden');
  switchFormSpan.innerHTML = 'حساب کاربری ندارید؟';
  switchFormButton.innerHTML = 'ثبت نام کتید';
  headingTag.innerHTML = 'ورود';
  isLoggingIn = true;
})