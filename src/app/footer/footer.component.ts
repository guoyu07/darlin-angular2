import {
  Component,
  OnDestroy
} from '@angular/core';
import {
  TranslateService,
  TranslatePipe,
  LangChangeEvent
} from 'ng2-translate/ng2-translate';

import {LanguageInterface} from './language.interface';
import {LocalStorageService} from '../base/local-storage/local-storage.service';

@Component({
  selector: '[footer]',
  templateUrl: './footer.template.html',
  styles: [
    require('./footer.less')
  ],
  pipes: [TranslatePipe]
})

export class FooterComponent implements OnDestroy {

  public langs: Array<LanguageInterface>;

  public show: boolean = false;

  public selectedKey: string;

  private htmlElement;

  changeHtmlLang(current) {
    let l: string;
    switch (current) {
      case 'en_US':
        l = 'en';
        break;
      default:
        l = 'zh-cmn-Hans';
    }

    this.htmlElement.setAttribute('lang', l);
  }

  translateInit() {
    LocalStorageService.setPrefix('xd.');
    let current = LocalStorageService.get('lang');
    if (!current) {
      current = 'zh_CN';
    }
    this.translate.use(current);

    this.htmlElement = document.querySelector('html');
    this.changeHtmlLang(current);

    LocalStorageService.save('lang', current);
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      LocalStorageService.save('lang', event.lang);
      this.changeHtmlLang(event.lang);
    });
  }

  changeLanguage(lang: LanguageInterface) {
    this.selectedKey = lang.key;
    this.translate.use(this.selectedKey);
    this.show = false;
  }

  closeSelector() {
    this.show = false;
  }

  clickEvent() {
    document.addEventListener('click', this.closeSelector);
  }

  constructor(
    private translate: TranslateService
  ) {

    this.translateInit();

    this.selectedKey = LocalStorageService.get('lang');

    this.langs = [{
      key: 'zh_CN',
      word: '中文'
    }, {
        key: 'en_US',
        word: 'English'
      }];

    this.clickEvent();
  }

  ngOnDestroy() {
    document.removeEventListener('click', this.closeSelector);
  }

}
