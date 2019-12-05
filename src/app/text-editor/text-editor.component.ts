import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.css']
})
export class TextEditorComponent implements OnInit {
  public mentionConfig: any;
  public showEmoji: boolean;
  public text: string = "";
  constructor() {
    this.showEmoji = false;
    //this.text='';
    this.mentionConfig = {
      mentions: [
        {
            items: [ "Noah", "Liam", "Mason", "Jacob", "Anmol", "Alec","Niraj"],
            triggerChar: '@',
            mentionSelect: (item)=>`@${item.name}`,
            labelKey: 'name',
            maxItems: 4, 
            disableSearch: false
        },
        {
            items: [ "20/12/13", "13/4/19", "16/12/11"],
            triggerChar: '#',
            mentionSelect: (item)=>`#${item.date}`,
            labelKey: 'date',
            maxItems: 4, 
            disableSearch: false
        },
      ], 
    }
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
      }
    }
    this.text = document.getElementById('editor').innerHTML;
    this.showEmoji = false;
  }

  setValue(val){
    this.text = val;
  }
}
