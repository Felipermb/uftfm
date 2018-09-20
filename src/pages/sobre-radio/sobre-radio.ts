import { Component } from '@angular/core';
import { IonicPage, ViewController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-sobre-radio',
  templateUrl: 'sobre-radio.html',
})
export class SobreRadioPage {

  myParam: string;

  constructor(public viewCtrl: ViewController, params: NavParams) {
    this.myParam = params.get('myParam');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
