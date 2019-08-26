import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {FormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule  // [(ngModel)] 必须导入FromsModule并把它添加到Angular模块的imports列表中
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
