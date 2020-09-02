let allGifs = [];
let allGifsLimit = 25;
//
class Gif {
  constructor(
    image,
    preview,
    id,
    title,
    username,
    favorite = false,
    created = false,
  ) {
    this.id = id;
    this.image = image;
    this.preview = preview;
    this.title = title;
    this.username = username;
    this.favorite = favorite;
    this.created = created;
    this.addGifs();
  }
  addGifs() {
    allGifs.push(this);
  }
  removeFavorite() {
    this.favorite = false;
  }
  addFavorite() {
    this.favorite = true;
  }
}
