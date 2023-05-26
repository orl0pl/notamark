
var textarea = document.getElementById('input');

function toggleFormatting(format) {
  var selectedText = textarea.value.substring(textarea.selectionStart, textarea.selectionEnd);
  var formattedText = '';

  switch (format) {
    case 'bold':
      formattedText = toggleFormatInText(selectedText, '**');
      break;
    case 'italic':
      formattedText = toggleFormatInText(selectedText, '_');
      break;
    case 'underline':
      formattedText = toggleFormatInText(selectedText, '<u>', '</u>');
      break;
    case 'strikethrough':
      formattedText = toggleFormatInText(selectedText, '~~');
      break;
    case 'list':
      formattedText = toggleListFormatting(selectedText);
      break;
    default:
      formattedText = selectedText;
  }

  replaceSelectedText(formattedText);
}

function toggleFormatInText(text, formatStart, formatEnd = '') {
  if (text.startsWith(formatStart) && text.endsWith(formatEnd)) {
    // Remove formatting
    return text.substring(formatStart.length, text.length - formatEnd.length);
  } else {
    // Add formatting
    return formatStart + text + formatEnd;
  }
}

function toggleListFormatting(text) {
  var lines = text.split('\n');
  var isList = lines.every(line => line.startsWith('- '));

  if (isList) {
    // Remove list formatting
    return lines.map(line => line.substring(2)).join('\n');
  } else {
    // Add list formatting
    return lines.map(line => `- ${line}`).join('\n');
  }
}

function replaceSelectedText(newText) {
  var start = textarea.selectionStart;
  var end = textarea.selectionEnd;
  textarea.value = textarea.value.substring(0, start) + newText + textarea.value.substring(end);
  textarea.setSelectionRange(start, start + newText.length);
}
