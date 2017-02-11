import { Component, OnDestroy, AfterViewInit, EventEmitter, Input, Output, NgZone, ViewEncapsulation, ElementRef, Renderer } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { CommentService } from '../services/comment.service';

@Component({
	selector: 'home',
	styleUrls: ['./home.component.css'],
	templateUrl: './home.component.html',
	encapsulation: ViewEncapsulation.None,
})
export class HomeComponent {
	constructor(private commentService: CommentService, private sanitizer: DomSanitizer, elementRef: ElementRef, renderer: Renderer) {    // Listen to click events in the component

		renderer.listen(elementRef.nativeElement, 'click', (event) => {
			this.selectedSentence = event.srcElement.id;
			console.log(this.selectedSentence);
		});
	}

	@Input() content: any = "See Spot Run.<br /><p>I am not spot? Run Spot Run.</p>Spot is a dog. Spot can run.";
	@Input() comments: any;
	selectedSentence: number;
	editor: any;

	ngAfterViewInit() {
		var app = this;
		this.attachComments();
	}

	setSentence(index) {
		this.selectedSentence = index;
	}

	attachComments() {
		this.comments = this.commentService.findAllComments();
	}


}


