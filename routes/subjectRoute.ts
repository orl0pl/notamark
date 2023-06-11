import { Request, Response } from 'express';
import iconmapper from '../utils/iconmapper';
import { data, timeAgo } from '../server';

export default function subjectRoute(req: Request<{ id: number; }>, res: Response) {
  const subject = data.subjects[req.params.id];
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
    });
  }
  else {
    res.redirect('/');
  }
}
