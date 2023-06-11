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
var cookieParser = require('cookie-parser')
const app: Express = express();
var showdown = require('showdown')
const iconmap = require('./utils/iconmap.json');
import { Account, Changeset, SessionsArray } from './interfaces';
var loggedInSessions: SessionsArray;
var accounts: Account[];
accounts = JSON.parse(fs.readFileSync('db/accounts.json', 'utf8'));
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

app.get('/editor', (req, res) => {
  if (req.account?.roles.includes('editor')) {
    res.render('editor.ejs', {
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
  var converter = new showdown.Converter({
    tables: true,
    strikethrough: true,
    underline: true,
    simpleLineBreaks: true,
    emoji: true
  })

  if (lesson && subject && note) {

    var renderedHtml: string = converter.makeHtml(note.content);
    var html = sanitizeHtml(renderedHtml);
    html = html.replace(/\$\$(.*?)\$\$/g, function (outer: any, inner: string) {
      return katex.renderToString(inner, { displayMode: true, throwOnError: false, errorColor: 'var(--md-sys-color-error)' });
    }).replace(/\\\[(.*?)\\\]/g, function (outer: any, inner: any) {
      return katex.renderToString(inner, { displayMode: true, throwOnError: false, errorColor: 'var(--md-sys-color-error)' });
    }).replace(/\\\((.*?)\\\)/g, function (outer: any, inner: any) {
      return katex.renderToString(inner, { displayMode: false, throwOnError: false, errorColor: 'var(--md-sys-color-error)' });
    }).replace(/\$(.*?)\$/g, function (outer: any, inner: string) {
      return katex.renderToString(inner, { displayMode: false, throwOnError: false, errorColor: 'var(--md-sys-color-error)' });
    })
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
      selectedNote: note,
      selectedLesson: lesson,
      renderedContent: html
    })
  }
  else {
    res.send('Not found')
  }
})
app.get('/s/:id/l/:lessonid/add/:type', (req: Request<{ id: number, lessonid: number, type: 'note'|'exercise' }>, res) => {
  const subject = data.subjects[req.params.id]
  const lesson = subject.lessons[req.params.lessonid]
  
  const type = req.params.type
  if (lesson && subject && req.account?.roles.includes('editor')  && (type === 'note' || type === 'exercise')) {
    res.render('editor', {
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
      selectedLesson: lesson,
      type: type,
      uuid: lesson.notes.length
    })
  }
  else {
    res.send('error')
  }
})
app.post('/s/:id/l/:lessonid/add/:type', (req: Request<{ id: number, lessonid: number, type: 'note'|'exercise' }, {}, { input: string, realDateOrReference: string }>, res) => {
  const subject = data.subjects[req.params.id]
  const lesson = subject.lessons[req.params.lessonid]
  const type = req.params.type;
  console.log(req.body, req.account)
  if (lesson && subject && req.account?.roles.includes('editor') && (type === 'note' || type === 'exercise')) {
    res.send('ok')
    if(type === 'note') {
      lesson.notes.push({
        content: req.body.input,
        updateDate: Date.now() / 1000,
        id: lesson.notes.length,
        contentHistory: [{
          content: req.body.input,
          updateDate: Date.now() / 1000,
          addedBy: 0
        }],
        realDate: req.body.realDateOrReference,
        addedBy: req.account.id
      })
    }
    else {
      lesson.exercises.push({
        id: lesson.exercises.length,
        reference: req.body.realDateOrReference,
        updateDate: Date.now() / 1000,
        addedBy: req.account.id,
        solution: req.body.input.length > 0 ? req.body.input : null,
      })
    }
    saveChangesToNotes()
  }
  else {
    res.send('error')
  }
})
app.get('/s/:id/l/:lessonid/e/:exerciseid', (req: Request<{ id: number, lessonid: number, exerciseid: number }>, res: Response) => {
  const subject = data.subjects[req.params.id]
  const lesson = subject.lessons[req.params.lessonid]
  const exercise = lesson.exercises[req.params.exerciseid]
  var converter = new showdown.Converter({
    tables: true,
    strikethrough: true,
    underline: true,
    simpleLineBreaks: true,
    emoji: true
  })

  if (lesson && subject && exercise) {

    var renderedHtml: string = converter.makeHtml(exercise.solution || '<p>Brak rozwiązania zadania</p>');
    var html = sanitizeHtml(renderedHtml);
    html = html.replace(/\$\$(.*?)\$\$/g, function (outer: any, inner: string) {
      return katex.renderToString(inner, { displayMode: true, throwOnError: false, errorColor: 'var(--md-sys-color-error)' });
    }).replace(/\\\[(.*?)\\\]/g, function (outer: any, inner: any) {
      return katex.renderToString(inner, { displayMode: true, throwOnError: false, errorColor: 'var(--md-sys-color-error)' });
    }).replace(/\\\((.*?)\\\)/g, function (outer: any, inner: any) {
      return katex.renderToString(inner, { displayMode: false, throwOnError: false, errorColor: 'var(--md-sys-color-error)' });
    }).replace(/\$(.*?)\$/g, function (outer: any, inner: string) {
      return katex.renderToString(inner, { displayMode: false, throwOnError: false, errorColor: 'var(--md-sys-color-error)' });
    })
    res.render('exercise', {
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
      selectedexerciseId: req.params.exerciseid,
      rawContent: lesson.exercises[req.params.exerciseid].solution || '',
      selectedLesson: lesson,
      selectedExercise: exercise,
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