const iconmap: {
  name: string;
  codepoint: string;
}[] = require('./iconmap.json');



export default function iconmapper(name: string) {
  var foundIcon = iconmap.find((obj: { name: string; }) => obj.name === name);
  var codepoint = foundIcon ? foundIcon.codepoint : iconmap[0].codepoint;
  return String.fromCodePoint(parseInt(codepoint, 16));
}
