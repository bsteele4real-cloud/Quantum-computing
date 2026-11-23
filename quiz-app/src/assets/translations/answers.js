// Accept both JSON booleans and the string flags used in this curriculum's files.
export function isCorrectAnswer(value) {
  return value === true || String(value).toLowerCase() === 'true';
}
