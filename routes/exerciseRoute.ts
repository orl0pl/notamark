import { Request, Response } from 'express';
import katex from 'katex';
const sanitizeHtml = require('sanitize-html');
var showdown = require('showdown');
import iconmapper from '../utils/iconmapper';
import { data, timeAgo } from '../server';

export default function exerciseRoute(req: Request<{ id: number; lessonid: number; exerciseid: number; }>, res: Response) {
  const subject = data.subjects[req.params.id];
  const lesson = subject.lessons[req.params.lessonid];
  const exercise = lesson.exercises[req.params.exerciseid];
  var converter = new showdown.Converter({
    tables: true,
    strikethrough: true,
    underline: true,
    simpleLineBreaks: true,
    emoji: true
  });

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
    });
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
    });
  }
  else {
    res.redirect('back');
  }
}
