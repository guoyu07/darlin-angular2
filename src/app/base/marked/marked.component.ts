import {Component, Input, ViewEncapsulation, OnChanges} from '@angular/core';
import {DomSanitizationService} from '@angular/platform-browser'
// import * as emojione from 'emojione';

import {MarkedService} from './marked.service';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'marked',

  // use ms(md) cause performance problem
  // use Onchanges to relace
  template: `
    <div [innerHTML]="html"></div>
  `,
  styles: [
    require('./markdown.less'),
    require('./tomorrow.night.css'),
    require('./highlight.number.less')
  ]
})

export class MarkedComponent implements OnChanges {

  @Input() md: string;

  private ms: any;

  public html: any;

  constructor(
    private markedService: MarkedService,
    private sanitizer: DomSanitizationService
  ) {

    this.ms = markedService.init();

  }

  ngOnChanges(changes) {
    if (changes.md != undefined && this.ms) {
      let emojiMd = emojione.toImage(this.md);
      this.html = this.sanitizer.bypassSecurityTrustHtml(this.ms(emojiMd))
    }
  }

}
