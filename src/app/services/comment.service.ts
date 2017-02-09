import { Injectable } from '@angular/core';

class Comment {
    constructor(text: string, startIndex: number, endIndex: number) {
        this.text = text;
        this.startIndex = startIndex;
        this.endIndex = endIndex;
    }
    text: string;
    startIndex: number;
    endIndex: number;
}

@Injectable()
export class CommentService {
  addComment(sentence: string): void {
    //add comments. 
  }
  
  findAllComments(): Comment[] {
      return [new Comment("abc", 0, 5), new Comment("def", 7,9), new Comment("ghi", 12, 15)];
  }
  
}