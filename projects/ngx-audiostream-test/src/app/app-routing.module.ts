import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TestWithLibraryButtonComponent } from './test-with-library-button/test-with-library-button.component';
import { TestWithoutLibraryButtonComponent } from './test-without-library-button/test-without-library-button.component';

const routes: Routes = [
  { path: '', redirectTo: 'test-with-library-button', pathMatch: 'full' },
  { path: 'test-with-library-button', component: TestWithLibraryButtonComponent },
  { path: 'test-without-library-button', component: TestWithoutLibraryButtonComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
