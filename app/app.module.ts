import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent, ByteFormatPipe} from './app.component';

@NgModule({
    imports: [BrowserModule],
    declarations: [ AppComponent, ByteFormatPipe ],
    bootstrap: [ AppComponent ]
})

export class AppModule { }
