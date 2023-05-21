const express = require('express');
const app = express();
app.use('/static',express.static(__dirname + '/static'));
app.set('view engine', 'ejs')
app.get('/editor', (req, res) => {
    res.render('editor', {
        url: '../'
    })
})
app.get('/', (req, res) => {
    res.send('Hello World!');
})

app.listen(1447, () => {
    console.log('Server started on http://localhost:1447');
})