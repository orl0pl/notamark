import { Request, Response } from 'express';
import iconmapper from '../utils/iconmapper';
import { data, timeAgo } from '../server';

export default function lessonRoute(req: Request<{ id: number; lessonid: number; }>, res: Response) {
  const subject = data.subjects[req.params.id];
  const lesson = subject.lessons[req.params.lessonid];
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
    });
  }
  else {
    res.redirect('/');
  }
}
