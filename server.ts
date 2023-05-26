import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';
var cookieParser = require('cookie-parser')
const app: Express = express();
const iconmap = require('./utils/iconmap.json');
const fs = require('fs');
var loggedInSessions: {
  [key: string]: number
};
interface Account {
  name: string;
  password: string;
  roles: Array<'editor' | 'admin' | 'user'>;
}
var accounts: Account[];
accounts = JSON.parse(fs.readFileSync('db/accounts.json', 'utf8'));
loggedInSessions = JSON.parse(fs.readFileSync('db/loggedInSessions.json', 'utf8'));
function saveToDB(): void {
  fs.writeFileSync('db/accounts.json', JSON.stringify(accounts, null, 2));
  fs.writeFileSync('db/loggedInSessions.json', JSON.stringify(loggedInSessions, null, 2));
}
// = [
//   {
//     name: 'test1',
//     password: 'test1',
//     roles: ['editor']
//   },
//   {
//     name: 'admin',
//     password: 'admin',
//     roles: ['admin']
//   },
//   {
//     name: 'test2',
//     password: 'test2',
//     roles: ['user']
//   }
// ];
function logger(req: Request , res: Response, next: Function) {
  console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
  next();
}
function iconmapper(name: string){
    var foundIcon = iconmap.find((obj: {name: string;}) => obj.name === name);
    var codepoint = foundIcon ? foundIcon.codepoint : iconmap[0].codepoint;
    return String.fromCodePoint(parseInt(codepoint, 16))
}
function userAuthData(req: Request, res: Response, next: Function){
  if(loggedInSessions[req.cookies.sID]){

  }
}
app.use('/static',express.static(__dirname + '/static'));
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(logger)
app.set('view engine', 'ejs')
app.get('/editor', (req, res) => {
    res.render('editor', {
        url: '../',
        mi: iconmapper,
    })
})
app.get('/', (req: Request, res: Response) => {
  var response = ``
  if(req.cookies.sID){
    const currentAccount = accounts[loggedInSessions[req.cookies.sID]]
    response = `You are logged in as ${currentAccount.name}
    you can ${currentAccount.roles.join(' or ')}
    `
  }
  else {
    response = `You are not logged in`
  }
  res.send(response)
});
app.get('/user', (req: Request, res: Response) => {
  var response = ``
  console.log(loggedInSessions)
  console.log(loggedInSessions[req.cookies.sID])
  if(loggedInSessions[req.cookies.sID]){
    const currentAccount = accounts[loggedInSessions[req.cookies.sID]]
    response = `You are logged in as ${currentAccount.name}
    you can ${currentAccount.roles.join(' or ')}
    `
  }
  else {
    response = `You are not logged in`
  }
  res.send(response)
})
app.get('/user/login', (req: Request, res: Response) => {
  res.render('login', {
    url: '../../',
    mi: iconmapper,
    error: null
  })
})
function randomSID(): string {
    var sID = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    if(!loggedInSessions.hasOwnProperty(sID)){
        return sID;
    }
    return randomSID();
  }
app.post('/user/login', (req: Request, res: Response) => {
  const body: {
    username: string;
    password: string;
  } = req.body;
  if(accounts.find((obj: {name: string; password: string;}) => obj.name === body.username && obj.password === body.password)){
    const newSID = randomSID()
    res.cookie('sID', newSID)
    loggedInSessions[newSID] = accounts.findIndex((obj: {name: string; password: string;}) => obj.name === body.username && obj.password === body.password)
    res.redirect('/user')
    saveToDB()
  }else{
    res.render('login', {
      url: '../../',
      mi: iconmapper,
      error: 403
    })
  }
})
app.get('/user/logout', (req: Request, res: Response) => {
  delete loggedInSessions[req.cookies.sID]
  console.log(loggedInSessions)
  saveToDB()
  res.clearCookie('sID')
  res.redirect('/')
})
app.post('/user/logout', (req: Request, res: Response) => {
  delete loggedInSessions[req.cookies.sID]
  console.log(loggedInSessions)
  saveToDB()
  res.clearCookie('sID')
  res.redirect('/')
})

app.listen(1447, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:1447`);
});