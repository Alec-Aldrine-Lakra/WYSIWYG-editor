'use strict';
import { Component, OnInit } from '@angular/core';
import * as Bowser from "bowser";

@Component({
  selector: 'app-text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.css']
})
export class TextEditorComponent implements OnInit {
  public oldRange: any;
  public mentionConfig: any;
  public showEmoji: boolean;
  public lastChar: any;
  public options: any;
  public format: boolean;
  public startOffset: any;
  public endOffset: any;
  public node: any;
  public tribute: string;
  public sel: any;
  public innerText: any;
  public flag: number = 0;
  public browser: string;
  public innerHtml: string;
  constructor() {

    this.browser = Bowser.getParser(window.navigator.userAgent).getBrowserName();
    console.log(this.browser);

    window.onbeforeunload = ()=>{
      sessionStorage.removeItem('range');
    };

    this.showEmoji = false;
    this.tribute = '';
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
            maxItems: 5, 
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
            maxItems: 5, 
            disableSearch: false
        },
      ], 
    };
  }
  
  names(){ // return names
    return ['Alec', 'Joyce', 'Nalin', 'Dominic'];
  }

  dates(){ // return dates
    return [ '20-12-13', '13-04-19', '16-12-11']
  }

  ngOnInit() {

      this.sel = window.getSelection();
      document.getElementById('editor').appendChild(document.createElement('br'));

      document.querySelectorAll('.btn-editor')[0].addEventListener('click',()=>{
        document.execCommand('bold', false, '');
      });
      document.querySelectorAll('.btn-editor')[1].addEventListener('click',()=>{
          document.execCommand('italic', false, '');
      });
      document.querySelectorAll('.btn-editor')[2].addEventListener('click',()=>{
          document.execCommand('strikeThrough', false, '');
      });      
      document.querySelectorAll('.btn-editor')[3].addEventListener('click',()=>{
          document.execCommand('underline', false, '');
      });
      document.querySelectorAll('.btn-editor')[4].addEventListener('click',()=>{
        document.execCommand('insertunorderedList', false, '');
      });
      document.querySelectorAll('.btn-editor')[5].addEventListener('click',()=>{
        document.execCommand('insertorderedList', false, '');
      });

      //Development Purpose 
      document.getElementById('editor').addEventListener('click',()=>{    
          let range = this.sel.getRangeAt(0);
          console.log(range);
      })
      // document.getElementById('editor').addEventListener('keydown',(e)=>{      
      //   console.log(e);
      // })
      //  document.getElementById('editor').addEventListener('input',(e)=>{      
      //      console.log(e);
      //   })
  }
  
  blur(){
    this.oldRange = this.sel.getRangeAt(0).cloneRange(); // to store the range when element is blurred
  }

  toggleEmojiPicker(){
    this.showEmoji = this.showEmoji === true?false:true;
    if(!this.showEmoji)
      this.focus();
  }

  addEmoji(event: any){

    this.focus();
    if (window.getSelection) 
    {
      this.sel.removeAllRanges();
      const e = document.createElement('span');
      const id = event.emoji.id;
      const re =/^flag-/;
      if(this.browser === 'Firefox')
        e.setAttribute('contenteditable','true');
      else 
        e.setAttribute('contenteditable','false');

      if(!re.test(id)){
        e.appendChild(document.createTextNode(event.emoji.native));
      }
      else
      {
          const country = id.slice(id.indexOf('-')+1);
          e.setAttribute('class',`flag-icon flag-icon-${country}`);        
      }
      let space  = document.createTextNode(' ');
      this.oldRange.insertNode(e);
      this.oldRange.insertNode(space);
      this.oldRange.setStartAfter(e);
      this.sel.addRange(this.oldRange);
    }
    this.showEmoji = false;
  }

  setValue(innerText: string, innerHtml: string){
    this.innerText = innerText;
    this.innerHtml = innerHtml;
    if(this.innerText === '')
      document.execCommand('removeFormat', false, ''); // remove previous format once the editor is clear
    
    this.lastChar = this.getPrecedingCharacter(window.getSelection().anchorNode); // gets the last input character
    if(this.format && this.startOffset && this.tribute){
      this.format = false;
      this.endOffset = this.sel.getRangeAt(0).endOffset;

      const range = document.createRange(); 
      range.setStart(this.node, this.startOffset-1);
      range.setEnd(this.node, this.endOffset);      
      range.deleteContents(); // deleting previous set contents
    }
    
    if(this.lastChar === '@' || this.lastChar === '#'){
      this.node = window.getSelection().anchorNode;
      this.format = true;
      this.startOffset = window.getSelection().getRangeAt(0).startOffset;
    }
  }

  insChar(char: string){
    if(window.getSelection){
      this.focus();
      let code = char==='@'?'Digit2':'Digit3';
      let event = new KeyboardEvent('keydown',{'key':`${char}`, 'code':`${code}`});
      document.getElementById('editor').dispatchEvent(event);
      
      let r = this.sel.getRangeAt(0).cloneRange();
      this.sel.removeAllRanges();
      const a = document.createTextNode(`${char}`);
    
      r.insertNode(a);
      r.setStartAfter(a);
      this.sel.addRange(r);
            
      this.setValue(this.innerText, this.innerHtml);  
    }
  }

  focus(){
    document.getElementById('editor').focus();
  }

  getPrecedingCharacter(container : any) // get last character
  { 
    const r = this.sel.getRangeAt(0).cloneRange();
    r.setStart(container, 0);
    return r.toString().slice(-1);
  }

  // opened(event: any){
  //   console.log('OPEN', event);
  // }

  closed(event: any){ // insert mentions
    // console.log('CLOSED', event);
    if(this.tribute !== '')
    {
      const input = document.createElement('input');
      input.setAttribute('value',`${this.tribute}`);
      input.setAttribute('type','button');
      input.style.border = 'none';
      input.style.padding = "3px";
      input.style.backgroundColor = '#dff6f0';
      input.style.color = '#2e279d';
      input.style.fontWeight = '';
      input.style.fontSize = 'inherit';
      input.style.cursor = 'pointer';
      const range = this.sel.getRangeAt(0);
      this.sel.removeAllRanges();

      let sp = document.createTextNode(' ');
      range.insertNode(input);
      range.insertNode(sp);
      range.setStartAfter(input);
      this.sel.addRange(range);
      this.tribute = '';
    }
  }

  //Development Purpose
  saveData(){ 
    document.getElementById('content').innerHTML = '';
    document.getElementById('content').innerHTML = this.innerHtml;
  }
}
