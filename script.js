const searchFormEl = document.getElementById("search-form")
const movieBox = document.getElementById("movies-grid")
const loadMore = document.getElementById("load-more-movies-btn")
const closeBtn = document.getElementById("close-search-btn")

// Global Constants
const apiKey = "043181aa1e5530f8f4aaf3056a66ce9e"
let pages = 0
let search = false
let nowPlaying = true
let inputString = ""


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

const close = () => {
    pages = 0
    movieBox.innerHTML = ""
    search = false
    nowPlaying = true
    fetchMovies()

}

//updating page
loadMore.addEventListener("click", (event) => {
    if (search) {
        searchfn(inputString)
    } else if (nowPlaying) {
        fetchMovies()
    }
    
})

searchFormEl.addEventListener("submit", (event) => {
    pages = 0
    search = true
    nowPlaying = false
    event.preventDefault()
    inputString = event.target.query.value
    searchfn(inputString)
})

closeBtn.addEventListener("click", close)

window.onload = () => {
    fetchMovies()
}