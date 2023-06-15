import { Request, Response } from 'express';
import iconmapper from '../utils/iconmapper';
export function addLessonRoute(req: Request<{id: number}>, res: Response) {
    res.render('addLesson', {
        account: req.account,
        url: '../../../',
        mi: iconmapper,
        error: null
        
    })
}
export function addLessonPOSTRoute(req: Request, res: Response) {
    res.send('addLessonPOST');
}