import {ApplicationRef, Component, Pipe, PipeTransform} from '@angular/core';
import {NgFor} from '@angular/common';

const {ipcRenderer} = require('electron');

@Pipe({ name: 'byteFormat'})
export class ByteFormatPipe implements PipeTransform {
  // Credit: http://stackoverflow.com/a/18650828
  transform(bytes, args) {
    if(bytes == 0) return '0 Bytes';
    var k = 1000;
    var sizes = ['Bytes', 'KB', 'MB', 'GB'];
    var i = Math.floor(Math.log(bytes) / Math.log(k));
    return (bytes / Math.pow(k, i)).toFixed(1) + ' ' + sizes[i];
  }
}

@Component({
  selector: 'app',
  // pipes: [ByteFormatPipe],
  template: `

    <h1>Total Images: {{ imageStats().count }}</h1>
    <h1>Total Size: {{ imageStats().size | byteFormat}}</h1>

    <div
      (dragover)="false"
      (dragend)="false"
      (drop)="handleDrop($event)"
      style="height: 300px; border: 5px dotted #ccc;">
      <p style="margin: 10px; text-align: center">
        <strong>Drop Your Images Here</strong>
      </p>
    </div>

    <div class="media" *ngFor="let image of images">
      <div class="media-left">
        <a href="#">
          <img class="media-object" src="{{image.path}}" style="max-width:200px">
        </a>
      </div>
      <div class="media-body">
        <h4 class="media-heading">{{image.name}}</h4>
        <p>{{image.size | byteFormat}}</p>
      </div>
    </div>
  `
})

export class AppComponent {

  images:Array<Object> = [];

  constructor(public appRef: ApplicationRef) {
    ipcRenderer.send('async-mesg', 'ping');

    ipcRenderer.on('async-reply', (event, arg) => {
        console.log(arg);
    })

  }

  handleDrop(e) {
      console.log('dropped file');
    var files:File = e.dataTransfer.files;
    var self = this;
    Object.keys(files).forEach((key) => {
      if(files[key].type === "image/png" || files[key].type === "image/jpeg") {
        self.images.push(files[key]);
        console.log(self.images);
        this.appRef.tick(); // Hack
      }
      else {
        alert("File must be a PNG or JPEG!");
      }
    });

    return false;
  }

  imageStats() {

    console.log('imageStats compute start');

    let sizes:Array<number> = [];
    let totalSize:number = 0;

    this
      .images
      .forEach((image:File) => sizes.push(image.size));

    sizes
      .forEach((size:number) => totalSize += size);

    return {
      size: totalSize,
      count: this.images.length
    }

  }

}
