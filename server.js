const express = require('express')
const app = express()
const request = require('request')
const port = process.argv[2] || 8080
const apiKey = `?api_key=5717394436bb20a2607c3eff96755ae7`
const baseMovieUrl = 'https://api.themoviedb.org/3/movie/'
const popUrl = `${baseMovieUrl}popular${apiKey}&language=en-US&page=1`
const baseQueryUrl = `https://api.themoviedb.org/3/search/movie${apiKey}&query=`
const getUrlQuery = (searchTerm) => `${baseQueryUrl}${searchTerm}`
app.set('view engine', 'ejs')
app.use(express.static('public'))
const errPic = `/rRTMdhZ7kxMdJIqykz0t4p0HABA.jpg`


//-------FUNCTIONS-----------//
//-------------------------------------------------//

function searchDB(searchTerm, callback) {
    request(getUrlQuery(searchTerm), (err, res, body) => {
        if (err) return err
        const movie = JSON.parse(body)
        callback(movie)
    })
}

function getFav(callback) {
    let url = `${popUrl}`
    request(url, (err, res, body) => {
        if (err) return err
        callback(JSON.parse(body))
    })
}

function getMovieInfo(searchId, cb) {
    const singleMovieUrl = `${baseMovieUrl}${searchId}${apiKey}`
    request(singleMovieUrl, (err, res, body) => {
        if (err) return err
        cb(JSON.parse(body))
    })

}

function getCredits(searchId, cb) {
    const getCredits = `https://api.themoviedb.org/3/movie/${searchId}/credits${apiKey}`
    request(getCredits, (err, res, body) => {
        console.log('second request')
        if (err) return err
        cb(JSON.parse(body))
    })
}

//------ROUTES---------//
//-------------------------------------------------//

app.get('/', (req, res) => {
    getFav((movies) => {
        const faveMoviesObj = movies
        res.render('index', {movies})
    })
})

app.get('/movie/:movieId', (req, res) => {
    const searchId = req.params.movieId
    getMovieInfo(searchId, (singleMovie) => {
        getCredits(searchId, (credits) => {
            res.render('movie', {singleMovie, credits})
        })
    
    })
})

app.get('/search', (req, res) => {
    const {searchTerm} = req.query
    searchDB(searchTerm, (movie) => { 
         if (movie.total_results === 0  || movie.results === undefined) {
            let movie = {
            results: [{
                id: 97,
                title: 'the search returned no results',
                overview: 'please try another search',
                release_date: '',
                poster_path: `/rRTMdhZ7kxMdJIqykz0t4p0HABA.jpg`
            }]}
            console.log(movie)
            res.render('search', {movie})
        } else
        console.log('else statment')
        res.render('search', {movie})})
})

//-----Port route ------//
app.listen(port, () => {
    console.log(`LISTENING ON PORT ${port}`)
})
