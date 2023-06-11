import { Request, Response } from 'express';
import {data} from '../server';
// /s/:id/l/:lessonid/edit/:type/:id
export function editRoute (req: Request<{id: number, lessonid: number, type: 'note' | 'exercise'}>, res: Response){
    const subject = data.subjects[req.params.id];
    const lesson = subject.lessons[req.params.lessonid];
    const type = req.params.type;
    if(subject && lesson && (type === 'note' || type === 'exercise')){
        const item = lesson[type == 'note' ? 'notes' : 'exercises'][req.params.id];
        res.send(item);
    }
    else {
        res.status(404).send('error');
    }
}
export function editPOSTRoute (req: Request, res: Response){
    res.send('edit')
}