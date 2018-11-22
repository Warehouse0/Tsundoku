import { Component } from '@angular/core';
import { NavParams, ViewController, ToastController } from 'ionic-angular';

import { BookService } from '../../app/services/book.service';
import { FundamentalModal } from '../fundamental-modal';
import { Store } from '@ngrx/store';
import { State } from '../../app/state/_state.interfaces';
import { GetBook } from '../../app/state/book.action';

@Component({
  selector: 'book-details-modal',
  templateUrl: 'book-details-modal.html'
})
export class BookDetailsModal extends FundamentalModal {
  isbn: string;
  title: string;
  desc: string;
  image: string;

  constructor(
    private navParams: NavParams,
    protected viewCtrl: ViewController,
    protected toastCtrl: ToastController,
    private bookService: BookService,
    private store: Store<State>
  ) {
    super(viewCtrl, toastCtrl);
    this.isbn = this.navParams.get('isbn');
    this.bookService
      .getBookByISBN(this.isbn)
      .then(book => {
        this.title = book.title;
        this.desc = book.desc;
        this.image = book.image;
      })
      .catch(err => this.showError(err));
  }

  ionViewWillEnter() {
    this.store.dispatch(new GetBook({ isbn: this.isbn }));
  }
}
