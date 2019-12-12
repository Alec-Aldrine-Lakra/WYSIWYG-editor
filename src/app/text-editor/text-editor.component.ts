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
  public flag=0;
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

      // if(this.browser === 'Firefox'){
      //     document.getElementById('editor').addEventListener('keydown',(event)=>{ //firefox based browser code
      //     if(event.which==8)
      //     {
      //         let r = this.sel.getRangeAt(0);
      //         if(r.startOffset===0 && r.endOffset === 0 && r.startContainer.previousElementSibling && r.startContainer.previousElementSibling.contentEditable === 'false'){ //if mention is at the beginning along with other elements or in the middle

      //           let [endOffset, endNode, startNode, startOffset] = [r.endOffset, r.endContainer, r.startContainer.previousElementSibling.childNodes[0], 0];
      //           let nR= document.createRange();
      //           nR.setStart(startNode, startOffset);
      //           nR.setEnd(endNode, endOffset);
      //           this.sel.removeAllRanges();   
      //           nR.deleteContents();

      //           let br = document.createElement('br'); //removes the contents
      //           nR.insertNode(br);
      //           nR.setStartBefore(br);
      //           this.sel.addRange(nR);

      //           let ar = nR.startContainer.childNodes; //remove the empty span node
      //           ar.forEach(i=>{
      //             let item: any;
      //             item = i;
      //             if(item['contentEditable'] === 'false' && item.innerText === "") {
      //               item.remove();
      //               return;
      //             }
      //           })
      //         }
      //         else if(r.startContainer.firstElementChild && r.startContainer.firstElementChild.contentEditable === 'false'){ // if only mention is present at first
                
      //           console.log('HIT1');
      //           let i = r.startContainer.children.length-1;
      //           while(i>=0){
      //             if(r.startContainer.children[i].contentEditable === 'false') //last span contenteditable false
      //               break;
      //             i--;
      //           }
      //           let [endOffset, endNode, startNode, startOffset] = [r.endOffset+1,  r.endContainer, r.startContainer.children[i].childNodes[0], 0];
      //           console.log(r.startContainer.children[i].childNodes);
      //           let nR= document.createRange();
      //           nR.setStart(startNode, startOffset);
      //           nR.setEnd(endNode, endOffset);
      //           this.sel.removeAllRanges();   
      //           nR.deleteContents();

      //           let br = document.createElement('br'); //removes the contents
      //           nR.insertNode(br);
      //           nR.setStartBefore(br);
      //           this.sel.addRange(nR);

      //           let ar = nR.startContainer.childNodes; //remove the empty span node
      //           ar.forEach(i=>{
      //             let item: any;
      //             item = i;
      //             if(item['contentEditable'] === 'false' && item.innerText === "") {
      //               item.remove();
      //               return;
      //             }
      //           })
      //         }
      //         else{
      //           console.log('Cool');
      //         }       
      //     }
      //   })
      // }
      
      document.getElementById('editor').addEventListener('click',()=>{     //just for check purpose
          let range = this.sel.getRangeAt(0);
          console.log(range);
      })
  }
  
  blur(){
    this.oldRange = this.sel.getRangeAt(0).cloneRange(); // to store the range when element is blurred
  }

  toggleEmojiPicker(){
    this.showEmoji = this.showEmoji === true?false:true;
    if(!this.showEmoji)
      document.getElementById('editor').focus();
  }

  addEmoji(event){

    document.getElementById('editor').focus();
    if (window.getSelection) 
    {
      this.sel.removeAllRanges();
      this.sel.addRange(this.oldRange);
      const range = this.sel.getRangeAt(0);
      const e = document.createElement('span');
      const id = event.emoji.id;
      const re =/^flag-/
      if(!re.test(id)){
        e.appendChild(document.createTextNode(event.emoji.native));
      }
      else
      {
          const country = id.slice(id.indexOf('-')+1);
          e.setAttribute('class',`flag-icon flag-icon-${country}`);
          if(this.browser === 'Firefox')
            e.setAttribute('contenteditable','true');
          else
            e.setAttribute('contenteditable','false');
      }
      document.getElementById('editor').focus();
      range.insertNode(e);
      this.sel.removeAllRanges();
      range.setStartAfter(e);
      this.sel.addRange(range);
    }
    this.showEmoji = false;
  }

  setValue(innerText, innerHtml){
    this.innerText = innerText;
    this.innerHtml = innerHtml;
    // console.log(innerHtml);
    // console.log(this.innerHtml);
    if(this.innerText === '')
      document.execCommand('removeFormat', false, ''); //remove previous format once the editor is clear
    
    this.lastChar = this.getPrecedingCharacter(window.getSelection().anchorNode); //gets the last input character
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

  getPrecedingCharacter(container : any)// get last character
  { 
    const r = this.sel.getRangeAt(0).cloneRange();
    r.setStart(container, 0);
    return r.toString().slice(-1);
  }

  closed(){ //insert mentions
    if(this.tribute !== '')
    {
      // const span = document.createElement('span');
      // span.appendChild(document.createTextNode(`${this.tribute}`));
      // span.setAttribute('contenteditable', 'false');
      // span.style.backgroundColor = '#dff6f0';
      // span.style.color = '#2e279d';
      // span.style.fontWeight = '600';
      // span.style.pointerEvents = 'auto';
      // span.style.cursor = 'pointer';
      // const range = this.sel.getRangeAt(0);
      // this.sel.removeAllRanges();

      // let sp1 = document.createTextNode(' ');
      // let sp2 = document.createTextNode(' ');
      // range.insertNode(sp1); //inserting space front and back
      // range.insertNode(span);
      // range.insertNode(sp2);
      // range.setStartAfter(sp1);
      // this.sel.addRange(range);
      // this.tribute = '';


      const input = document.createElement('input');
      input.setAttribute('value',`${this.tribute}`);
      input.setAttribute('type','button');
      input.style.border = 'none';
      input.style.padding = "3px";
      input.style.backgroundColor = '#dff6f0';
      input.style.color = '#2e279d';
      input.style.fontWeight = '600';
      input.style.cursor = 'pointer';
      const range = this.sel.getRangeAt(0);
      this.sel.removeAllRanges();
      let sp1 = document.createTextNode(' ');
      let sp2 = document.createTextNode(' ');
      range.insertNode(sp1); //inserting space front and back
      range.insertNode(input);
      range.insertNode(sp2);
      range.setStartAfter(sp1);
      this.sel.addRange(range);
      this.tribute = '';
    }
  }
  saveData(){
    document.getElementById('content').innerHTML = '';
    document.getElementById('content').innerHTML = this.innerHtml;
  }
}
