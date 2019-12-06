import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MentionModule } from 'angular-mentions';
import { AppComponent } from './app.component';
import { TextEditorComponent } from './text-editor/text-editor.component';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import {NgxTributeModule} from 'ngx-tribute';


@NgModule({
  declarations: [
    AppComponent,
    TextEditorComponent
  ],
  imports: [
    BrowserModule,
    MentionModule,
    PickerModule,
    FormsModule,
    NgxTributeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
