import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';
import { Convert } from "./db/converter";
import fs from 'fs';
import TimeAgo from 'javascript-time-ago';
import pl from 'javascript-time-ago/locale/pl';
TimeAgo.addDefaultLocale(pl)
export const timeAgo = new TimeAgo('pl')
import { Account, SessionsArray } from './interfaces';
import { setupReactViews, reactViews, } from "express-tsx-views";
import { Props } from "./tsx-views/my-view";
// ROUTES
import editorRoute from './routes/editorRoute';
import indexRoute from './routes/indexRoute';
import subjectRoute from './routes/subjectRoute';
import lessonRoute from './routes/lessonRoute';
import noteRoute from './routes/noteRoute';
import { addRoute, addPOSTRoute } from './routes/addRoutes';
import exerciseRoute from './routes/exerciseRoute';
import userRoute from './routes/userRoute';
import { loginRoute, loginPOSTRoute } from './routes/loginRoutes';
import { logoutRoute, logoutPOSTRoute } from './routes/logoutRoutes';
import {editRoute, editPOSTRoute} from './routes/editRoutes';
import {searchRoute} from './routes/searchRoutes';
var json = fs.readFileSync('db/notes.json', 'utf8');
export const data = Convert.toDataBase(json);
var cookieParser = require('cookie-parser')
const app: Express = express();
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
app.use('/static', express.static(`${__dirname}/static`));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(userAuthData)
app.use((req, res, next) => {
  console.log(req.path);
  if(req.path === '/') {
    res.redirect('/s/0/');
  }
  else {
    if (req.path.substr(-1) !== '/' && req.path.length > 1) {
      console.log(req.path);
      const query = req.url.slice(req.path.length);
      res.redirect(301, req.path + '/' + query);
    } else {
      next();
    }
  }
});
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
app.get('/s/:subjectid/l/:lessonid/edit/:type/:id', editRoute)
app.post('/s/:subjectid/l/:lessonid/edit/:type/:id', editPOSTRoute)
app.get('/user', userRoute)
app.get('/user/login', loginRoute)
app.post('/user/login', loginPOSTRoute)
app.get('/user/logout', logoutRoute)
app.post('/user/logout', logoutPOSTRoute)
app.post('/search', searchRoute)

app.listen(1447, () => {
  console.log(`⚡️[NOTAMARK]: Running at http://localhost:1447`);
});