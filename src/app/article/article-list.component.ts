import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';
import {
  ActivatedRoute,
  ROUTER_DIRECTIVES
} from '@angular/router';

import {TranslatePipe} from 'ng2-translate/ng2-translate';
import {TitleDirective} from '../title/title.directive';

import {ArticleApi} from './article.api';

import {ArticleCategoryComponent} from './category.component';
import {XdDatePipe} from '../base/xd-date/xd-date.pipe';
import {PageAnimateDirective} from '../page-animate/page-animate.directive';
import {PageAnimateFn} from '../page-animate/page-animate';

@Component({
  selector: 'article-list',
  templateUrl: './article-list.template.html',
  pipes: [XdDatePipe, TranslatePipe],
  directives: [ROUTER_DIRECTIVES, TitleDirective, ArticleCategoryComponent, PageAnimateDirective],
  animations: [
    PageAnimateFn()
  ]
})

export class ArticleListComponent implements OnInit, OnDestroy {

  public articles: Array<Object> = [];
  private sub: any;

  getArticles(category: string) {
    ArticleApi.getArticleList(category)
    .then(data => {

      data.results.map(a => {
        let article = {
          url: base64.Base64.encodeURI(a.url),
          title: a.title,
          createTime: a.create_time,
          category: a.category.url,
          isUp: a.is_up,
          isHot: a.hot
        };

        // test list performance
        // let r = 250;
        // while (r > 1) {
        //   r--;
        //   this.articles.push(article);
        // }

        this.articles.push(article);

      });
    });

  }

  constructor(
    private route: ActivatedRoute
  ) {

  }

  ngOnInit() {

    this.sub = this.route.params
    .subscribe(params => {
      if (params) {
        let category = params['category'];
        this.getArticles(category);
      }
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
