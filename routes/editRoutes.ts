import { Request, Response } from "express";
import { accounts, data, saveToDB, timeAgo } from "../server";
import iconmapper from "../utils/iconmapper";
import { Exercise, Note } from "../db/converter";
import saveChangesToNotes from "../utils/saveNotes";
// /s/:subjectid/l/:lessonid/edit/:type/:id
export function editRoute(
    req: Request<{ id: number; lessonid: number; type: "note" | "exercise", subjectid: number }>,
    res: Response
) {
    const subject = data.subjects[req.params.subjectid];
    if (!subject) {
        res.status(404).send("error: unknown subject");
        return;
    }
    const lesson = subject.lessons[req.params.lessonid];
    if (!lesson) {
        res.status(404).send("error: unknown lesson");
        return;
    }
    const type = req.params.type;
    if (!(type === "note" || type === "exercise")) {
        res.status(404).send("error: unknown type");
        return;
    }
    if(!req.account?.roles.includes("editor")) {
        res.status(403).send("error: access denied. You must be an editor to edit");
        return;
    }
    const item = lesson[`${type}s`][req.params.id];
    if(!item) {
        res.status(404).send("error: unknown item");
        return;
    }
    res.render("existingEditor", {
        url: "../../../../../../../",
        type: type,
        account: req.account,
        mi: iconmapper,
        timeAgo: timeAgo,
        existingContent: item[type == "note" ? "content" : "solution"],
        item: item,
        accounts: accounts,
    })
}
export function editPOSTRoute(req: Request<{ id: number; lessonid: number; type: "note" | "exercise", subjectid: number }, {}, {
    input: string
}>, res: Response) {
    const subject = data.subjects[req.params.subjectid];
    if (!subject) {
        res.status(404).send("error: unknown subject");
        return;
    }
    const lesson = subject.lessons[req.params.lessonid];
    if (!lesson) {
        res.status(404).send("error: unknown lesson");
        return;
    }
    const type = req.params.type;
    if (!(type === "note" || type === "exercise")) {
        res.status(404).send("error: unknown type");
        return;
    }
    if(!req.account?.roles.includes("editor")) {
        res.status(403).send("error: access denied. You must be an editor to edit");
        return;
    }
    var item = lesson[`${type}s`][req.params.id];
    if(!item) {
        res.status(404).send("error: unknown item");
        return;
    }
    const content = req.body.input;
    if (!content) return;

    if(type == "note"){
        item = item as Note;
        item.content = content;
        item.updateDate = Date.now() / 1000;
        item.addedBy = req.account.id;
        item.contentHistory.push({
            content: content,
            updateDate: Date.now() / 1000,
            addedBy: req.account.id
        });
    }
    else if(type == "exercise"){
        item = item as Exercise;
        item.solution = content;
        item.updateDate = Date.now() / 1000;
        item.addedBy = req.account.id;
    }

    console.log(item);
    console.log(data.subjects[req.params.subjectid].lessons[req.params.lessonid][`${type}s`][req.params.id] == item);

    saveChangesToNotes();

    res.redirect(`/s/${req.params.subjectid}/l/${req.params.lessonid}/${type.charAt(0)}/${req.params.id}`);
}
