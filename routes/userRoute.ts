import { Request, Response } from 'express';
import { loggedInSessions, accounts } from '../server';

export default function userRoute(req: Request, res: Response) {
  var response = ``;
  console.log(loggedInSessions);
  console.log(loggedInSessions[req.cookies.sID] !== undefined);
  if (loggedInSessions[req.cookies.sID] !== undefined) {
    const currentAccount = accounts[loggedInSessions[req.cookies.sID]];
    response = `You are logged in as ${currentAccount.name}
    you can ${currentAccount.roles.join(' or ')}
    `;
  }
  else {
    response = `You are not logged in`;
  }
  res.send(response);
}
