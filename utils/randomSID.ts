import { loggedInSessions } from '../server';


export function randomSID(): string {
  var sID = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  if (!loggedInSessions.hasOwnProperty(sID)) {
    return sID;
  }
  return randomSID();
}
