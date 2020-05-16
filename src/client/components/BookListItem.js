import React from "react";

const BookListItem = ({ book: {
  author,
  title,
  year = "",
  genre = "",
  publisher = "",
  language = "",
  isbn = "",
  notes = "",
  isBookRead
} }) => (
    <div>
      <p>-------</p>
      <p>title: {title}</p>
      <p>author: {author}</p>
      <p>year: {year}</p>
      <p>genre: {genre}</p>
      <p>publisher: {publisher}</p>
      <p>language: {language}</p>
      <p>isbn: {isbn}</p>
      <p>notes: {notes}</p>
      <p>isBookRead: {isBookRead ? "yes" : "no"}</p>
      <p>-------</p>
    </div>
  );

export default BookListItem;
