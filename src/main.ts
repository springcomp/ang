import { ImportedNgModuleProviders, importProvidersFrom, Provider } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { bootstrapApplication } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app/app.component';

export function getBaseUrl() {
  return document.getElementsByTagName('base')[0].href;
}

const providers: Array<Provider | ImportedNgModuleProviders> = [
  { provide: 'BASE_URL', useFactory: getBaseUrl, deps: [] },
  importProvidersFrom([
    BrowserAnimationsModule,
  ]),
  FormsModule,
  ReactiveFormsModule,
];

bootstrapApplication(AppComponent, { providers }).catch((err) =>
  console.log(err)
);
