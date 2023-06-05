import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';
import { Convert, DataBase } from "./db/converter";
import fs from 'fs';
import katex from 'katex';
const sanitizeHtml = require('sanitize-html');
import TimeAgo from 'javascript-time-ago'
import pl from 'javascript-time-ago/locale/pl'
TimeAgo.addDefaultLocale(pl)
const timeAgo = new TimeAgo('pl')
var json = fs.readFileSync('db/notes.json', 'utf8');
const data = Convert.toDataBase(json);
const diff = require('diff');
var cookieParser = require('cookie-parser')
const app: Express = express();
var showdown = require('showdown')
const iconmap = require('./utils/iconmap.json');
import { Account, Changeset, SessionsArray } from './interfaces';
var loggedInSessions: SessionsArray;
var accounts: Account[];
var changesets: Changeset[];
accounts = JSON.parse(fs.readFileSync('db/accounts.json', 'utf8'));
changesets = JSON.parse(fs.readFileSync('db/changesets.json', 'utf8'));
loggedInSessions = JSON.parse(fs.readFileSync('db/loggedInSessions.json', 'utf8'));
declare global {
  namespace Express {
    interface Request {
      account: Account | null;
    }
  }
}
function saveToDB(): void {
  fs.writeFileSync('db/accounts.json', JSON.stringify(accounts, null, 2));
  fs.writeFileSync('db/loggedInSessions.json', JSON.stringify(loggedInSessions, null, 2));
}
function saveChangesToNotes(): void {
  fs.writeFileSync('db/notes.json', JSON.stringify(data, null, 2));
}
function iconmapper(name: string) {
  var foundIcon = iconmap.find((obj: { name: string; }) => obj.name === name);
  var codepoint = foundIcon ? foundIcon.codepoint : iconmap[0].codepoint;
  return String.fromCodePoint(parseInt(codepoint, 16))
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
setupReactViews(app, {
  viewsDirectory: `${__dirname}/tsx-views/`,
  prettify: true, // Prettify HTML output
});

app.get("/my-route", (req, res, next) => {
  const data: Props = { title: "Test", lang: "de" };
  res.render("my-view.tsx", data);
});


// const string1 = "Hi!";
// const string2 = "Hello world!";

// const changes = diff.diffWordsWithSpace(string1, string2);

// console.log(changes);

app.use('/static', express.static(__dirname + '/static'));
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(userAuthData)
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs')
app.get('/editor', (req, res) => {
  if (req.account?.roles.includes('editor')) {
    res.render('editor', {
      url: '../../',
      mi: iconmapper,
      error: null,
      account: req.account
    })

  }
  else {
    res.send('You cannot edit')
  }
})
app.get('/', (req: Request, res: Response) => {
  // var response = ``
  // req.account ? response = `You are logged in as ${req.account.name}` : response = `You are not logged in`
  // res.send(response)
  res.render('mainpage', {
    account: req.account,
    url: '/',
    mi: iconmapper,
    subjects: data.subjects,
    persons: data.persons,
    timeAgo: timeAgo,
    selectedSubjectId: null

  })
  //console.log(req.account)
});
app.get('/s/:id', (req: Request<{ id: number }>, res: Response) => {
  const subject = data.subjects[req.params.id]
  if (subject) {
    res.render('subject', {
      account: req.account,
      url: '../../',
      mi: iconmapper,
      timeAgo: timeAgo,
      subjects: data.subjects,
      subject: subject,
      persons: data.persons,
      selectedSubjectId: req.params.id,

    })
  }
  else {
    res.redirect('/')
  }

})
app.get('/s/:id/l/:lessonid', (req: Request<{ id: number, lessonid: number }>, res: Response) => {
  const subject = data.subjects[req.params.id]
  const lesson = subject.lessons[req.params.lessonid]
  if (lesson && subject) {
    res.render('lesson', {
      account: req.account,
      url: '../../../../',
      mi: iconmapper,
      timeAgo: timeAgo,
      subjects: data.subjects,
      subject: subject,
      lessons: subject.lessons,
      persons: data.persons,
      lesson: lesson,
      selectedSubjectId: req.params.id,
      selectedLessonId: req.params.lessonid,
      selectedLesson: lesson
    })
  }
  else {
    res.redirect('/')
  }
})
app.get('/s/:id/l/:lessonid/n/:noteid', (req: Request<{ id: number, lessonid: number, noteid: number }>, res: Response) => {
  const subject = data.subjects[req.params.id]
  const lesson = subject.lessons[req.params.lessonid]
  const note = lesson.notes[req.params.noteid]
  var converter = new showdown.Converter()
  converter.setOption('simpleLineBreaks', true);
    
  if (lesson && subject && note) {
    
    var renderedHtml: string = converter.makeHtml(note.content);
    var html = sanitizeHtml(renderedHtml);
    html = html.replace(/\$\$(.*?)\$\$/g, function(outer: any, inner: string) {
      return katex.renderToString(inner, { displayMode: true, throwOnError: false, errorColor: 'var(--md-sys-color-error)' });
  }).replace(/\\\[(.*?)\\\]/g, function(outer: any, inner: any) {
      return katex.renderToString(inner, { displayMode: true, throwOnError: false, errorColor: 'var(--md-sys-color-error)' });
  }).replace(/\\\((.*?)\\\)/g, function(outer: any, inner: any) {
      return katex.renderToString(inner, { displayMode: false, throwOnError: false, errorColor: 'var(--md-sys-color-error)' });
  }).replace(/\$(.*?)\$/g, function(outer: any, inner: string) {
    return katex.renderToString(inner, { displayMode: false, throwOnError: false, errorColor: 'var(--md-sys-color-error)' });
})
  console.log(html)
    res.render('note', {
      account: req.account,
      url: '../../../../../../',
      mi: iconmapper,
      timeAgo: timeAgo,
      subjects: data.subjects,
      subject: subject,
      lessons: subject.lessons,
      persons: data.persons,
      lesson: lesson,
      selectedSubjectId: req.params.id,
      selectedLessonId: req.params.lessonid,
      selectedNoteId: req.params.noteid,
      rawContent: lesson.notes[req.params.noteid].content,
      selectedLesson: lesson,
      renderedContent: html
    })
  }
  else {
    res.redirect('back')
  }
})
app.get('/user', (req: Request, res: Response) => {
  var response = ``
  console.log(loggedInSessions)
  console.log(loggedInSessions[req.cookies.sID] !== undefined)
  if (loggedInSessions[req.cookies.sID] !== undefined) {
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
  if (!loggedInSessions.hasOwnProperty(sID)) {
    return sID;
  }
  return randomSID();
}
app.post('/user/login', (req: Request, res: Response) => {
  const body: {
    username: string;
    password: string;
  } = req.body;
  if (accounts.find((obj: { name: string; password: string; }) => obj.name === body.username && obj.password === body.password)) {
    const newSID = randomSID()
    res.cookie('sID', newSID)
    loggedInSessions[newSID] = accounts.findIndex((obj: { name: string; password: string; }) => obj.name === body.username && obj.password === body.password)
    res.redirect('/user')
    saveToDB()
  } else {
    res.render('login', {
      url: '../../',
      mi: iconmapper,
      error: 403,

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