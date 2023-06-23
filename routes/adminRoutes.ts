import { Request, Response } from "express";
import ReactDOMServer from 'react-dom/server';
import AdminPanel from "../views/adminPanel";
import { data } from "../server";
import iconmapper from "../utils/iconmapper";
import saveChangesToNotes from "../utils/saveNotes";
import { randomBytes } from "crypto";
export function adminPanelRoute(req: Request, res: Response) {
    if (req.account?.roles.includes("admin")) {
        const jsx = ReactDOMServer.renderToString(AdminPanel({
            data: data,
            url: '../'
        }));
        res.send(jsx);
    } else {
        res.send("not admin");
    }
}
export function editSubjectRoute(req: Request<{ id: number }>, res: Response) {
    if (req.account?.roles.includes("admin")&&data.subjects[req.params.id]) {
        res.render("editSubject", {
            url: '../../../',
            mi: iconmapper,
            oldName: data.subjects[req.params.id].name
        })
    }
    else {
        res.send("not admin");
    }
}
export function editSubjectPOSTRoute(req: Request<{ id: number }, {}, { name: string }>, res: Response) {
    if (req.account?.roles.includes("admin")&&data.subjects[req.params.id]&&req.body.name) {
        data.subjects[req.params.id].name = req.body.name;
        saveChangesToNotes();
        res.send("zmieniono nazwę");
    }
    else {
        res.send("not admin");
    }
}
export function deleteSubjectRoute(req: Request<{ id: number }>, res: Response) {
    if (req.account?.roles.includes("admin")&&data.subjects[req.params.id]) {
        res.render('delete', {
            url: '../../../',
            deletionTypeName: 'przedmiot',
            mi: iconmapper,
            verificationCode: `${req.params.id}-${randomBytes(2).toString('hex')}`,
        })
    }
    else {
        res.send("not admin");
    }
}
export function deleteSubjectPOSTRoute(req: Request<{ id: number }>, res: Response) {
    if (req.account?.roles.includes("admin")&&data.subjects[req.params.id]) {
        data.subjects.splice(req.params.id, 1);
        saveChangesToNotes();
        res.send("przedmiot usunięty");
    }
    else {
        res.send("not admin");
    }
}
export function addSubjectRoute(req: Request, res: Response) {
    if (req.account?.roles.includes("admin")) {
        res.render("addSubject", {
            url: '../../',
            mi: iconmapper
        })
    }
    else {
        res.send("not admin");
    }
}
export function addSubjectPOSTRoute(req: Request<{},{},{ name: string }>, res: Response) {
    if (req.account?.roles.includes("admin")&&req.body.name) {
        data.subjects.push({
            id: data.subjects.length,
            name: req.body.name,
            infos: [],
            lessons: []
        })
        saveChangesToNotes();
        res.send("added subject");
    }
    else {
        res.send("not admin");
    }
}
export function addPersonRoute(req: Request, res: Response) {
    if (req.account?.roles.includes("admin")) {
        res.render("addPerson", {
            url: '../../',
            mi: iconmapper,
        })
    }
    else {
        res.send("not admin");
    }
}
export function addPersonPOSTRoute(req: Request<{},{},{name:string, password:string, user: 'on'|undefined, editor: 'on'|undefined, admin: 'on'|undefined, }>, res: Response) {
    var roles: Array<'user' | 'editor' | 'admin'> = []
    if (req.body.user == 'on') roles.push('user');
    if (req.body.editor == 'on') roles.push('editor');
    if (req.body.admin == 'on') roles.push('admin');
    
    if (req.account?.roles.includes("admin")&&req.body.name&&req.body.password) {
        console.log(req.body);
        data.persons.push({
            id: data.persons.length,
            name: req.body.name,
            password: req.body.password,
            roles: roles,
        })
        saveChangesToNotes();
        res.send("added person");
    }
    else {
        res.send("not admin");
    }
}
export function editPersonRolesRoute(req: Request<{ id: number }>, res: Response){
    if (req.account?.roles.includes("admin")) {
        res.render("editPerson", {
            url: '../../../',
            mi: iconmapper,
        })
    }
    else {
        res.send("not admin");
    }
}
export function editPersonRolesPOSTRoute(req: Request<{ id: string },{},{name:string, password:string, user: 'on'|undefined, editor: 'on'|undefined, admin: 'on'|undefined}>, res: Response){
    var roles: Array<'user' | 'editor' | 'admin'> = []
    if (req.body.user == 'on') roles.push('user');
    if (req.body.editor == 'on') roles.push('editor');
    if (req.body.admin == 'on') roles.push('admin');
    
    if (req.account?.roles.includes("admin")) {
        console.log(req.body);
        const editedUser = {
            id: parseInt(req.params.id),
            name: req.body.name,
            password: req.body.password,
            roles: roles,
        }
        data.persons[req.params.id] = editedUser;
        saveChangesToNotes();
        res.send("edited person");
    }
    else {
        res.send("not admin");
    }
}
export function deletePersonRoute(req: Request<{ id: number }>, res: Response){
    if (req.account?.roles.includes("admin")) {
        res.render('delete', {
            url: '../../../',
            deletionTypeName: 'osobę',
            mi: iconmapper,
            verificationCode: `${req.params.id}-${randomBytes(2).toString('hex')}`,
        })
    }
    else {
        res.send("not admin");
    }
}
export function deletePersonPOSTRoute(req: Request, res: Response){
    if (req.account?.roles.includes("admin")) {
        res.send("admin");
    }
    else {
        res.send("not admin");
    }
}