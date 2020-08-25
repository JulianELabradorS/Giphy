window.onload = () => {
	let allGifs = [];

	// GIF OBJECT
	class Gif {
		constructor(image, id, title, username) {
			this.id = id;
			this.image = image;
			this.title = title;
			this.username = username;
			this.favorite = false;
			this.addGifs();
		}
		addGifs() {
			allGifs.push(this);
		}
	}
	// MODE HANDLER
	class NocturneMode {
		constructor() {
			this.modeButton = document.getElementById('page--mode');
			this.body = document.getElementsByTagName('body');
			this.addEvents();
		}
		addEvents() {
			this.modeButton.addEventListener('click', () => {
				this.changeMode();
			});
		}

		changeMode() {
			event.preventDefault();
			let hasClass = this.body[0].classList.toggle('nocturne');
			if (hasClass) {
				event.currentTarget.innerHTML = 'MODO DIURNO';
			} else {
				event.currentTarget.innerHTML = 'MODO NOCTURNO';
			}
		}
	}

	//SLIDER HANDLER
	class Slider {
		constructor() {
			this.buttonNext = document.getElementById('trending__gifs__slider__next');
			this.buttonPrev = document.getElementById('trending__gifs__slider__prev');
			this.sliderWrapper = document.getElementById('trending__gifs__slider__wrapper');
			this.sliderInner = document.getElementById('trending__gifs__slider__inner');
			this.sliderInnerWidth;
			this.maxMovement;
			this.position = 0;
			this.addEvents();
		}
		addEvents() {
			this.buttonNext.addEventListener('click', () => {
				this.slideNext();
			});
			this.buttonPrev.addEventListener('click', () => {
				this.slidePrev();
			});
		}
		slideNext() {
			this.buttonPrev.classList.add('show');
			this.sliderInnerWidth = this.getSliderInnerWidth();
			let movement = this.getMovement();
			let sliderWrapperWidth = this.sliderWrapper.offsetWidth;
			this.maxMovement = this.sliderInnerWidth - sliderWrapperWidth;
			this.position += movement;
			if (this.maxMovement > this.position) {
				this.sliderInner.style.right = `${this.position}px`;
			} else {
				this.position = this.maxMovement;
				this.sliderInner.style.right = `${this.position}px`;
				this.buttonNext.classList.add('hide');
			}
		}
		slidePrev() {
			this.buttonNext.classList.remove('hide');
			let movement = this.getMovement();
			this.position -= movement;
			if (this.position > 0) {
				this.sliderInner.style.right = `${this.position}px`;
			} else {
				this.sliderInner.style.right = `0`;
				this.buttonPrev.classList.remove('show');
			}
		}
		getSliderInnerWidth() {
			let items = this.sliderInner.childElementCount;
			let width;
			if (screen.width > 768) {
				width = items * 357 + (items - 1) * 29;
				return width;
			} else {
				width = items * 243;
				return width;
			}
		}
		getMovement() {
			if (screen.width > 768) {
				return 387;
			} else {
				return 243;
			}
		}
	}

	//SEARCH HANDLER
	class Search {
		constructor() {
			this.form = document.getElementById('main__form');
			this.input = document.getElementById('main__input');
			this.suggestList = document.getElementById('suggest__list');
			this.suggestBar = document.querySelector('.main__suggestBar');
			this.gifsContainer = document.getElementById('searchResults__gifs');
			this.container = document.getElementById('searchResults');
			this.trendingText = document.getElementById('trending');
			this.title = document.getElementById('searchResults__title');
			this.button = document.getElementById('searchResults__button');
			this.suggest;
			this.limit = 12;
			this.addEvents();
		}
		addEvents() {
			this.form.addEventListener('submit', () => {
				this.submit();
			});
			this.input.addEventListener('input', () => {
				this.suggestPetition();
			});
		}
		//SUGGEST PETITION
		async suggestPetition() {
			let value = event.target.value;
			let title = `${value}`.toUpperCase();
			this.title.textContent = title;
			if (value) {
				let response = await fetch(
					`https://api.giphy.com/v1/tags/related/${value}?api_key=APOUKP9u6BaOSLAVuA3AoRygic9iIIIe&`
				);
				let suggestions = await response.json();
				const { data } = suggestions;
				this.renderSuggestions(data);
			} else {
				this.suggestBar.classList.remove('show');
				this.input.classList.remove('active');
			}
		}
		//RENDER SUGGESTIONS
		renderSuggestions(suggestions) {
			this.suggestList.innerHTML = '';
			suggestions.forEach((suggest) => {
				const { name } = suggest;
				let template = `<li>
	  <a href="" data-suggest="${name}"><img src="./assets/images/search/icon-search-modo-noct.svg" alt="" />${name}</a>
	</li> `;
				this.suggestList.insertAdjacentHTML('beforeend', template);
			});
			this.suggestBar.classList.add('show');
			this.input.classList.add('active');
			//SUGGESTION LISTENER
			this.suggest = this.suggestList.querySelectorAll('a');
			this.suggest.forEach((data) => {
				data.addEventListener('click', () => {
					this.throwSearch();
				});
			});
		}
		//TROW SUBMIT ON CLICK
		throwSearch() {
			event.preventDefault();
			let button = event.target;
			let value = button.dataset.suggest;
			this.input.value = value;
			this.suggestBar.classList.remove('show');
			this.input.classList.remove('active');
			this.submit();
		}
		//SUBMIT
		submit() {
			this.suggestBar.classList.remove('show');
			this.input.classList.remove('active');
			this.gifsContainer.innerHTML = '';
			let value = this.input.value;
			let allGifs = [];
			event.preventDefault();
			fetch(
				`https://api.giphy.com/v1/gifs/search?api_key=APOUKP9u6BaOSLAVuA3AoRygic9iIIIe&q=${value}&limit=${this.limit}`
			).then((response) => {
				response.json().then((gifs) => {
					const { data } = gifs;
					this.renderGifs(data);
				});
			});
		}
		renderGifs(gifs) {
			this.trendingText.classList.add('hide');
			gifs.forEach((gif) => {
				const {
					images: {
						downsized: { url },
					},
					id,
					title,
					username,
				} = gif;
				let template = ` 		<div class="searchResults__gifs__gif">
				<img
					src="${url}"
					alt=""
				/>
				<div class="searchResults__gifs__gif__hover">
					<img src="./assets/images/gifIcons/icon-fav-hover.svg" alt="" data-id="${id}" class="fav__icon" />
					<img src="./assets/images/gifIcons/icon-download-hover.svg" alt="" data-id="${id}"  class="download__icon"/>
					<img src="./assets/images/gifIcons/icon-max-hover.svg" alt="" data-id="${id}" class="max__icon"/>
				</div>
			</div>`;
				this.gifsContainer.insertAdjacentHTML('beforeend', template);
				new Gif(url, id, title, username);
			});
			this.container.classList.add('show');
			this.button.addEventListener('click', () => {
				this.searchMore();
			});
			new MaxGif();
		}
		searchMore() {
			this.limit += 12;
			this.submit();
		}
	}

	//TRENDING HANDLER
	class Trending {
		constructor() {
			this.sliderItems = document.getElementById('trending__gifs__slider__inner');
			this.text = document.getElementById('trending');
			this.petitionTrendingGifs();
			this.petitionTrendings();
		}
		petitionTrendings() {
			fetch(`https://api.giphy.com/v1/trending/searches?api_key=APOUKP9u6BaOSLAVuA3AoRygic9iIIIe&`).then((response) => {
				response.json().then((trendings) => {
					const { data } = trendings;
					this.renderTrendingsStr(data);
				});
			});
		}
		renderTrendingsStr(trendings) {
			this.text.innerHTML = '';
			let str = trendings.join(', ');
			let template = `        <h3>Trending:</h3>
		<p>${str}</p>`;
			this.text.insertAdjacentHTML('beforeend', template);
		}
		async petitionTrendingGifs() {
			let response = await fetch(`https://api.giphy.com/v1/gifs/trending?api_key=APOUKP9u6BaOSLAVuA3AoRygic9iIIIe&`);
			let trendings = await response.json();
			const { data } = trendings;
			this.renderTrendings(data);
		}
		renderTrendings(trendings) {
			console.log(trendings);
			trendings.forEach((trending) => {
				const {
					images: {
						downsized: { url },
					},
					id,
					title,
					username,
				} = trending;

				let template = ` <div class="trending__gifs__slider__inner__item">
	  <img src="${url}" alt="${title}" srcset="" />
	  <div class="trending__gifs__slider__item__hover">
		<div>
		  <img src="./assets/images/gifIcons/icon-fav-hover.svg" alt="icon of favorites" data-id="${id}" class="fav__icon"/>
		  <img src="./assets/images/gifIcons/icon-download-hover.svg" alt=" icon of dowload" data-id="${id}" class="download__icon"/>
		  <img src="./assets/images/gifIcons/icon-max-hover.svg" alt="icon of maximixe" data-id="${id}" class="max__icon"/>
		</div>
	  </div>
	</div>`;
				this.sliderItems.insertAdjacentHTML('beforeend', template);
				new Gif(url, id, title, username);
			});
			new MaxGif();
		}
	}

	//MAX GIF
	class MaxGif {
		constructor() {
			this.buttons = document.getElementsByClassName('max__icon');
			this.container = document.getElementById('modal');
			this.bindEvents();
		}
		bindEvents() {
			console.log(this.buttons);
			for (let i = 0; i < this.buttons.length; i++) {
				this.buttons[i].addEventListener('click', () => {
					this.maxGif();
				});
			}
		}
		maxGif() {
			let button = event.currentTarget;
			let id = button.dataset.id;
			this.searchGif(id);
		}
		searchGif(id) {
			let gif = allGifs.filter((gif) => {
				return gif.id === id;
			});
			this.maximixeGif(gif[0]);
		}
		maximixeGif(gif) {
			this.container.innerHTML = '';
			const { username, title, image, id } = gif;
			let template = `	<img src="./assets/images/search/close.svg" alt="close icon" /><div class="modal__card">
			<div class="modal__card__image">
				<img
					src="${image}"
					alt="${title}"
				/>
			</div>
			<div class="modal__card__info">
				<div class="modal__card__info__text">
					<p>${username}</p>
					<h3>${title}</h3>
				</div>
				<div class="modal__card__info__images">
					<img src="./assets/images/gifIcons/icon-fav-hover.svg" alt="icono de corazon" class="fav__icon" data-id="${id}"/>
					<img
						src="./assets/images/gifIcons/icon-download-hover.svg"
						alt="icono de descarga"
						class="download__icon"
						data-id="${id}"
					/>
				</div>
			</div>
		</div>`;
			this.container.insertAdjacentHTML('beforeend', template);
			this.container.classList.add('show');
			let body = document.getElementsByTagName('body');
			this.container.scrollIntoView();
			body[0].style.overflow = 'hidden';
		}
	}

	new NocturneMode();
	new Slider();
	new Search();
	new Trending();

	console.log(allGifs);
};
