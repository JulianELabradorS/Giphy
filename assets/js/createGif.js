let headerCreateButton = document.getElementById('header__button__create');
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

headerCreateButton.addEventListener('click', () => {
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
  videoPrevContainer.classList.remove('show');
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
        video: {
          width: 646,
          height: 348,
        },
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
        let template = `	<h1>
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
    type: 'video',
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
    let tracks = stream.getTracks();
    tracks[0].stop();
    videoContainer.removeAttribute('src');
    videoContainer.load();
    videoContainer.classList.add('hide');
    let blob = recorder.getBlob();
    console.log(blob);
    videoPrevContainer.classList.add('show');
    videoPrevContainer.src = URL.createObjectURL(blob);
    videoPrevContainer.play();
    videoPrevContainer.addEventListener('ended', () => {
      videoPrevContainer.play();
    });
    buttonuploadVideo.addEventListener('click', () => {
      uploadPetiton(blob);
    });
  });
};

const uploadPetiton = async (blob) => {
  let form = new FormData();
  form.append('file', blob, 'mygif.gif');

  let response = await fetch(
    `https://upload.giphy.com/v1/gifs?api_key=JQhP1sBxi7d1SKpBsMlFDJYPGUobpcpK`,
    {
      method: 'POST',
      body: form,
    },
  );
  console.log(response);
};
