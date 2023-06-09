import { Request, Response } from 'express';
import katex from 'katex';
const sanitizeHtml = require('sanitize-html');
var showdown = require('showdown');
import iconmapper from '../utils/iconmapper';
import MyComponent, { NoteViewProps } from '../views/note';
import { data, timeAgo } from '../server';
import ReactDOMServer from 'react-dom/server';

export default function noteRoute(req: Request<{ id: number; lessonid: number; noteid: number; }>, res: Response) {
  const subject = data.subjects[req.params.id];
  const lesson = subject.lessons[req.params.lessonid];
  const note = lesson.notes[req.params.noteid];
  var converter = new showdown.Converter({
    tables: true,
    strikethrough: true,
    underline: true,
    simpleLineBreaks: true,
    emoji: true
  });

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
    });
    const jsx = ReactDOMServer.renderToString(MyComponent({
      account: req.account,
      url: '../../../../../../',
      mi: iconmapper,
      timeAgo: timeAgo,
      persons: data.persons,
      lesson: lesson,
      selectedNote: note,
      renderedContent: html
    }),);
  res.send(jsx);
  }
  else {
    res.send('Not found');
  }
}
