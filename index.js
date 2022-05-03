const express = require("express");
const Joi = require('joi');

const app = express()
app.use(express.json())

const genres = [
    {id: "1", name: "Action", description: "punchie punchie"},
    {id: "2", name: "Comedy", description: "laughie laughie"},
    {id: "3", name: "Documentary", description: "big brain"}
];

app.get('/api/getGenres', (req, res) => {
    res.send(genres);
});

app.get('/api/genres/:id', (req, res) => {
    const genre = genres.find(c => c.id == parseInt(req.params.id));
    if (!genre) return res.status(404).send("There's no genre with that id");


    res.send(genre);
});

app.post('/api/genres', (req, res) =>{
    const {error} = validateGenre(req.body, "post");
    console.log(error);

    if (error) {
        // 400 bad request :(
        res.status(400).send(error.details[0].message);
        return;
    }

    const genre = {
        id: genres.length + 1,
        name: req.body.name,
        description: req.body.description
    };
    genres.push(genre);
    res.send(genre);
})

app.put('/api/genres/:id', (req, res) => {
    const genre = genres.find(c => c.id == parseInt(req.params.id));
    if (!genre) return res.status(404).send("There's no genre with that id");
    const result = validateGenre(req.body, "put")
    console.log(result)
    if (result.error) {
        res.status(400).send(error.details[0].message);
        return;
    }else if (!result.value.description) {
        genre.name = req.body.name;
        res.send(genre)
    }else if (!result.value.name){
        genre.description = req.body.description;
        res.send(genre)
    }else {
        genre.name = req.body.name;
        genre.description = req.body.description;
        res.send(genre)
    }
   
});

function validateGenre(genre, mode) {
    //different schemas for different app. functions
   if (mode ==  "post") {
    schema = Joi.object({
        name: Joi.string().required(),
        description: Joi.string().required()
    });
   }else {
       schema = Joi.object({
        name: Joi.string(),
        description: Joi.string()
       }).or('name', 'description');
   }
   return schema.validate(genre);
}

app.listen(3000);