require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const cors = require('cors')
const MOVIES = require('./movie.sample.json')

const app = express()

const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'dev';

app.use(morgan(morganSetting))
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
        movieResult = movieResult.sort((a, b) => {
            return a[Number(avg_vote)] > b[Number(avg_vote)] ? 1 : a[Number(avg_vote)] < b[Number(avg_vote)] ? -1 : 0;
            })
    }

    res.json(movieResult);
}

app.use((error, req, res, next)=>{
    let response
    if(process.env.NODE_ENV === 'production') {
        response = {error: {message: 'server error' }}
    } else{
        response = {error}
    }
    res.status(500).json(response)
})

app.get('/movies', handleMovies)

module.exports = app;