import { Injectable } from '@angular/core';

class Comment {
    constructor(text: string, index: number) {
        this.text = text;
        this.index = index;
    }
    text: string;
    index: number;
}

@Injectable()
export class CommentService {
  addComment(sentence: string): void {
    //add comments. 
  }
  
  findAllComments(): Comment[] {
      return [new Comment("abc", 0), new Comment("def", 0), new Comment("ghi", 2)];
  }
  
}