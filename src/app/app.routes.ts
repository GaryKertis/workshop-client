import { Routes } from '@angular/router';

import { NewDocComponent } from './new-doc/new-doc.component';
import { HomeComponent } from './home/home.component';
import { ContactComponent } from './contact/contact.component';

export const rootRouterConfig: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'new', component: NewDocComponent },
  // { path: 'github', component: RepoBrowserComponent,
  //   children: [
  //     { path: '', component: RepoListComponent },
  //     { path: ':org', component: RepoListComponent,
  //       children: [
  //         { path: '', component: RepoDetailComponent },
  //         { path: ':repo', component: RepoDetailComponent }
  //       ]
  //     }]
  // },
  { path: 'contact', component: ContactComponent }
];

