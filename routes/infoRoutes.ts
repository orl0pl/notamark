import { Request, Response } from "express";
import iconmapper from "../utils/iconmapper";
import { data, timeAgo } from "../server";
import saveChangesToNotes from "../utils/saveNotes";
export function addInfoRoute(req: Request<{ id: number }>, res: Response){
    if(req.account?.roles.includes('editor')) {
        res.render("addInfo", {
            url: '../../../',
            mi: iconmapper,
    
        })
    }
    else {
        res.send("not editor");
    }
}
export function addInfoPOSTRoute(req: Request<{ id: number }, {}, {content: string}>, res: Response){
    if(req.account?.roles.includes('editor')&&req.body.content) {
        data.subjects[req.params.id].infos.push({
            addedBy: req.account.id,
            content: req.body.content,
            id: data.subjects[req.params.id].infos.length,
            updateDate: Math.floor(Date.now() / 1000)
        })
        res.send("added info");
        saveChangesToNotes()
    }
    else {
        res.send("not editor");
    }
}
export function deleteInfoRoute(req: Request<{id: number, infoId: number}>, res: Response){
    
    if (!data.subjects[req.params.id].infos[req.params.infoId]){
        res.status(404).send('info not found')
    }
    else if(req.account?.roles.includes('editor')){
        res.render('delete', {
            url: '../'.repeat(5),
            mi: iconmapper,
            timeAgo: timeAgo,
            deletionType: 'info',
            deletionTypeName: 'informację',
            verificationCode: `${req.params.infoId}-${req.params.id}-info`,
        })
    }
    else {
        res.send('not editor')
    }
}
export function deleteInfoPOSTRoute(req: Request<{id: number, infoId: number}>, res: Response){
    if (!data.subjects[req.params.id].infos[req.params.infoId]){
        res.status(404).send('info not found')
    }
    else if(req.account?.roles.includes('editor')){
        data.subjects[req.params.id].infos[req.params.infoId] = {
            id: req.params.infoId,
            content: "Usunięto",
            addedBy: data.subjects[req.params.id].infos[req.params.infoId].addedBy,
            updateDate: Math.floor(Date.now() / 1000)
        }
        res.send('note deleted')
    }
    else {
        res.send('not editor')
    }
}