const isASCIINumber = (ch) =>
  48 <= ch.charCodeAt() && ch.charCodeAt() <= 57;

const isStringOfNumbers = string => string.every(isASCIINumber);

const isValidLength = (string, ...lengths) => lengths.includes(string.length);

const yearValidator = yearString =>
  isStringOfNumbers(yearString) && isValidLength(yearString, 4);

const isbnValidator = isbnString =>
  isStringOfNumbers(isbnString) && isValidLength(isbnString, 10, 13);

module.exports = {
  yearValidator,
  isbnValidator
};
