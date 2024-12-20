
function loadBooks() {
  const incompleteBooks = JSON.parse(localStorage.getItem('incompleteBooks')) || [];
  const completeBooks = JSON.parse(localStorage.getItem('completeBooks')) || [];

  renderBooks(incompleteBooks, 'incompleteBookList');
  renderBooks(completeBooks, 'completeBookList');
}


function renderBooks(books, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = ''; 

  books.forEach(book => {
    const bookItem = document.createElement('div');
    bookItem.dataset.bookid = book.id;
    bookItem.setAttribute('data-testid', 'bookItem');
    bookItem.innerHTML = `
      <h3 data-testid="bookItemTitle">${book.title}</h3>
      <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
      <p data-testid="bookItemYear">Tahun: ${book.year}</p>
      <div>
        <button data-testid="bookItemIsCompleteButton" onclick="toggleComplete(${book.id})">
          ${book.isComplete ? 'Belum selesai dibaca' : 'Selesai dibaca'}
        </button>
        <button data-testid="bookItemDeleteButton" onclick="deleteBook(${book.id})">
          Hapus Buku
        </button>
        <button data-testid="bookItemEditButton" onclick="editBook(${book.id})">
          Edit Buku
        </button>
      </div>
    `;
    container.appendChild(bookItem);
  });
}


function addBook(event) {
  event.preventDefault();

  const title = document.getElementById('bookFormTitle').value;
  const author = document.getElementById('bookFormAuthor').value;
  const year = parseInt(document.getElementById('bookFormYear').value, 10);
  const isComplete = document.getElementById('bookFormIsComplete').checked;

  const newBook = {
    id: Date.now(), 
    title,
    author,
    year,
    isComplete,
  };

  let books = isComplete ? JSON.parse(localStorage.getItem('completeBooks')) || [] : JSON.parse(localStorage.getItem('incompleteBooks')) || [];
  books.push(newBook);

  if (isComplete) {
    localStorage.setItem('completeBooks', JSON.stringify(books));
  } else {
    localStorage.setItem('incompleteBooks', JSON.stringify(books));
  }

  loadBooks();
  document.getElementById('bookForm').reset(); 
}


function toggleComplete(bookId) {
  let incompleteBooks = JSON.parse(localStorage.getItem('incompleteBooks')) || [];
  let completeBooks = JSON.parse(localStorage.getItem('completeBooks')) || [];

  const bookIndexInIncomplete = incompleteBooks.findIndex(book => book.id === bookId);
  const bookIndexInComplete = completeBooks.findIndex(book => book.id === bookId);

  if (bookIndexInIncomplete !== -1) {
    const book = incompleteBooks.splice(bookIndexInIncomplete, 1)[0];
    book.isComplete = true;
    completeBooks.push(book);
    localStorage.setItem('incompleteBooks', JSON.stringify(incompleteBooks));
    localStorage.setItem('completeBooks', JSON.stringify(completeBooks));
  } else if (bookIndexInComplete !== -1) {
    const book = completeBooks.splice(bookIndexInComplete, 1)[0];
    book.isComplete = false;
    incompleteBooks.push(book);
    localStorage.setItem('incompleteBooks', JSON.stringify(incompleteBooks));
    localStorage.setItem('completeBooks', JSON.stringify(completeBooks));
  }

  loadBooks();
}


function deleteBook(bookId) {
  let incompleteBooks = JSON.parse(localStorage.getItem('incompleteBooks')) || [];
  let completeBooks = JSON.parse(localStorage.getItem('completeBooks')) || [];

  incompleteBooks = incompleteBooks.filter(book => book.id !== bookId);
  completeBooks = completeBooks.filter(book => book.id !== bookId);

  localStorage.setItem('incompleteBooks', JSON.stringify(incompleteBooks));
  localStorage.setItem('completeBooks', JSON.stringify(completeBooks));

  loadBooks();
}



let editingBookId = null;


function editBook(bookId) {
  
  let incompleteBooks = JSON.parse(localStorage.getItem('incompleteBooks')) || [];
  let completeBooks = JSON.parse(localStorage.getItem('completeBooks')) || [];
  
  let bookToEdit = null;
  
  
  bookToEdit = incompleteBooks.find(book => book.id === bookId);
  
  
  if (!bookToEdit) {
    bookToEdit = completeBooks.find(book => book.id === bookId);
  }
  
  
  if (bookToEdit) {
    document.getElementById('bookFormTitle').value = bookToEdit.title;
    document.getElementById('bookFormAuthor').value = bookToEdit.author;
    document.getElementById('bookFormYear').value = bookToEdit.year;
    document.getElementById('bookFormIsComplete').checked = bookToEdit.isComplete;
    
    
    editingBookId = bookId;
    
    
    const submitButton = document.getElementById('bookFormSubmit');
    submitButton.innerHTML = 'Update Buku ke rak';
  }
}


function updateBook(event) {
  event.preventDefault();
  
  const title = document.getElementById('bookFormTitle').value;
  const author = document.getElementById('bookFormAuthor').value;
  const year = parseInt(document.getElementById('bookFormYear').value, 10);
  const isComplete = document.getElementById('bookFormIsComplete').checked;

  
  let incompleteBooks = JSON.parse(localStorage.getItem('incompleteBooks')) || [];
  let completeBooks = JSON.parse(localStorage.getItem('completeBooks')) || [];
  
  let bookIndexInIncomplete = incompleteBooks.findIndex(book => book.id === editingBookId);
  let bookIndexInComplete = completeBooks.findIndex(book => book.id === editingBookId);
  
  
  if (bookIndexInIncomplete !== -1) {
    incompleteBooks[bookIndexInIncomplete] = {
      id: editingBookId,
      title,
      author,
      year,
      isComplete
    };
    localStorage.setItem('incompleteBooks', JSON.stringify(incompleteBooks));
  } else if (bookIndexInComplete !== -1) {
    completeBooks[bookIndexInComplete] = {
      id: editingBookId,
      title,
      author,
      year,
      isComplete
    };
    localStorage.setItem('completeBooks', JSON.stringify(completeBooks));
  }
  
  
  document.getElementById('bookForm').reset();
  editingBookId = null;
  
  
  const submitButton = document.getElementById('bookFormSubmit');
  submitButton.innerHTML = 'Masukkan Buku ke rak';
  
  
  loadBooks();  
}






document.getElementById('bookForm').addEventListener('submit', event => {
  if (document.getElementById('bookForm').dataset.editingBookId) {
    updateBook(event); 
  } else {
    addBook(event); 
  }
});


window.onload = loadBooks;





