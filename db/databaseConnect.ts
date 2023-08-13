import { Convert } from "./converter";
import fs from 'fs'
var json = fs.readFileSync('db/notes.json', 'utf8');
export const data = Convert.toDataBase(json);