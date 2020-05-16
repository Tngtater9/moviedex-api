const app =  require('./movie.api')

const PORT = process.env.PORT || 8000

app.listen(PORT, () => 
    console.log("Server listening"))