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
import { CommentService } from '../services/comment.service';
declare var tinymce: any;

tinymce = require('tinymce');

@Component({
	selector: 'new-doc',
	styleUrls: ['./new-doc.component.css'],
	templateUrl: './new-doc.component.html'
})
export class NewDocComponent {
	constructor(private _ngZone: NgZone,private sanitizer:DomSanitizer,private commentService: CommentService) {}
	@Input() elementId: String;
	@Input() content: any = "See Spot Run. I am not spot. Run Spot Run. Spot is a dog. Spot can run.";

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
		this.attachComments();
		
	}

	updateContent(content: any) {
		this.content = this.sanitizer.bypassSecurityTrustHtml(content);
		console.log(this.content)
	}
	
	attachComments() {
		
		//do we want to strip out html? probably the indexing function makes 
		//more sense late.
		let commentsArray = this.commentService.findAllComments();
		let arr:string[] = this.content.split("");
		commentsArray.forEach(comment => {
			arr[comment.startIndex] = "<strong>" + arr[comment.startIndex];
			arr[comment.endIndex] = arr[comment.endIndex] + "</strong>";
		})
		this.updateContent(arr.join(""));
			
			
	}


  ngOnDestroy() {
    tinymce.remove(this.editor);
  }
}


