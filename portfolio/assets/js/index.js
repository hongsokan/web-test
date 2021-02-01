const menuToggle = document.querySelector('.toggle');
const showcase = document.querySelector('.showcase');

menuToggle.addEventListener('click', () => {
  menuToggle.classList.toggle('active');
  showcase.classList.toggle('active');

  // if (showcase.classList.toggle('active') === true) {
  //   console.log('true');
  // }
  // else {
  //   console.log('false');
  // }
  
  // if (menuToggle.classList.toggle('active') === true) {
  //   document.querySelector('.menu ul').setAttribute( 'display', 'block');
  // }
})