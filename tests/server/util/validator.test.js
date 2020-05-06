const {
  isASCIINumber,
  isStringOfNumbers,
  isValidLength,
  yearValidator,
  isbnValidator,
  emailValidator,
  isValidUserUpd
} = require("../../../src/server/util/validator");
const { userData } = require("../../fixtures/db");

test("Should check if ASCII character is number", () => {
  expect(isASCIINumber("4")).toBe(true);
  expect(isASCIINumber("A")).toBe(false);
  expect(isASCIINumber("-")).toBe(false);
});

test("Should check if string is composed from only number characters", () => {
  expect(isStringOfNumbers("89")).toBe(true);
  expect(isStringOfNumbers("89pro")).toBe(false);
  expect(isStringOfNumbers("pro89")).toBe(false);
  expect(isStringOfNumbers("8pro9")).toBe(false);
});

test("Should validate if string is of desired length", () => {
  expect(isValidLength("validator", 9)).toBe(true);
  expect(isValidLength("validator", 3, 9, 18)).toBe(true);
  expect(isValidLength("validator", 3)).toBe(false);
  expect(isValidLength("validator", 3, 18)).toBe(false);
});

test("Should validate year input", () => {
  expect(yearValidator("1978")).toBe(true);
  expect(yearValidator("2020")).toBe(true);
  expect(yearValidator("carasd")).toBe(false);
  expect(yearValidator("20209")).toBe(false);
});

test("Should validate ISBN input", () => {
  expect(isbnValidator("1756455372")).toBe(true);
  expect(isbnValidator("7325321154572")).toBe(true);
  expect(isbnValidator("1755372")).toBe(false);
  expect(isbnValidator("17s56455372")).toBe(false);
  expect(isbnValidator("1756455f372")).toBe(false);
});

test("Should validate email input", () => {
  expect(emailValidator("jon.doe@gmail.com")).toBe(true);
  expect(emailValidator("not.an.email.address1337")).toBe(false)
});

test("should validate user update fields", () => {
  expect(isValidUserUpd(Object.keys(userData))).toBe(true);
  expect(isValidUserUpd(["location"])).toBe(false);
});
