import {
	Component,
	OnDestroy,
	AfterViewInit,
	EventEmitter,
	Input,
	Output,
	NgZone,
} from '@angular/core';
import {
	DomSanitizer
} from '@angular/platform-browser';

declare var tinymce: any;

tinymce = require('tinymce');

@Component({
	selector: 'new-doc',
	styleUrls: ['./new-doc.component.css'],
	templateUrl: './new-doc.component.html'
})
export class NewDocComponent {
	constructor(private _ngZone: NgZone,private sanitizer:DomSanitizer) {}
	@Input() elementId: String;
	@Input() content: any;

	editor: any;

	ngAfterViewInit() {
		var app = this;

		tinymce.init({
			selector: '#tinymce',
			plugins: ['link', 'paste', 'table'],
			skin_url: './assets/skins/lightgray',
			setup: editor => {
				this.editor = editor;
				editor.on('keyup', () => {
					this._ngZone.run(() => this.updateContent(editor.getContent()));
				});
			},
		});
	}

	updateContent(content: any) {
		this.content = this.sanitizer.bypassSecurityTrustHtml(content);

	}


  ngOnDestroy() {
    tinymce.remove(this.editor);
  }
}


