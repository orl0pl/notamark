import { Request } from 'express';
import iconmapper from '../utils/iconmapper';
import { data, timeAgo } from '../server';
import saveChangesToNotes from '../utils/saveNotes';

export function addRoute(req: Request<{ id: number; lessonid: number; type: 'note' | 'exercise'; }>, res) {
  const subject = data.subjects[req.params.id];
  const lesson = subject.lessons[req.params.lessonid];

  const type = req.params.type;
  if (lesson && subject && req.account?.roles.includes('editor') && (type === 'note' || type === 'exercise')) {
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
    });
  }
  else {
    res.send('error');
  }
}
export function addPOSTRoute(req: Request<{ id: number; lessonid: number; type: 'note' | 'exercise'; }, {}, { input: string; realDateOrReference: string; }>, res) {
  const subject = data.subjects[req.params.id];
  const lesson = subject.lessons[req.params.lessonid];
  const type = req.params.type;
  console.log(req.body, req.account);
  if (lesson && subject && req.account?.roles.includes('editor') && (type === 'note' || type === 'exercise')) {
    res.send('ok');
    if (type === 'note') {
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
      });
    }
    else {
      lesson.exercises.push({
        id: lesson.exercises.length,
        reference: req.body.realDateOrReference,
        updateDate: Date.now() / 1000,
        addedBy: req.account.id,
        solution: req.body.input.length > 0 ? req.body.input : null,
      });
    }
    saveChangesToNotes();
  }
  else {
    res.send('error');
  }
}
