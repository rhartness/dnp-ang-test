import { Component, OnInit, AfterViewInit } from '@angular/core';
import { BooksService } from '../books.service';
import { Book } from '../book';


declare var $: any;

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit, AfterViewInit {

  books: Book[];
  filteredBooks: Book[];
  
  _filter: string = "";
  get filter(): string {
    return this._filter;
  }
  set filter(value: string) {
    this._filter = value;
    this.filterBooks();
  }
  
  sortColumn: string = "";
  sortAsc: boolean = true; //Sort ascending
  sortIcon = 'arrow_drop_up';
  selectedBook: Book;

  constructor(private booksSvc: BooksService) 
  { 

  }

  ngOnInit() {
    this.loadBookData();
  }
  ngAfterViewInit() {
    $('#showDetailModal').modal();
  }

  //Books list management
  sortData(column)
  {
    if (column != this.sortColumn)
    {
      this.sortColumn = column;
      this.sortAsc = true;
      
    }
    else {
      this.sortAsc = !this.sortAsc;
    }

    this.sortIcon = this.sortAsc ? 
    'arrow_drop_down' : this.sortIcon = 'arrow_drop_up';

    this.books = this.books.sort((a,b)=>
    {
      if (this.sortAsc === true) 
        return a[column] < b[column] ? -1 : 1;
      else 
        return a[column] > b[column] ? -1 : 1;
    })
  }
  loadBookData()
  {
    this.booksSvc.getBooks().subscribe(
      {

        next: books =>
        {
          this.books = books;
          this.filterBooks();
        },

        //Naive error handling
        error: e=>this.handleErrors(e)
      }
    );  
  }

  deleteBook(id: string)
  {
    this.booksSvc.deleteBook(id).subscribe(
      { 
        next: data=>this.loadBookData(),
        error: e=>this.handleErrors(e) 
      }
    );
  }

  //Detail Modal
  showDetails(book: Book)
  {
    this.selectedBook = book;
    var modal = $('#showDetailModal')
    modal.modal('open');
  }

  //Filters
  filterBooks()
  {
    this.filteredBooks = this.filter 
    ? this.books.filter(b=>this.checkBookFilter(b))
    : this.books;
  }
  checkBookFilter(book) : boolean {
    let term = this.filter.toLowerCase();
    return book.author.toLowerCase().includes(term)
      || book.title.toLowerCase().includes(term)
      || book.genre.toLowerCase().includes(term)
      || book.publishDate.toString().toLowerCase().includes(term)
      || book.price.toString().toLowerCase().includes(term);
  }

  //Error handling
  handleErrors(e)
  {
    //Super-naive error handling
    if(e) console.warn(e);
  }
}
