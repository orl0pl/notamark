import express, { Express, Request, Response } from 'express';

const app: Express = express();
const iconmap = require('./utils/iconmap.json');
function iconmapper(name: string){
    var codepoint = iconmap.find((obj: {name: string;}) => obj.name === name).codepoint
    return String.fromCodePoint(parseInt(codepoint, 16))
}
app.use('/static',express.static(__dirname + '/static'));
app.set('view engine', 'ejs')
app.get('/editor', (req, res) => {
    res.render('editor', {
        url: '../',
        mi: iconmapper
    })
})
app.get('/', (req: Request, res: Response) => {
  res.send('Main page');
});

app.listen(1447, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:1447`);
});