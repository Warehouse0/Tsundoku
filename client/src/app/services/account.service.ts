import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase';

import { User } from 'shared/entity';
import { FirebaseService } from './firebase.service';
import { BehaviorSubject } from 'rxjs';
import { UserService } from './user.service';

/** 登録 / ログイン / ログアウト / 退会処理, ログイン中のアカウントの情報の保持 を担当する */
@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private myself: User | null = null;
  private functions: firebase.functions.Functions;
  private loginSubject = new BehaviorSubject<User | null>(null);
  login$ = this.loginSubject.asObservable();
  auth: firebase.auth.Auth;

  constructor(private router: Router,
              private firebaseService: FirebaseService,
              private userService: UserService) {
    this.auth = this.firebaseService.auth;
    this.functions = this.firebaseService.functions;

    this.firebaseService.observable.subscribe(() => {
      this.auth.onAuthStateChanged(async user => {
        if (user) {
          const account = await this.userService.getUserByUID(user.uid);
          if (account == null) await this.router.navigate(['/']);

          this.myself = account;
          this.loginSubject.next(<User> account);
        } else if (['/', '/login', '/register'].indexOf(location.pathname) === -1) {
          await this.router.navigate(['/login']);
        }
      });
    });
  }

  async login(email: string, password: string) {
    try {
      if (this.auth.currentUser) return;

      const result = await this.auth.signInWithEmailAndPassword(email, password);

      if (result == null || result.user == null) throw new Error();

      const hitUser = await this.userService.getUserByUID(result.user.uid);

      if (hitUser !== null) {
        this.myself = hitUser;
        localStorage.setItem('myself', JSON.stringify(hitUser));
        return;
      }

      throw new Error();
    } catch (error) {
      console.error(error);
    }
  }

  get uid() { return this.myself && this.myself.uid; }

  get name() { return this.myself && this.myself.name; }

  get screenName() { return this.myself && this.myself.screenName; }

  get image() { return this.myself && this.myself.image; }

  get bio() { return this.myself && this.myself.bio; }
}
