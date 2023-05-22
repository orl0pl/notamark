const express = require('express');
const app = express();
const iconmap = require('./utils/iconmap.json');
function iconmapper(name){
    return iconmap.find((obj) => obj.name === name);
}
app.use('/static',express.static(__dirname + '/static'));
app.set('view engine', 'ejs')
app.get('/editor', (req, res) => {
    res.render('editor', {
        url: '../',
        mi: iconmapper
    })
})
app.get('/', (req, res) => {
    res.send('Hello World!');
})

app.listen(1447, () => {
    console.log('Server started on http://localhost:1447');
})