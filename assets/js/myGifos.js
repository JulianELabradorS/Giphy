let headerMyGifosButton = document.getElementById('header__myGifos__button');
let myGifosContainer = document.getElementById('myGifos');

headerMyGifosButton.addEventListener('click', () => {
  showMyGifos();
});

const showMyGifos = () => {
  event.preventDefault();
  myGifosContainer.classList.add('show');
  headerMyGifosButton.classList.add('active--button');
  if (favorites.classList.length) {
    favorites.classList.remove('show');
    headerFavButton.classList.remove('active--button');
  } else if (createContainer.classList.length) {
    createContainer.classList.remove('show--flex');
    headerCreateButton.classList.remove('active');
    stopCamera();
  } else {
    sectionPrincipal.classList.add('hide');
  }
};
const stopCamera = async () => {
  /*   let stream = videoContainer.srcObject;
  console.log(stream);
  let x = stream.getTracks();
  x[0].stop();
  videoContainer.pause();
  videoContainer.removeAttribute('src');
  videoContainer.load(); */
};
