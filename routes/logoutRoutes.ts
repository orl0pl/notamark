import { Request, Response } from 'express';
import { loggedInSessions, saveToDB } from '../server';

export function logoutRoute(req: Request, res: Response) {
  delete loggedInSessions[req.cookies.sID];
  console.log(loggedInSessions);
  saveToDB();
  res.clearCookie('sID');
  res.redirect('/');
}
export function logoutPOSTRoute(req: Request, res: Response) {
  delete loggedInSessions[req.cookies.sID];
  console.log(loggedInSessions);
  saveToDB();
  res.clearCookie('sID');
  res.redirect('/');
}
