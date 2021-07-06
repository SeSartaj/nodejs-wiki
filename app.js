// Required Modules
const express = require('express');
const nunjucks = require('nunjucks');
const util = require('./util');

// Routers 
const wikiRouter = require('./routes/wikiRoutes');


const app = express();

// express Middlewars (order is important)
app.use(express.urlencoded({extended: true}));

// Setup
const port = 3000;
app
nunjucks.configure('views', {
    autoescape: true, 
    express: app
});




app.get('/', (req, res) => {
    res.redirect('/wiki/');
});

app.get('/create', (req, res) => {
    res.render('create.html');
});

app.post('/create', (req, res) => {
    util.list_entries()
    .then((entries) => {
        title = req.body.title; 
        console.log(title); 
        if(entries.indexOf(title) != -1) {
            res.render('error.html', {message: `Entry named '${title} already exist. `});
            // res.end();
        }
        else {
            util.save_entry(req.body.title, req.body.content)
            .then(()=>{
                res.redirect(`/wiki/${req.body.title}`); 
            })
        }
    })    
    .catch(err=> {
        res.write(err.message);
        res.end();
    }); 
})

app.get('/edit/:title', (req, res) => {
    util.get_entry(req.params.title)
    .then((content) => {
        res.render('edit.html', {title: req.params.title, content: content});
    })
    .catch((err) => {
        res.write('Some error has occured'); 
        res.end();
    })
})

app.post('/edit', (req, res) => {
    util.save_entry(req.body.title, req.body.content)
    .then(()=>{
        res.redirect(`/wiki/${req.body.title}`); 
    })
    .catch(err=> {
        res.write(err.message);
        res.end();
    }); 
}); 


app.get('/random', (req, res) => {
    util.list_entries()
    .then((e) => {
        const n = Math.floor(Math.random() * (e.length)) ;
        const d = e[n];
        console.log(d);
        res.redirect(`/wiki/${d}`);
    })
})


app.use('/wiki', wikiRouter);
    
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});


