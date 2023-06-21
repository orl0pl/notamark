import { Request, Response } from "express";
import ReactDOMServer from 'react-dom/server';
import AdminPanel from "../views/adminPanel";
import { data } from "../server";
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
export function editSubjectRoute(req: Request, res: Response) {
    if (req.account?.roles.includes("admin")) {
        res.send("admin");
    }
    else {
        res.send("not admin");
    }
}