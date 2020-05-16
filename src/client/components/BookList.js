import React from "react";

import BookListItem from "./BookListItem.js";

const BookList = ({ books }) => (
  <div>
    {
      books.length === 0 ?

        (
          <div>
            <span>No books</span>
          </div>
        ) :

        books.map((book, i) => (
          <BookListItem key={i} book={book} />
        ))
    }
  </div>
);

export default BookList;
