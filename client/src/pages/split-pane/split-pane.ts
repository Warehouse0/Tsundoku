import { Component, ElementRef, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';

import { TabsPage } from '../tabs/tabs';
import { Events, ModalController, Nav } from 'ionic-angular';
import { SettingsModal } from '../settings-button/settings-modal/settings-modal';
import { PlanState } from '../../app/state/_state.interfaces';
import { WatchPlan } from '../../app/state/plan.action';

@Component({
  selector: 'split-pane',
  templateUrl: 'split-pane.html'
})
export class SplitPane {
  @ViewChild(Nav)
  navRef: Nav;

  @ViewChild('progress', { read: ElementRef })
  private progressButton: ElementRef;

  @ViewChild('bookshelf', { read: ElementRef })
  private bookshelfButton: ElementRef;

  @ViewChild('achievement', { read: ElementRef })
  private achievementButton: ElementRef;

  root = TabsPage;

  constructor(private events: Events, private modalCtrl: ModalController, private store: Store<PlanState>) {
    this.store.dispatch(new WatchPlan());
  }

  ionViewWillEnter() {
    this.events.subscribe('tabs:changed', index =>
      this.makeButtonSelected(index)
    );
  }

  showPage(name: 'progress' | 'bookshelf' | 'achievement') {
    const index = ['bookshelf', 'progress', 'achievement'].indexOf(name);
    this.makeButtonSelected(index);
    this.navRef.getActiveChildNavs()[0].select(index);
  }

  makeButtonSelected(index: number) {
    const buttons = [
      this.bookshelfButton,
      this.progressButton,
      this.achievementButton
    ];
    buttons[index].nativeElement.classList.add('selected-button');
    buttons
      .filter((_, i) => i !== index)
      .forEach(item => item.nativeElement.classList.remove('selected-button'));
  }

  openSettingsModal() {
    this.modalCtrl.create(SettingsModal).present();
  }
}
