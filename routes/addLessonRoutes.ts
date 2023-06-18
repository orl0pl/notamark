import { Request, Response } from 'express';
import iconmapper from '../utils/iconmapper';
import { data } from '../server';
import saveChangesToNotes from '../utils/saveNotes';
export function addLessonRoute(req: Request<{id: number}>, res: Response) {
    const subject = data.subjects[req.params.id];
    const isDataValid = subject;
    
    if (isDataValid && req.account?.roles.includes('editor')) {
        res.render('addLesson', {
            account: req.account,
            url: '../../../',
            mi: iconmapper,
            error: null
            
        })
    }
    else {
        res.sendStatus(403);
    }
    
}
export function addLessonPOSTRoute(req: Request<{id: number}, {}, {topic: string, realStartDate: string}>, res: Response) {
    const subject = data.subjects[req.params.id];
    const isDataValid = req.body.topic && req.body.realStartDate && subject;
    
    if (isDataValid && req.account?.roles.includes('editor')) {
        data.subjects[req.params.id].lessons.push({
            topic: req.body.topic,
            realStartDate: req.body.realStartDate,
            id: data.subjects[req.params.id].lessons.length,
            updateDate: Math.floor(Date.now() / 1000),
            addedBy: req.account.id,
            notes: [],
            exercises: []
        })
        res.send(`addLessonPOST ${req.body.topic} ${req.body.realStartDate}`);
        saveChangesToNotes()
    }
    else {
        res.sendStatus(403);
    }
}