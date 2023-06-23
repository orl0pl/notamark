import { Request, Response } from "express";
import iconmapper from "../utils/iconmapper";
import { data } from "../server";
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