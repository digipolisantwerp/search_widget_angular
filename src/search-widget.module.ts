import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AutoCompleteModule } from '@acpaas-ui/auto-complete';

import { SearchWidgetComponent } from './search-widget/search-widget.component';
import { SearchWidgetService } from './search-widget/search-widget.service';

@NgModule({
  imports: [ CommonModule, FormsModule, AutoCompleteModule, HttpClientModule ],
  declarations: [ SearchWidgetComponent ],
  providers: [ SearchWidgetService ],
  exports: [ SearchWidgetComponent ]
})
export class SearchWidgetModule {}
