import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

import { routes } from './app.routes';

const firebaseConfig = {
  apiKey: "AIzaSyBxGgOeJiu_5hK2CpX5VWqKXqXqXqXqXqXq",
  authDomain: "fiap-farms.firebaseapp.com",
  projectId: "fiap-farms",
  storageBucket: "fiap-farms.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore())
  ]
};
