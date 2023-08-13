import { Request, Response } from 'express';
import katex from 'katex';
import sanitizeHtml from 'sanitize-html';
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
    backslashEscapesHTMLTags: true,
    emoji: true
  });

  if (lesson && subject && note) {
    var renderedHtml: string = converter.makeHtml(note.content);
    var html = sanitizeHtml(renderedHtml, {
      allowedAttributes: {
        'p': ["style"],
      },
      allowedStyles: {
        '*': {
          // Match HEX and RGB
          'color': [/^#(0x)?[0-9a-f]+$/i, /red/, /green/, /blue/],
          'text-align': [/^left$/, /^right$/, /^center$/],
          // Match any number with px, em, or %
          'font-size': [/^\d+(?:px|em|%)$/]
        },
      }
    });
    console.log(html)
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
