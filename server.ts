import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';
import { Convert, DataBase, Person } from "./db/converter";
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
import {searchPOSTRoute, searchRoute} from './routes/searchRoutes';
import historyRoute from './routes/historyRoute';
import { addLessonPOSTRoute, addLessonRoute } from './routes/addLessonRoutes';
import { deleteNoteRoute, deleteNotePOSTRoute, deleteExerciseRoute, deleteExercisePOSTRoute, deleteLessonRoute, deleteLessonPOSTRoute } from './routes/deleteRoutes';
import { addPersonPOSTRoute, addPersonRoute, addSubjectPOSTRoute, addSubjectRoute, adminPanelRoute, deleteSubjectPOSTRoute, deleteSubjectRoute, editPersonRolesPOSTRoute, editPersonRolesRoute, editSubjectPOSTRoute, editSubjectRoute } from './routes/adminRoutes';
var json = fs.readFileSync('db/notes.json', 'utf8');
export const data = Convert.toDataBase(json);
export var dataRaw: DataBase = JSON.parse(fs.readFileSync('db/notes.json', 'utf8'));
var cookieParser = require('cookie-parser')
const app: Express = express();
export var loggedInSessions: SessionsArray;
loggedInSessions = JSON.parse(fs.readFileSync('db/loggedInSessions.json', 'utf8'));
declare global {
  namespace Express {
    interface Request {
      account: Account | null;
    }
  }
}
export var accounts: Person[] = dataRaw.persons;
export function saveToDB(): void {
  fs.writeFileSync('db/accounts.json', JSON.stringify(accounts, null, 2));
  fs.writeFileSync('db/loggedInSessions.json', JSON.stringify(loggedInSessions, null, 2));
}
function userAuthData(req: Request, res: Response, next: Function) {
  if (data.persons[loggedInSessions[req.cookies.sID]]) {
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
  if(req.path === '/') {
    res.redirect('/s/0/');
  }
  else if(req.path === '/search') {
    next();
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
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs')
app.get('/editor', editorRoute)
app.get('/', indexRoute);
app.get('/s/:id', subjectRoute)
app.get('/s/:id/add', addLessonRoute)
app.post('/s/:id/add', addLessonPOSTRoute)
app.get('/s/:id/l/:lessonid', lessonRoute)
app.get('/s/:id/l/:lessonid/delete', deleteLessonRoute)
app.post('/s/:id/l/:lessonid/delete', deleteLessonPOSTRoute)
app.get('/s/:id/l/:lessonid/n/:noteid/delete', deleteNoteRoute)
app.post('/s/:id/l/:lessonid/n/:noteid/delete', deleteNotePOSTRoute)
app.get('/s/:id/l/:lessonid/n/:noteid', noteRoute)
app.get('/s/:id/l/:lessonid/n/:noteid/h/:historyid', historyRoute)
app.get('/s/:id/l/:lessonid/add/:type', addRoute)
app.post('/s/:id/l/:lessonid/add/:type', addPOSTRoute)
app.get('/s/:id/l/:lessonid/e/:exerciseid', exerciseRoute)
app.get('/s/:id/l/:lessonid/e/:exerciseid/delete', deleteExerciseRoute)
app.post('/s/:id/l/:lessonid/e/:exerciseid/delete', deleteExercisePOSTRoute)
app.get('/s/:subjectid/l/:lessonid/edit/:type/:id', editRoute)
app.post('/s/:subjectid/l/:lessonid/edit/:type/:id', editPOSTRoute)
app.get('/user', userRoute)
app.get('/user/login', loginRoute)
app.post('/user/login', loginPOSTRoute)
app.get('/user/logout', logoutRoute)
app.post('/user/logout', logoutPOSTRoute)
app.get('/search', searchRoute)
app.post('/search', searchPOSTRoute)

app.get('/adminpanel', adminPanelRoute)
app.get('/adminpanel/edit/:id', editSubjectRoute)
app.post('/adminpanel/edit/:id', editSubjectPOSTRoute)
app.get('/adminpanel/delete/:id', deleteSubjectRoute)
app.post('/adminpanel/delete/:id', deleteSubjectPOSTRoute)
app.get('/adminpanel/add', addSubjectRoute)
app.post('/adminpanel/add', addSubjectPOSTRoute)
app.get('/adminpanel/add-person', addPersonRoute)
app.post('/adminpanel/add-person', addPersonPOSTRoute)
app.get('/adminpanel/edit-roles/:id', editPersonRolesRoute)
app.post('/adminpanel/edit-roles/:id', editPersonRolesPOSTRoute)

app.listen(1447, () => {
  console.log(`⚡️[NOTAMARK]: Running at http://localhost:1447`);
});