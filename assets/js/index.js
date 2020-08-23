window.onload = () => {
  new NocturneMode();
  new Slider();
  new Search();
  new Trending();
};
// MODE HANDLER
class NocturneMode {
  constructor() {
    this.modeButton = document.getElementById("page--mode");
    this.body = document.getElementsByTagName("body");
    this.addEvents();
  }
  addEvents() {
    this.modeButton.addEventListener("click", () => {
      this.changeMode();
    });
  }

  changeMode() {
    event.preventDefault();
    let hasClass = this.body[0].classList.toggle("nocturne");
    if (hasClass) {
      event.currentTarget.innerHTML = "MODO DIURNO";
    } else {
      event.currentTarget.innerHTML = "MODO NOCTURNO";
    }
  }
}
//SLIDER HANDLER
class Slider {
  constructor() {
    this.buttonNext = document.getElementById("trending__gifs__slider__next");
    this.buttonPrev = document.getElementById("trending__gifs__slider__prev");
    this.sliderWrapper = document.getElementById("trending__gifs__slider__wrapper");
    this.sliderInner = document.getElementById("trending__gifs__slider__inner");
    this.sliderInnerWidth;
    this.maxMovement;
    this.position = 0;
    this.addEvents();
  }
  addEvents() {
    this.buttonNext.addEventListener("click", () => {
      this.slideNext();
    });
    this.buttonPrev.addEventListener("click", () => {
      this.slidePrev();
    });
  }
  slideNext() {
    this.buttonPrev.classList.add("show");
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
      this.buttonNext.classList.add("hide");
    }
  }
  slidePrev() {
    this.buttonNext.classList.remove("hide");
    let movement = this.getMovement();
    this.position -= movement;
    console.log(this.position);
    if (this.position > 0) {
      this.sliderInner.style.right = `${this.position}px`;
    } else {
      this.sliderInner.style.right = `0`;
      this.buttonPrev.classList.remove("show");
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
      console.log(width);
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
    this.input = document.getElementById("main__input");
    this.suggestList = document.getElementById("suggest__list");
    this.suggestBar = document.querySelector(".main__suggestBar");
    this.addEvents();
  }
  addEvents() {
    this.input.addEventListener("input", () => {
      this.petition();
    });
  }
  async petition() {
    let value = event.target.value;
    let response = await fetch(
      `https://api.giphy.com/v1/tags/related/${value}?api_key=APOUKP9u6BaOSLAVuA3AoRygic9iIIIe&`
    );
    let suggestions = await response.json();
    const { data } = suggestions;
    this.renderSuggestions(data);
  }
  renderSuggestions(suggestions) {
    this.suggestList.innerHTML = "";
    suggestions.forEach((suggest) => {
      const { name } = suggest;
      let template = `<li>
	  <a href=""><img src="./assets/images/search/icon-search-modo-noct.svg" alt="" />${name}</a>
	</li> `;
      this.suggestList.insertAdjacentHTML("beforeend", template);
    });
    this.suggestBar.classList.add("show");
    this.input.classList.add("active");
  }
}
//TRENDING HANDLER
class Trending {
  constructor() {
    this.sliderItems = document.getElementById("trending__gifs__slider__inner");
    this.petition();
  }
  async petition() {
    let response = await fetch(
      `https://api.giphy.com/v1/gifs/trending?api_key=APOUKP9u6BaOSLAVuA3AoRygic9iIIIe&`
    );
    let trendings = await response.json();
    const { data } = trendings;
    this.renderTrendings(data);
  }
  renderTrendings(trendings) {
    trendings.forEach((trending) => {
      const {
        images: {
          downsized: { url },
        },
        id,
      } = trending;
      let template = ` <div class="trending__gifs__slider__inner__item">
	  <img src="${url}" alt="" srcset="" />
	  <div class="trending__gifs__slider__item__hover">
		<div>
		  <img src="./assets/images/gifIcons/icon-fav-hover.svg" alt="" />
		  <img src="./assets/images/gifIcons/icon-download-hover.svg" alt="" />
		  <img src="./assets/images/gifIcons/icon-max-hover.svg" alt="" />
		</div>
	  </div>
	</div>`;
      this.sliderItems.insertAdjacentHTML("beforeend", template);
    });
  }
}
