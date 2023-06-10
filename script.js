//  querying needed elements
const searchFormEl = document.getElementById("search-form")
const movieBox = document.getElementById("movies-grid")
const loadMore = document.getElementById("load-more-movies-btn")
const closeBtn = document.getElementById("close-search-btn")

// Global Constants
const apiKey = ""
let pages = 0
let search = false // both search and now playing helps to call the appropriate functions when loading more movies and searching
let nowPlaying = true
let inputString = ""

// creates a div container for a movie with the title, image and rating elements
const createMovie = (movieObj) => {
    const currMovie = document.createElement("div")
    currMovie.setAttribute('class', "movie-card")
    const imgURL = "https://www.themoviedb.org/t/p/original/" + movieObj.poster_path
    currMovie.innerHTML = `
        <img src="${imgURL}" alt="${movieObj.title}" class = 'movie-poster'/>
        <p class = 'movie-votes'> ⭐ ${movieObj.vote_average} </p>
        <h4 class = 'movie-title'> ${movieObj.title}</h4>
    `
    movieBox.appendChild(currMovie)
}

// uses the api to retieve the first 20 trending movies
const fetchMovies = async () => {
    pages += 1
    const movieBaseURL = `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&page=${pages}`
    const response = await fetch(movieBaseURL)
    const data = await response.json()
    const finalData = data.results

    for (let i = 0; i < finalData.length; i++) {
        let moviesList = data.results
        createMovie(moviesList[i])
    }
}

// allows users to search for movies based on the title of the movie
const searchfn = async (string) => {
    pages += 1
    movieBox.innerHTML = ""
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${string}&page=${pages}`
    const response = await fetch(url)
    const data = await response.json()
    const finalData = data.results
    // console.log(finalData); 
    for (let i = 0; i < finalData.length; i++) {
        createMovie(finalData[i])
    }

}

// this function resets the screen to the original page of the first 20 movies after a search 
const close = () => {
    pages = 0
    movieBox.innerHTML = ""
    search = false
    nowPlaying = true
    fetchMovies()

}

// at the click of the load more button, this gets more movies from the api ina regular case and a after a search 
loadMore.addEventListener("click", (event) => {
    if (search) {
        searchfn(inputString)
    } else if (nowPlaying) {
        fetchMovies()
    }
    
})

// calls the search function when the user presses enter in the search field
searchFormEl.addEventListener("submit", (event) => {
    pages = 0
    search = true
    nowPlaying = false
    event.preventDefault()
    inputString = event.target.query.value
    searchfn(inputString)
})

// calls the close function when the close button is pressed
closeBtn.addEventListener("click", close)

// when the window loads, movies are fetched from the api
window.onload = () => {
    fetchMovies()
}