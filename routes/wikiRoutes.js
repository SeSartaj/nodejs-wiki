// Required Modules
const express = require("express");
const router = express.Router({caseSensitive:true});
const util = require("../util");
const md = require('jstransformer-markdown-it');

// Route handlers
router.get('/', (req, res) => {
    util.list_entries()
    .then((entries)=>{
        // res.write(JSON.stringify(entries));
        console.log(entries);
        res.render('index.html', {title:'Welcome to Wiki', entries});
        // res.end();
    })
    .catch((err)=>{
        res.write('404' + err.message);
        res.end();
    })
});


router.get('/search', (req, res) => {
    const q = req.query['q']; 

    util.list_entries()
    .then((entries)=>{
        if(entries.indexOf(q) != -1) {
            res.redirect(`/wiki/${q}`);
            res.end();
        }
        else{
            const lq = q.toLocaleLowerCase();
            const r = entries.filter(entry => { 
                const le = entry.toLowerCase(); 
                return le.includes(lq);
            });
            console.log(r);
            res.render('index.html', {title:'Search Results for: '+ lq , entries: r});
        }
    })
    // res.write(req.query['q']);
    // res.end();
});

router.get('/:title', (req, res)=>{
    const title = req.params.title;
    util.get_entry(title)
    .then((content)=>{
        const html = md.render(content);
        console.log(content);
        res.render('entry.html', {title, content:html});
        // res.end();
    })
    .catch((err) => {
        console.log(err);
        res.render('error.html', {message:`Entry named '${title}' does not exist on our website.`});
        // res.end();
    })
});



module.exports = router;