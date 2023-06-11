import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';
import { Convert, DataBase } from "./db/converter";
import fs from 'fs';
import TimeAgo from 'javascript-time-ago'
import pl from 'javascript-time-ago/locale/pl'
TimeAgo.addDefaultLocale(pl)
export const timeAgo = new TimeAgo('pl')
var json = fs.readFileSync('db/notes.json', 'utf8');
export const data = Convert.toDataBase(json);
var cookieParser = require('cookie-parser')
const app: Express = express();
import { Account, Changeset, SessionsArray } from './interfaces';
export var loggedInSessions: SessionsArray;
export var accounts: Account[];
accounts = JSON.parse(fs.readFileSync('db/accounts.json', 'utf8'));
loggedInSessions = JSON.parse(fs.readFileSync('db/loggedInSessions.json', 'utf8'));
declare global {
  namespace Express {
    interface Request {
      account: Account | null;
    }
  }
}
import editorRoute from './routes/editorRoute';
export function saveToDB(): void {
  fs.writeFileSync('db/accounts.json', JSON.stringify(accounts, null, 2));
  fs.writeFileSync('db/loggedInSessions.json', JSON.stringify(loggedInSessions, null, 2));
}
function userAuthData(req: Request, res: Response, next: Function) {
  if (accounts[loggedInSessions[req.cookies.sID]]) {
    req.account = accounts[loggedInSessions[req.cookies.sID]]
  }
  else {
    req.account = null;
  }
  next()
}
import { setupReactViews } from "express-tsx-views";
import { Props } from "./tsx-views/my-view";
import indexRoute from './routes/indexRoute';
import subjectRoute from './routes/subjectRoute';
import lessonRoute from './routes/lessonRoute';
import noteRoute from './routes/noteRoute';
import { addRoute, addPOSTRoute } from './routes/addRoutes';
import exerciseRoute from './routes/exerciseRoute';
import userRoute  from './routes/userRoute';
import {loginRoute, loginPOSTRoute} from './routes/loginRoutes';
import { logoutRoute, logoutPOSTRoute } from './routes/logoutRoutes';

app.use('/static', express.static(__dirname + '/static'));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());

app.use(userAuthData)
setupReactViews(app, {
  viewsDirectory: `./tsx-views/`,
  prettify: true, // Prettify HTML output
});

app.get("/my-route", (req, res, next) => {
  const data: Props = { title: "cokolwiek", lang: "de" };
  res.render("my-view.tsx", data);
});
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs')
app.get('/editor', editorRoute)
app.get('/', indexRoute);
app.get('/s/:id', subjectRoute)
app.get('/s/:id/l/:lessonid', lessonRoute)
app.get('/s/:id/l/:lessonid/n/:noteid', noteRoute)
app.get('/s/:id/l/:lessonid/add/:type', addRoute)
app.post('/s/:id/l/:lessonid/add/:type', addPOSTRoute)
app.get('/s/:id/l/:lessonid/e/:exerciseid', exerciseRoute)
app.get('/user', userRoute)
app.get('/user/login', loginRoute)
app.post('/user/login', loginPOSTRoute)
app.get('/user/logout', logoutRoute)
app.post('/user/logout', logoutPOSTRoute)

app.listen(1447, () => {
  console.log(`⚡️[NOTAMARK]: Running at http://localhost:1447`);
});