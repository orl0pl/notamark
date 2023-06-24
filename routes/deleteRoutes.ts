import { Request, Response } from 'express';
import { data, timeAgo } from '../server';
import iconmapper from '../utils/iconmapper';
import saveChangesToNotes from '../utils/saveNotes';
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
export function deleteNotePOSTRoute(req: Request<{ id: number; lessonid: number; noteid: number; }>, res: Response) {
    const subject = data.subjects[req.params.id];
    const lesson = subject.lessons[req.params.lessonid];
    const note = lesson.notes[req.params.noteid];
    const isUserAllowed = req.account?.roles.includes('admin');
    if (lesson && subject && note && isUserAllowed) {
        note.content = 'Zawartość została usunięta.';
        note.realDate = 'Usunięto';
        note.updateDate = Math.floor(Date.now() / 1000);
        note.contentHistory = [];
        saveChangesToNotes();
        res.redirect('back')
    }
    else if(!isUserAllowed) {
        res.send('not allowed');
    }
    else {
        res.send('not found');
    }
}
export function deleteExerciseRoute(req: Request<{ id: number; lessonid: number; noteid: number; }>, res: Response) {
    const subject = data.subjects[req.params.id];
    const lesson = subject.lessons[req.params.lessonid];
    const exercise = lesson.exercises[req.params.noteid];
    const isUserAllowed = req.account?.roles.includes('admin');
    if (lesson && subject && exercise && isUserAllowed) {
        res.render('delete', {
            url: '../'.repeat(7),
            mi: iconmapper,
            timeAgo: timeAgo,
            deletionType: 'exercise',
            deletionTypeName: 'zadanie',
            verificationCode: `${req.params.noteid}-${req.params.id}-exercise`,
            
        })
    }
    else if(!isUserAllowed) {
        res.send('not allowed');
    }
    else {
        res.send('not found');
    }
}
export function deleteExercisePOSTRoute(req: Request<{ id: number; lessonid: number; noteid: number; }>, res: Response) {
    const subject = data.subjects[req.params.id];
    const lesson = subject.lessons[req.params.lessonid];
    const exercise = lesson.exercises[req.params.noteid];
    const isUserAllowed = req.account?.roles.includes('admin');
    if (lesson && subject && exercise && isUserAllowed) {
        res.redirect('back')
        exercise.solution = null;
        exercise.reference = 'Usunięto';
        exercise.updateDate = Math.floor(Date.now() / 1000);
        saveChangesToNotes()
    }
    else if(!isUserAllowed) {
        res.send('not allowed');
    }
    else {
        res.send('not found');
    }

}
// /s/:subjectid/l/:lessonid/delete
export function deleteLessonRoute(req: Request<{ id: number; lessonid: number }>, res: Response) {
    const subject = data.subjects[req.params.id];
    const lesson = subject.lessons[req.params.lessonid];
    const isUserAllowed = req.account?.roles.includes('admin');
    if (lesson && subject && isUserAllowed) {
        res.render('delete', {
            url: '../'.repeat(5),
            mi: iconmapper,
            timeAgo: timeAgo,
            deletionType: 'lesson',
            deletionTypeName: 'lekcję',
            verificationCode: `${req.params.lessonid}-${req.params.id}-lesson`,
            
        })
    }
    else if(!isUserAllowed) {
        res.send('not allowed');
    }
    else {
        res.send('not found');
    }
}
export function deleteLessonPOSTRoute(req: Request<{ id: number; lessonid: number }>, res: Response) {
    const subject = data.subjects[req.params.id];
    const lesson = subject.lessons[req.params.lessonid];
    const isUserAllowed = req.account?.roles.includes('admin');
    if (lesson && subject && isUserAllowed) {
        lesson.notes = [];
        lesson.exercises = [];
        lesson.updateDate = Math.floor(Date.now() / 1000);
        lesson.topic = 'Lekcja usunięta';
        lesson.realStartDate = '';
        res.redirect('back')
        saveChangesToNotes()
    }
    else if(!isUserAllowed) {
        res.send('not allowed');
    }
    else {
        res.send('not found');
    }
}