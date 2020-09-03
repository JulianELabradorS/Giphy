let headerCreateButton = document.getElementById('header__button__create');
let listCreateButton = document.getElementById('list__create__button');
let buttonInitVideo = document.getElementById('create__gif__button');
let buttonRecordingVideo = document.getElementById('recording__gif__button');
let buttonEndVideo = document.getElementById('end__gif__button');
let buttonuploadVideo = document.getElementById('upload__gif__button');
let buttonCreateAgain = document.getElementById('create__again');
let createContainer = document.getElementById('create__gif');
let textCreateGif = document.getElementById('text_createGif');
let videoContainer = document.getElementById('stream__video');
let videoPrevContainer = document.getElementById('preview__video');
let controlerButton1 = document.getElementById('create__gif__controls-1');
let controlerButton2 = document.getElementById('create__gif__controls-2');
let controlerButton3 = document.getElementById('create__gif__controls-3');
let uploadHover = document.getElementById('create__gif__content__video__hover');
let myGifos = [];

headerCreateButton.addEventListener('click', () => {
	showCreate();
});
listCreateButton.addEventListener('click', () => {
	showCreate();
});
buttonRecordingVideo.addEventListener('click', () => {
	recordingVideo();
});
buttonInitVideo.addEventListener('click', () => {
	initVideo();
});
buttonCreateAgain.addEventListener('click', () => {
	showCreate();
});

const showCreate = () => {
	event.preventDefault();
	textCreateGif.innerHTML = '';
	controlerButton3.classList.remove('active');
	videoPrevContainer.classList.remove('show');
	uploadHover.classList.remove('show--flex');
	videoContainer.classList.remove('hide');
	buttonuploadVideo.classList.remove('show');
	buttonCreateAgain.classList.remove('show');
	textCreateGif.classList.remove('hide');
	createContainer.classList.add('show--flex');
	headerCreateButton.classList.add('active');
	buttonInitVideo.classList.remove('hide');
	buttonRecordingVideo.classList.remove('show');
	controlerButton2.classList.remove('active');
	controlerButton1.classList.add('active');
	if (favorites.classList.length) {
		favorites.classList.remove('show');
		headerFavButton.classList.remove('active--button');
	} else if (myGifosContainer.classList.length) {
		myGifosContainer.classList.remove('show');
		headerMyGifosButton.classList.remove('active--button');
	} else {
		sectionPrincipal.classList.add('hide');
	}
	let template = `	<h1>
    Aquí podrás <br />
    crear tus propios <span>GIFOS</span>
</h1>
<p>
    ¡Crea tu GIFO en sólo 3 pasos! <br />
    (sólo necesitas una cámara para grabar un video)
</p>`;
	textCreateGif.insertAdjacentHTML('beforeend', template);
};

const initVideo = () => {
	buttonInitVideo.classList.add('hide');
	if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
		navigator.mediaDevices
			.getUserMedia({
				audio: false,
				video: true,
			})
			.then((stream) => {
				controlerButton1.classList.remove('active');
				controlerButton2.classList.add('active');
				textCreateGif.classList.add('hide');
				buttonRecordingVideo.classList.add('show');
				videoContainer.srcObject = stream;
				videoContainer.play();
			})
			.catch(() => {
				textCreateGif.innerHTML = '';
				let template = `<h1>
               Lo Sentimos, <br />
               Parece que no tienes una camara conectada </span>
            </h1>
            <p>
                Conectala e intenta de nuevo!
            </p>`;
				textCreateGif.insertAdjacentHTML('beforeend', template);
				buttonInitVideo.classList.remove('hide');
			});
	}
};
const recordingVideo = async () => {
	buttonRecordingVideo.classList.remove('show');
	buttonEndVideo.classList.add('show');
	let stream = videoContainer.srcObject;
	let recorder = RecordRTC(stream, {
		type: 'gif',
		frameRate: 1,
		quality: 10,
		width: 360,
		hidden: 240,
	});
	recorder.startRecording();
	buttonEndVideo.addEventListener('click', () => {
		stopRecording(recorder);
	});
};
const stopRecording = (recorder) => {
	buttonEndVideo.classList.remove('show');
	buttonuploadVideo.classList.add('show');
	buttonCreateAgain.classList.add('show');
	let stream = videoContainer.srcObject;
	recorder.stopRecording(function () {
		let blob = recorder.getBlob();
		let tracks = stream.getTracks();
		tracks[0].stop();
		videoContainer.removeAttribute('src');
		videoContainer.load();
		videoContainer.classList.add('hide');
		console.log(blob);
		videoPrevContainer.classList.add('show');
		videoPrevContainer.src = URL.createObjectURL(blob);
		buttonuploadVideo.addEventListener('click', () => {
			uploadPetiton(blob);
		});
	});
};

const uploadPetiton = async (blob) => {
	buttonuploadVideo.classList.remove('show');
	buttonCreateAgain.classList.remove('show');
	controlerButton2.classList.remove('active');
	controlerButton3.classList.add('active');
	uploadHover.innerHTML = '';
	let template = ` <img src="./assets/images/createIcons/loader.svg" alt="upload Gif icon" id="image__icon__hover" >
  <p id="text__icon__hover">Estamos subiendo tu GIFO</p>`;
	uploadHover.insertAdjacentHTML('beforeend', template);
	uploadHover.classList.add('show--flex');
	let form = new FormData();
	form.append('file', blob, 'mygif.gif');
	let response = await fetch('https://upload.giphy.com/v1/gifs?api_key=KxvZAKM0KrymQwsG3ocqEsjRw6PRyNej', {
		method: 'POST',
		body: form,
	});
	response
		.json()
		.then((data) => {
			const {
				data: { id },
			} = data;
			getCreated(id);
		})
		.catch((e) => {
			alert('UPS!! Tenemos problemas con nuestros servidores');
		});
};
const getCreated = async (id) => {
	let response = await fetch(`https://api.giphy.com/v1/gifs/${id}?api_key=KxvZAKM0KrymQwsG3ocqEsjRw6PRyNej`);
	let data = await response.json();
	const { data: gif } = data;
	console.log('here', gif);
	const {
		title,
		username,
		images: {
			downsized: { url },
		},
	} = gif;
	new Gif(url, url, id, title, username, false, true);
	uploadHover.innerHTML = '';
	let template = ` <div class="icons">
  <img src="./assets/images/gifIcons/icon-download-hover.svg" alt="add to favorites icon" onclick="downloadGif('${url}','${title}')">
  <img src="./assets/images/gifIcons/icon-link-hover.svg" alt="link gif Icon">
</div><img src="./assets/images/createIcons/check.svg" alt="upload Gif icon" id="image__icon__hover" >
  <p id="text__icon__hover">GIFO subido con éxito</p>`;
	uploadHover.insertAdjacentHTML('beforeend', template);
};
