window.onload = () => {
  let savedFavGifs = JSON.parse(window.localStorage.getItem('favorites'));
  let CreatedGifs = JSON.parse(window.localStorage.getItem('myGifos'));
  if (savedFavGifs) {
    allGifsLimit += savedFavGifs.length;
    savedFavGifs.forEach((gif) => {
      const { image, preview, title, username, id, favorite } = gif;
      new Gif(image, preview, id, title, username, favorite);
      renderFavorites();
    });
  }
  if (CreatedGifs) {
    allGifsLimit += CreatedGifs.length;
    CreatedGifs.forEach((gif) => {
      const { image, preview, title, username, id, favorite, created } = gif;
      new Gif(image, preview, id, title, username, favorite, created);
      renderMyGifos();
    });
  }
};
