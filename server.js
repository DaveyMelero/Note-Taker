
const express = require('express');
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require('uuid');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
});




app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    fs.readFile(path.join(__dirname, '/db/db.json'), 'utf-8', (err, data) => {
      if (err) throw err;
      let notes = JSON.parse(data);
      if (!Array.isArray(notes)) {
        notes = [];
      }
      const id = uuidv4(); // generate a unique ID
      const noteWithId = { id, ...newNote }; // merge the ID and note data
      notes.push(noteWithId);
      fs.writeFile(path.join(__dirname, '/db/db.json'), JSON.stringify(notes), (err) => {
        if (err) throw err;
        res.json(noteWithId);
      });
    });
  });
 




app.get('/api/notes', (req,res) =>{
    fs.readFile(path.join(__dirname, '/db/db.json'), 'utf-8', (err, data) => {
        if(err) throw err; 
        res.json(JSON.parse(data));
});
});




app.delete('/api/notes/:id', (req, res) => {
    fs.readFile(path.join(__dirname, '/db/db.json'), 'utf-8', (err, data) => {
        if (err) throw err; 
        let notes = JSON.parse(data);
        let noteId = req.params.id;
        notes = notes.filter(note => note.id != noteId);
        fs.writeFile(path.join(__dirname, '/db/db.json'), JSON.stringify(notes), (err) => {
            if (err) throw err;
            res.json({success: true}); 
        });
    });
});


app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});


