import {bootstrap} from 'angular2/platform/browser';
import {enableProdMode, provide} from 'angular2/core';
import {HTTP_PROVIDERS, Http} from 'angular2/http';
import {ROUTER_PROVIDERS} from 'angular2/router';

import {TranslateService, TranslateLoader, TranslateStaticLoader} from 'ng2-translate/ng2-translate';
// import {http} from './app/base/injector/http-injector';

import {RootAppComponent} from './app/app.component';

enableProdMode();

bootstrap(RootAppComponent, [
  HTTP_PROVIDERS,
  ROUTER_PROVIDERS,
  provide(TranslateLoader, {
    useFactory: (http: Http) => new TranslateStaticLoader(http, 'assets/i18n', '.json'),
    deps: [Http]
  }),
  TranslateService
])
.catch(err => console.error(err));
