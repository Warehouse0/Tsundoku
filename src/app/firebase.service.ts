import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/functions';
import * as config from './config.json';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  public functions: firebase.functions.Functions;

  /**
   * Firebase SDK の設定
   */
  constructor() {
    firebase.initializeApp(config);
    /**
     * FirebaseService を DI したコンポーネントで参照されるプロパティ
     * @type {firebase.functions.Functions}
     */
    this.functions = firebase.functions();
  }
}
