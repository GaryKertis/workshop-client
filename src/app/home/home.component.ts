import { Component, OnDestroy, AfterViewInit, EventEmitter, Input, Output, NgZone, ViewEncapsulation, ElementRef, Renderer } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { CommentService } from '../services/comment.service';
import * as parse5 from 'parse5';
declare var parse5Utils: any;
var parse5Utils = require("parse5-utils")

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
	counter: number = 0;
	selectedSentence: number;
	editor: any;

	ngAfterViewInit() {
		var app = this;
		this.attachComments();
	}

	setSentence(index) {
		console.log('click');
		this.selectedSentence = index;
	}

	attachComments() {
		var myHtml = parse5.parse(this.content);
		this.walkTheDOM(myHtml, (node) => this.setUpSentences(node));
		var html = parse5.serialize(myHtml);
		this.content = this.sanitizer.bypassSecurityTrustHtml(html);
		this.comments = this.commentService.findAllComments();
	}

	setUpSentences(node) {
		if (node.nodeName === "#text" && node.parentNode.nodeName !== "span") { // Is it a Text node?
			if (node.value.length > 0) { // Does it have non white-space text content?
				var sentences = node.value.replace(/([\.\?\!\n]\s*)/, "$&|||").split("|||");
				var siblings = node.parentNode.childNodes;
				var index = node.parentNode.childNodes.indexOf(node);

				sentences.forEach(sentence => {
					if (sentence.length) {
						var newNode = parse5Utils.createNode("span");
						var newTextNode = parse5Utils.createTextNode(sentence);
						parse5Utils.append(newNode, newTextNode);
						parse5Utils.setAttribute(newNode, "id", this.counter.toString());
						parse5Utils.setAttribute(newNode, "class", "sentence");
						siblings.splice(index, 0, newNode);
						index++;
						this.counter++;
					}
				});
				parse5Utils.remove(node);
			}
		}
	}

	walkTheDOM(node, func) {
		func(node);
		var nodeIndex = 0;
		node = node.childNodes && node.childNodes[nodeIndex];
		while (node) {
			this.walkTheDOM(node, func);
			nodeIndex++;
			node = node.parentNode && node.parentNode.childNodes && node.parentNode.childNodes[nodeIndex];
		}
		nodeIndex = 0;
	}

}


