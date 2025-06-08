import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import {provideRouter, withDebugTracing} from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withFetch()), // ✅ compatible Angular 17+ avec Fetch
    provideRouter(routes) ,
    provideRouter(routes, withDebugTracing()) // Dans main.ts
  ]
}).catch(err => console.error(err));

