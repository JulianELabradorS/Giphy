let headerMyGifosButton = document.getElementById('header__myGifos__button');
let myGifosContainer = document.getElementById('myGifos');
let myGifosResultsContainer = document.getElementById('myGifos__results__gifs');
let myGifosResults = document.getElementById('myGifos__results');
let myGifosNoResults = document.getElementById('myGifos__noContent');

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

	renderMyGifos();
};
const renderMyGifos = () => {
	myGifosResultsContainer.innerHTML = '';

	let filter = allGifs.filter((gif) => {
		return gif.created === true;
	});
	filter.forEach((gif) => {
		console.log(gif);
		const { preview, image, id, title } = gif;
		let template = ` <div class="myGifos__results__gifs__gif">
    <img src="${preview}" alt="${title}" onclick="searchGif('${id}')" />
    <div class="myGifos__results__gifs__gif__hover">
    <img src="./assets/images/gifIcons/icon-fav-hover.svg" alt="icono agregar a favoritos"  onclick="addFavorite('${id}')" class="fav__icon" />
      <img
        src="./assets/images/gifIcons/icon-download-hover.svg"
        alt="icono descargar gifo"
        onclick="downloadGif('${image}','${title}')"
        class="download__icon"
      />
      <img
        src="./assets/images/gifIcons/icon-max-hover.svg"
        alt="icono maximixar gifo"
        onclick="searchGif('${id}')"
        class="max__icon"
      />
    </div>
  </div>`;
		myGifosResultsContainer.insertAdjacentHTML('beforeend', template);
	});
	if (myGifosResultsContainer.hasChildNodes()) {
		myGifosResults.classList.add('show');
		myGifosNoResults.classList.add('hide');
	}
	window.localStorage.setItem('myGifos', JSON.stringify(filter));
};
const stopCamera = async () => {};
