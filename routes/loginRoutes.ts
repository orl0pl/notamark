import { Request, Response } from 'express';
import iconmapper from '../utils/iconmapper';

export function loginRoute() {
  return (req: Request, res: Response) => {
    res.render('login', {
      url: '../../',
      mi: iconmapper,
      error: null
    });
  };
}
import { accounts, loggedInSessions, saveToDB } from '../server';
import { randomSID } from '../utils/randomSID';

export function loginPOSTRoute(req: Request, res: Response) {
  const body: {
    username: string;
    password: string;
  } = req.body;
  if (accounts.find((obj: { name: string; password: string; }) => obj.name === body.username && obj.password === body.password)) {
    const newSID = randomSID();
    res.cookie('sID', newSID);
    loggedInSessions[newSID] = accounts.findIndex((obj: { name: string; password: string; }) => obj.name === body.username && obj.password === body.password);
    res.redirect('/user');
    saveToDB();
  } else {
    res.render('login', {
      url: '../../',
      mi: iconmapper,
      error: 403,
    });
  }
}