require("dotenv").config();

const express = require("express");
const hbs = require("hbs");
// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

// Retrieve an access token
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// setting the spotify-api goes here:
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// Our routes go here:

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/artist-search", (req, res) => {
  spotifyApi
    .searchArtists(req.query.searchArtist)
    .then((artistFromApi) => {
      console.log(
        "The received data from the API: ",
        artistFromApi.body.artists.items.images
      );
      res.render("artist-search-results", {
        Artist: artistFromApi.body.artists.items,
      });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:artistId", (req, res, next) => {

     const artistId = req.params.artistId
     spotifyApi
    .getArtistAlbums(artistId)
    .then((albumsFromApi) => {
      console.log(
        "The received data from the API: ",
        albumsFromApi.body.items );
      res.render("albums", {Albums: albumsFromApi.body.items});
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/tracks/:trackId", (req, res, next)=>{
    
    const trackId = req.params.trackId
    spotifyApi
    .getAlbumTracks(trackId)
    .then((tracksFromApi)=>{
        console.log("Tracks Sample:", tracksFromApi.body.items)
        res.render("tracks", {Tracks : tracksFromApi.body.items})
    })
})



app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
