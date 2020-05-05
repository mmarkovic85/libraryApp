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

const isValidUserUpd = (updates) => {
  const allowedUpdates = ["email", "username", "password", "isProfilePrivate"];
  return updates.every(update => allowedUpdates.includes(update));
};

module.exports = {
  isASCIINumber,
  isStringOfNumbers,
  isValidLength,
  yearValidator,
  isbnValidator,
  emailValidator,
  isValidUserUpd
};
