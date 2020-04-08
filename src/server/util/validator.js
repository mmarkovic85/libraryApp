const { isEmail } = require("validator");

const isASCIINumber = (ch) =>
  48 <= ch.charCodeAt() && ch.charCodeAt() <= 57;

const isStringOfNumbers = string => string.split("").every(isASCIINumber);

const isValidLength = (string, ...lengths) => lengths.includes(string.length);

const yearValidator = yearString =>
  isStringOfNumbers(yearString) && isValidLength(yearString, 4);

const isbnValidator = isbnString =>
  isStringOfNumbers(isbnString) && isValidLength(isbnString, 10, 13);

const emailValidator = email => isEmail(email);

module.exports = {
  isASCIINumber,
  isStringOfNumbers,
  isValidLength,
  yearValidator,
  isbnValidator,
  emailValidator
};
