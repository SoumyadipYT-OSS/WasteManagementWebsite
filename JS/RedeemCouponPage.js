const list = document.querySelectorAll('.list');
function activeLink() {
    list.forEach((item) =>
        item.classList.remove('active'));
        this.classList.add('active');  
}
list.forEach((item) =>
item.addEventListener('click', activeLink))

function navbarSound(audioName) {
    let audio = new Audio(audioName);
    audio.play();
}
function navbarAttributes() {
    navbarSound("../sound/ssf_sound.wav");
}







function profileMenuToggle() {
    const toggleMenu = document.querySelector('.menu');
    toggleMenu.classList.toggle('active');
}
function profileMenuSound(audioName) {
    let audio = new Audio(audioName);
    audio.play();
}
function profileAttributes() {
    profileMenuToggle();
    profileMenuSound("../sound/pb_sound.wav");
}







function profileListSound(audioName) {
    let audio = new Audio(audioName);
    audio.play();
}
function profileListAttribute() {
    profileListSound("../sound/ci_sound.wav");
}









function cardListAttribute() {
    profileListSound("../sound/ts_sound.wav");
}
const buttons = document.querySelectorAll('#cpnBtn');
buttons.forEach(function(button) {
    button.addEventListener('click', function() {
        const text = button.previousElementSibling.textContent;
        navigator.clipboard.writeText(text).then(function() {
            cardListAttribute();
            console.log('COPIED');
            button.innerHTML = 'COPIED';
            setTimeout(function() {
                button.innerHTML = 'COPY CODE';
            }, 2000);
        }).catch(function(error) {
            console.error('Error copying text: ',error);
        });
    });
});












const div = document.querySelector('#userName');
window.addEventListener('scroll', () => {
  if (window.scrollY > 100) {
    div.style.transition = 'transform 0.5s ease-in-out';
    div.style.display = 'none';

  } else {
    div.style.transition = 'transform 0.5s ease-in-out-back';
    div.style.display = 'block';
  }
});