import fs from 'fs'
import { data } from '../server'
export default function saveChangesToNotes(): void {
    fs.writeFileSync('db/notes.json', JSON.stringify(data, null, 2));
  }