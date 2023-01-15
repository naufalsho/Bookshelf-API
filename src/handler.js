// eslint-disable-next-line import/no-extraneous-dependencies
const { nanoid } = require('nanoid');
const books = require('./books');

// POST untuk simpan buku
const addBookHandler = (request, h) => {
  // body request
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  const id = nanoid(16);
  // hasil observasi dari pagecount dan readpage
  const getFinished = () => {
    if (pageCount === readPage) {
      return true;
    }
    return false;
  };
  const finished = getFinished();
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  // menentukan apakah newBook masuk ke dalam array books dengan filter()
  if (name === undefined || name === '') {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  // push ke array books
  books.push(newBook);
  const isSuccess = books.filter((book) => book.id === id).length > 0;
  // mementukan response yang diberikan server
  // jika isSuccess true, maka berhasil, dan sebaliknya
  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  // push ke array books
  books.push(newBook);
  const response = h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

// GET mendapatkan semua data pada  array books
const getAllBooksHandler = (request, h) => {
  const response = h.response({
    status: 'success',
    data: {
      books: books.map((getBook) => ({
        id: getBook.id,
        name: getBook.name,
        publisher: getBook.publisher,
      })),
    },
  });
  response.code(200);
  return response;
};

// GET data spesifik by id
const getBookByIdHandler = (request, h) => {
  // dapatkan nilai ID
  const { bookId: id } = request.params;

  // dapatkan objek dari array books sesuai id untuk filter
  const book = books.filter((n) => n.id === id)[0];

  // menentukan status response serve, bila objek book undifined = gagal, dan sebaliknya
  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

// PUT by Id
const editBookByIdHandler = (request, h) => {
  // dapatkan id
  const { bookId: id } = request.params;

  // dapatkan books terbaru dari client melalui body request
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  // update nilai updatedAt
  const updatedAt = new Date().toISOString();

  // dapatkan index array pada objek books sesuai id, dengan findIndex()
  const index = books.findIndex((book) => book.id === id);

  // menentukan apakah index dari id ada atau tidak
  if (index !== -1) {
    // menentukan client tidak melampirkan properti name pada request
    if (name === undefined || name === '') {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku',
      });
      response.code(400);
      return response;
    }
    // mementukan nilai properti readPage > pageCount
    if (readPage > pageCount) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      });
      response.code(400);
      return response;
    }
    // jika tidak ada kondisi dari diatas
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };

    // response status success
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  // response status fail, id tidak ditemukan
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

// DELETE by Id
const deleteBookByIdHandler = (request, h) => {
  // dapatkan id
  const { bookId: id } = request.params;

  // dapatkan index dari objek books sesuai Id
  const index = books.findIndex((book) => book.id === id);

  // mementukan jika id nya ada atau tidak
  if (index !== -1) {
    books.splice(index, 1);

    // status response success
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  // response status gagal
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

// exports
module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
