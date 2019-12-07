import { Component, OnInit } from '@angular/core';
import { ɵNAMESPACE_URIS } from '@angular/platform-browser';

@Component({
  selector: 'app-text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.css']
})
export class TextEditorComponent implements OnInit {
  public mentionConfig: any;
  public showEmoji: boolean;
  public text: string = "";
  public options: any;
  public html: string="";
  public format: boolean;
  public startOffset: any;
  public endOffset: any;
  public node: any;
  public tribute: string;
  constructor() {
    this.showEmoji = false;
    this.tribute="";
    this.mentionConfig = {
      mentions: [
        {
            items: this.names(),
            triggerChar: '@',
            mentionSelect: (item)=>{
              this.tribute = `@${item.name}`;
              return this.tribute;
            },
            labelKey: 'name',
            maxItems: 4, 
            disableSearch: false
        },
        {
            items: this.dates(),
            triggerChar: '#',
            mentionSelect: (item)=>{
              this.tribute = `#${item.date}`;
              return this.tribute;
            },
            labelKey: 'date',
            maxItems: 4, 
            disableSearch: false
        },
      ], 
    }
  }
  
  names(){ //return names
    return ['Alec', 'Joyce', 'Nalin', 'Dominic'];
  }

  dates(){ //return dates
    return [ "20/12/13", "13/4/19", "16/12/11"]
  }

  ngOnInit() {
      document.querySelectorAll('button')[0].addEventListener('click',()=>{
        document.execCommand('bold', false, '');
      })
      
      document.querySelectorAll('button')[1].addEventListener('click',()=>{
          document.execCommand('italic', false, '');
      })
      
      document.querySelectorAll('button')[2].addEventListener('click',()=>{
          document.execCommand('strikeThrough', false, '');
      })
      
      document.querySelectorAll('button')[3].addEventListener('click',()=>{
          document.execCommand('underline', false, '');
      })

      document.querySelectorAll('button')[4].addEventListener('click',()=>{
        document.execCommand('insertunorderedList', false, '');
      })

      document.querySelectorAll('button')[5].addEventListener('click',()=>{
        document.execCommand('insertorderedList', false, '');
      })
  }

  toggleEmojiPicker(){
    this.showEmoji = this.showEmoji==true?false:true;
  }

  addEmoji(event){
    if (window.getSelection) {
      let sel = window.getSelection();
      if (sel.getRangeAt && sel.rangeCount) {
          let range = sel.getRangeAt(0);
          range.insertNode( document.createTextNode(event.emoji.native));
          range.collapse(true);
      }
    }
    this.html = document.getElementById('editor').innerHTML;
    this.showEmoji = false;
  }

  setValue(text, html){
    
    this.text = this.getPrecedingCharacter(window.getSelection().anchorNode); //gets the last input character

    if(this.format && this.startOffset && this.tribute){
      this.format = false;
      let sel = window.getSelection();
      this.endOffset = sel.getRangeAt(0).endOffset;

      let range = document.createRange(); 
      range.setStart(this.node, this.startOffset-1);
      range.setEnd(this.node, this.endOffset);      
      range.deleteContents(); //deleting previous set contents
      this.html = document.getElementById('editor').innerHTML;
    }
    
    if(this.text === '@' || this.text === '#'){
      this.node = window.getSelection().anchorNode;
      this.format = true;
      this.startOffset = window.getSelection().getRangeAt(0).startOffset;
    }
  }

  getPrecedingCharacter(container : any){
    let s = window.getSelection();
    let r = window.getSelection().getRangeAt(0).cloneRange();
    r.setStart(container, 0);
    return r.toString().slice(-1);
  }

  closed(){
    if(this.tribute!=""){
      let span = document.createElement('span');
      span.appendChild(document.createTextNode(`${this.tribute}`));
      span.setAttribute('contenteditable', 'false');
      span.style.backgroundColor = '#dff6f0';
      span.style.color = '#2e279d';
      span.style.fontWeight = '600';

      let sel = window.getSelection();
      let range = sel.getRangeAt(0);
      range.insertNode(document.createTextNode(' '));
      range.insertNode(span);
      range.insertNode(document.createTextNode(' ')); 
      range.setStartAfter(span); 
      range.collapse(true);
      this.tribute="";
    }
  }
}
