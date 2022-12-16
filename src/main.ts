import { ImportedNgModuleProviders, Provider } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { bootstrapApplication } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppComponent } from './app/app.component';

export function getBaseUrl() {
  return document.getElementsByTagName('base')[0].href;
}

const providers: Array<Provider | ImportedNgModuleProviders> = [
  { provide: 'BASE_URL', useFactory: getBaseUrl, deps: [] },
  FormsModule,
  ReactiveFormsModule,
];

bootstrapApplication(AppComponent, { providers }).catch((err) =>
  console.log(err)
);
