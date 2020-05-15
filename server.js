require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const cors = require('cors')
const MOVIES = require('./movie.sample.json')

const app = express()

app.use(morgan('dev'))
app.use(helmet())
app.use(cors())

app.use(function validateBearerToken(req, res, next) {
    const apiToken = process.env.API_TOKEN
    const authToken = req.get('Authorization')
  
    if (!authToken || authToken.split(' ')[1] !== apiToken) {
      return res.status(401).json({ error: 'Unauthorized request' })
    }
    
    next()
  })

function handleMovies(req, res) {
    let { genre, country, avg_vote} = req.query;

    let movieResult = MOVIES;

    if(genre){
        movieResult = movieResult.filter(movie =>
            movie.genre.toLowerCase().includes(genre.toLowerCase()));
    }

    if(country){
        movieResult = movieResult.filter(movie =>
            movie.country.toLowerCase().includes(country.toLowerCase()));
    }

    if(avg_vote){
        movieResult = movieResult.filter(movie =>
            movie.avg_vote >= Number(avg_vote));
    }

    res.json(movieResult);
}

app.get('/movies', handleMovies)


app.listen(8000, () => 
    console.log("Listening on PORT 8000"))