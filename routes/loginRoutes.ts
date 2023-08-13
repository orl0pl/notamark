import { Request, Response } from 'express';
import iconmapper from '../utils/iconmapper';

import { createHash } from "crypto";


export function loginRoute(req: Request, res: Response) {
  res.render('login', {
    url: '../../',
    mi: iconmapper,
    error: null
  });
}
import { accounts, loggedInSessions, saveToDB } from '../server';
import { randomSID } from '../utils/randomSID';

export function loginPOSTRoute(req: Request, res: Response) {
  const body: {
    username: string;
    password: string;
  } = req.body;
  const loginPasswordHash = createHash("sha256").update(body.password).digest("hex");
  console.log(loginPasswordHash);
  //console.log(accounts.find((obj: {name: string})=>{obj.name === body.username}))
  console.log(accounts.find((obj: { name: string; password: string; }) => obj.name === body.username))
  if (accounts.find((obj: { name: string; password: string; }) => obj.name === body.username && obj.password === loginPasswordHash)) {
    const newSID = randomSID();
    res.cookie('sID', newSID);
    loggedInSessions[newSID] = accounts.findIndex((obj: { name: string; password: string; }) => obj.name === body.username && obj.password === loginPasswordHash);
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