import { Request, Response } from 'express';
import { data, timeAgo } from '../server';
import iconmapper from '../utils/iconmapper';
export function deleteNoteRoute(req: Request<{ id: number; lessonid: number; noteid: number; }>, res: Response) {
    const subject = data.subjects[req.params.id];
    const lesson = subject.lessons[req.params.lessonid];
    const note = lesson.notes[req.params.noteid];
    const isUserAllowed = req.account?.roles.includes('admin');
    if (lesson && subject && note && isUserAllowed) {
        res.render('delete', {
            url: '../'.repeat(7),
            mi: iconmapper,
            timeAgo: timeAgo,
            deletionType: 'note',
            deletionTypeName: 'notatkę',
            verificationCode: `${note.id}-${subject.id}-note`,
            
        })
    }
    else if(!isUserAllowed) {
        res.send('not allowed');
    }
    else {
        res.send('not found');
    }
    
}
export function deleteNotePOSTRoute(req: Request, res: Response) {
    res.send('delete note')
}
export function deleteExerciseRoute(req: Request, res: Response) {
    res.send('delete exercise')
}
export function deleteExercisePOSTRoute(req: Request, res: Response) {
    res.send('delete exercise')
}
export function deleteLessonRoute(req: Request, res: Response) {
    res.send('delete lesson')
}
export function deleteLessonPOSTRoute(req: Request, res: Response) {
    res.send('delete lesson')
}
export function deleteSubjectRoute(req: Request, res: Response) {
    res.send('delete subject')
}
export function deleteSubjectPOSTRoute(req: Request, res: Response) {
    res.send('delete subject')
}