import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Error404RoutingModule } from './errors-routing.module';
import { Page404Component } from './page404/page404.component';
@NgModule({
  declarations: [Page404Component],
  imports: [CommonModule, Error404RoutingModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ErrorsModule {
  constructor() {}
}
