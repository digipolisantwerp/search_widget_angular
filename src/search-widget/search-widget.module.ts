import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { FlyoutModule } from '@acpaas-ui/flyout';
import { SelectableListModule } from '@acpaas-ui/selectable-list';
import { MaskModule } from '@acpaas-ui/mask';

import { SearchWidgetComponent } from './search-widget.component';
import { SearchWidgetService } from './search-widget.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    FlyoutModule,
    SelectableListModule,
    MaskModule,
    HttpClientModule
   ],
  declarations: [
    SearchWidgetComponent
  ],
  exports: [
    SearchWidgetComponent
  ],
  providers: [
    SearchWidgetService
  ],
})
export class SearchWidgetModule {}
