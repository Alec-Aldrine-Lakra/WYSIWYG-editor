import { Component, OnInit } from '@angular/core';

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
  constructor() {

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
      //document.getElementById('editor').focus();
      this.sel = window.getSelection();
      document.getElementById('editor').appendChild(document.createElement('br'));
      document.querySelectorAll('button')[0].addEventListener('click',()=>{
        document.execCommand('bold', false, '');
      });
      document.querySelectorAll('button')[1].addEventListener('click',()=>{
          document.execCommand('italic', false, '');
      });
      document.querySelectorAll('button')[2].addEventListener('click',()=>{
          document.execCommand('strikeThrough', false, '');
      });      
      document.querySelectorAll('button')[3].addEventListener('click',()=>{
          document.execCommand('underline', false, '');
      });
      document.querySelectorAll('button')[4].addEventListener('click',()=>{
        document.execCommand('insertunorderedList', false, '');
      });
      document.querySelectorAll('button')[5].addEventListener('click',()=>{
        document.execCommand('insertorderedList', false, '');
      });
      document.onselectionchange = () => {
        this.sel = window.getSelection();
      };
      document.getElementById('editor').addEventListener('keydown',(event)=>{
        if(event.which==8)
        {
          this.flag=1;
          let r = this.sel.getRangeAt(0).cloneRange();
          console.log(r);
        }
        else if(this.flag==1){
          document.execCommand('removeFormat', false, '');
          this.flag=0;
        }
      })
      document.getElementById('editor').addEventListener('click',()=>{     
          let range = this.sel.getRangeAt(0);
          console.log(this.sel);
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
          e.setAttribute('contenteditable','false');
      }

      document.getElementById('editor').focus();
      range.insertNode(e);
      range.setStartAfter(e);
    }
    this.showEmoji = false;
  }

  setValue(innerText, innerHtml){
    this.innerText = innerText;
    //console.log(innerHtml);
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
      const span = document.createElement('span');
      const removeSp1 = document.createElement('span'); //creating two span elements to surround the @mention tag
      //const removeSp2 = document.createElement('span');
    
      span.appendChild(document.createTextNode(`${this.tribute}`));
      //removeSp1.setAttribute('class','remove');
      //removeSp2.setAttribute('class','remove');
      span.setAttribute('contenteditable', 'false');
      span.style.backgroundColor = '#dff6f0';
      span.style.color = '#2e279d';
      span.style.fontWeight = '600';
      span.style.pointerEvents = 'auto';
      span.style.cursor = 'pointer';
      span.style.zIndex = '5';
      const range = this.sel.getRangeAt(0);
      //removeSp1.appendChild(document.createTextNode(' '));
      removeSp1.appendChild(span);
      removeSp1.appendChild(document.createTextNode(' '));
      range.insertNode(removeSp1);
      //range.insertNode(span);  
      //range.insertNode(removeSp2);
      range.setStartAfter(removeSp1);
      this.tribute = '';
    }
  }
}
