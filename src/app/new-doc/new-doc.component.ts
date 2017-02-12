import { Component, OnDestroy, AfterViewInit, EventEmitter, Input, Output, NgZone, ViewEncapsulation, Renderer, ElementRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import * as parse5 from 'parse5';
declare var parse5Utils: any;
declare var tinymce: any;
var parse5Utils = require("parse5-utils")
tinymce = require('tinymce');

@Component({
	selector: 'new-doc',
	styleUrls: ['./new-doc.component.css'],
	templateUrl: './new-doc.component.html',
	encapsulation: ViewEncapsulation.None,

})
export class NewDocComponent {
	constructor(private _ngZone: NgZone,
		private sanitizer: DomSanitizer,
		private renderer: Renderer,
		private element: ElementRef
	) {
		this.nativeElement = element.nativeElement;
		// Listen to click events in the component
		this.listenFunc = this.renderer.listen(this.nativeElement, 'mouseover', (event) => {
			// Do something with 'event'
			event.target.id
			
		})
	}

	private nativeElement: Node;
	@Input() elementId: String;
	@Input() content: any;
	counter: number = 0;
	listenFunc: Function;

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
		// Removes "listen" listener
		this.listenFunc();

	}

	save() {
		this.counter = 0;
		var myHtmlString = tinymce.activeEditor.getContent();
		var myHtmlDoc = parse5.parse(myHtmlString);
		this.walkTheDOM(myHtmlDoc, (node) => this.setUpSentences(node));
		var html = parse5.serialize(myHtmlDoc);
		this.updateContent(html);
	}

	setUpSentences(node) {
		if (node.nodeName === "#text") { // Is it a Text node?
			if (node.value.length > 0) { // Does it have non white-space text content?
				var sentences = node.value.replace(/([\.\?\!\n]\s*)/g, "$&|||").split("|||");
				var refNode = parse5Utils.createNode("span");
				parse5Utils.setAttribute(refNode, "class", "sentence-group");
				sentences.forEach(sentence => {
					if (sentence.length) {
						var newNode = parse5Utils.createNode("span");
						var newTextNode = parse5Utils.createTextNode(sentence);
						parse5Utils.append(newNode, newTextNode);
						parse5Utils.setAttribute(newNode, "workshop-id", this.counter.toString());
						parse5Utils.setAttribute(newNode, "class", "sentence");
						parse5Utils.append(refNode, newNode);
						if (sentence.match(/([\.\?\!\n]\s*)/g)) this.counter++;
					}
				});
				parse5Utils.replace(node, refNode);
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


