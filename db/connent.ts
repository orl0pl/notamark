import { Convert } from "./converter";
import * as fs from 'fs' 

var json = fs.readFileSync('db/notes.json', 'utf8');
const data = Convert.toDataBase(json);
export default data