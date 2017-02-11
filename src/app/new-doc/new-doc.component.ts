import { Component, OnDestroy, AfterViewInit, EventEmitter, Input, Output, NgZone, ViewEncapsulation } from '@angular/core';
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
	constructor(private _ngZone: NgZone, private sanitizer: DomSanitizer) { }
	@Input() elementId: String;
	@Input() content: any;
	counter: number = 0;

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

	save() {
		console.log('saving');
		var myHtmlString = tinymce.activeEditor.getContent();
		var myHtmlDoc = parse5.parse(myHtmlString);
		console.log(this.content, myHtmlString, myHtmlDoc);
		this.walkTheDOM(myHtmlDoc, (node) => this.setUpSentences(node));
		var html = parse5.serialize(myHtmlDoc);
		this.updateContent(html);
	}

	setUpSentences(node) {

		//still broken. need to fix.
		//strategy:
		//parse entire doc to text.
		//split into array by sentences using below regex.
		//surround sentences with span tags.
		//for each sentence, use another regex to check for any unclosed tags. close them, in order, before the 
		//last span.
		//check also for any unopened tags. open them, in order?

		//what about this?
		//some<p>sentence like this. sentence like <bold>this</bold>. final</p>sentence.
		//ideal scenario is
		//<span>some</span><p><span>sentence like this.</span><span>sentence like <bold>this</bold>.</span><span>final</span></p><span>sentence</span>

		//GENIUS.com-- when you highlight text that spans multiple tags, it dives down to the textNode and wraps it with a genius tag, so that 
		//formatting is not disrupted. it then applys the same ID to all the wrapped text nodes, so that when the user highlights the 'appearance'
		//of continuity is maintained. i.e. if one ID is hovered activate the hover class on all elements with the same Id. smart.

		if (node.nodeName === "#text" && node.parentNode.nodeName !== "span") { // Is it a Text node?
			if (node.value.length > 0) { // Does it have non white-space text content?
				var sentences = node.value.replace(/([\.\?\!\n]\s*)/g, "$&|||").split("|||");
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


