'use strict';
import { Component, OnInit } from '@angular/core';
import * as Bowser from 'bowser';
// import ReconnectingWebSocket from 'reconnecting-websocket';
// import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html'; 
const chance = require('chance').Chance();


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
  public flag = 0;
  public browser: string;
  public innerHtml: string;
  public author: number;


  public content: any; // deltas
  public change: any; // deltas


  private sharedb: any; // collaborative
  private socket: any; // collaborative
  private connection: any; // collaborative
  private doc: any; // collaborative

  public deleteLength: number;
  constructor() {

    this.author = chance.integer({ min: 0, max: 20 });
    this.sel = window.getSelection();
    this.sharedb = require('@teamwork/sharedb/lib/client');
    this.sharedb.types.register(require('rich-text').type);
    // Open WebSocket connection to ShareDB server
    this.socket = new ReconnectingWebSocket('ws://localhost:8080/sharedb');
    this.connection = new this.sharedb.Connection(this.socket);
    this.doc = this.connection.get('examples', 'richtext11');
    console.log(this.doc);
    this.browser = Bowser.getParser(window.navigator.userAgent).getBrowserName();

    window.onbeforeunload = () => {
      sessionStorage.removeItem('range');
    };

    this.showEmoji = false;
    this.tribute = '';
    this.mentionConfig = {
      mentions: [
        {
            items: this.names(),
            triggerChar: '@',
            mentionSelect: (item) => {
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
            mentionSelect: (item) => {
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
  names() { // return names
    return ['Alec', 'Joyce', 'Nalin', 'Dominic'];
  }

  dates() { // return dates
    return [ '20-12-13', '13-04-19', '16-12-11']
  }

  ngOnInit() {

      this.doc.fetch((err) => { // If the document does not exist
          if (err){
            throw err;
          }
          if (this.doc.type === null) {
            this.doc.create([{insert: 'Document Created'}], 'rich-text');
            return;
          }
      });

      this.doc.subscribe((err) => { // Get initial value of document and subscribe to changes
        if(err) {
          throw err;
        }
        document.getElementById('editor').innerHTML = this.deltaToHtml(this.doc.data.ops);
        this.doc.on('op', (op, source) => {
          if (source === 'editor') {
            return;
          }
          if(op.ops.length > 1) {
            this.updateContents(op.ops[0].retain, op.ops[1], document.getElementById('editor').childNodes);
          } else {
            this.updateContents(-1, op.ops[0], document.getElementById('editor').childNodes);
          }
        });
       });

      document.getElementById('editor').addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' || e.key === 'Delete') {
           this.deleteLength = this.sel.getRangeAt(0).toString().length;
           this.deleteLength = this.deleteLength === 0 ? 1 : this.deleteLength;
        }
      });

      // Development Purpose
      document.getElementById('editor').addEventListener('click', () => {
        const range = this.sel.getRangeAt(0);
        console.log(range);
      });
  }


  // updateContents(index: number, ops: any, children: any) {
  //   this.focus();
  //   const preCaretRange = this.sel.getRangeAt(0).cloneRange();
  //   for (let i = 0; i< children.length; i++) {
  //     if (children[i].textContent.length < index) {
  //         console.log(children[i]);
  //         index -= children[i].textContent.length;
  //         // console.log(index);
  //     } else {
  //       if (children[i].nodeType === 1) {
  //         this.updateContents(index, ops, children[i].childNodes);
  //       } else {
  //           if(ops.insert) {
  //             preCaretRange.setStart(children[i] , index);
  //             preCaretRange.setEnd(children[i] , index);
  //             preCaretRange.insertNode(document.createTextNode(ops.insert));
  //           } else {
  //             preCaretRange.setStart(children[i] , index);
  //             preCaretRange.setEnd(children[i] , index + 1);
  //             console.log(preCaretRange.toString());
  //             preCaretRange.deleteContents();
  //           }
  //           break;
  //       }
  //     }
  //   }
  // }
  // deltaToHtml(data: any) {
  //   const converter = new QuillDeltaToHtmlConverter(data, {});
  //   const html = converter.convert();
  //   return html;
  // }

  blur() {
    this.oldRange = this.sel.getRangeAt(0).cloneRange(); // to store the range when element is blurred
  }

  toggleEmojiPicker() {
    this.showEmoji = this.showEmoji === true ? false : true;
    if (!this.showEmoji) {
      this.focus();
    }
  }

  insertBold() {
    document.execCommand('bold', false, '');
    this.showEmoji = false;
  }

  insertItalic() {
    document.execCommand('italic', false, '');
    this.showEmoji = false;
  }

  insertStrikeThrough() {
    document.execCommand('strikeThrough', false, '');
    this.showEmoji = false;
  }

  insertUnderLine() {
    document.execCommand('underline', false, '');
    this.showEmoji = false;
  }

  insertOrderedList() {
    document.execCommand('insertorderedList', false, '');
    this.showEmoji = false;
  }

  insertUnorderedList() {
    document.execCommand('insertunorderedList', false, '');
    this.showEmoji = false;
  }

  addEmoji(event: any) {

    this.focus();
    if (window.getSelection)
    {
      this.sel.removeAllRanges();
      const e = document.createElement('span');
      const id = event.emoji.id;
      const re =/^flag-/;
      if(this.browser === 'Firefox'){
        e.setAttribute('contenteditable', 'true');
      } else {
        e.setAttribute('contenteditable', 'false');
      }

      if (!re.test(id)) {
        e.appendChild(document.createTextNode(event.emoji.native));
      } else {
          const country = id.slice(id.indexOf('-') + 1);
          e.setAttribute('class', `flag-icon flag-icon-${country}`);
      }
      const space  = document.createTextNode(' ');
      this.oldRange.insertNode(e);
      this.oldRange.insertNode(space);
      this.oldRange.setStartAfter(e);
      this.sel.addRange(this.oldRange);
    }
    this.showEmoji = false;
  }


  showPosition(element: any): number {
      let caretOffset = 0;
      if (window.getSelection) {
        const range = this.sel.getRangeAt(0);
        const preCaretRange = range.cloneRange();
        preCaretRange.selectNodeContents(element);
        preCaretRange.setEnd(range.endContainer, range.endOffset);
        caretOffset = preCaretRange.toString().length;
      }
      return caretOffset;
  }

  // generateDelta(op: string, data: any, retain: number) {

  //     const d = document.getElementById('content');
  //     let changeFormat: string;
  //     let contentFormat: string;
  //     d.innerHTML = '';
  //     if (retain - 1 > 0) {
  //       retain = op === 'insert' ? retain - 1 : retain;
  //       if (op === 'insert') {
  //         this.change = { ops: [{retain}, { insert : data }]};
  //       } else {
  //         this.change = { ops: [{retain}, { delete : data }]};
  //       }

  //       changeFormat = `change = { <br>
  //         &nbsp; "ops": [ <br>
  //         &nbsp;&nbsp;&nbsp;&nbsp; { <br>
  //         &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; "retain": ${retain} <br>
  //         &nbsp;&nbsp;&nbsp;&nbsp;  },<br>
  //         &nbsp;&nbsp;&nbsp;&nbsp;  {<br>
  //         &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; "${op}": "${data}"<br>
  //         &nbsp;&nbsp;&nbsp;&nbsp;  }<br>
  //         &nbsp;&nbsp;]<br>
  //       }`; // dev purpose

  //     } else {

  //         if (retain !== 0 && op === 'delete' ) {
  //           this.change = { ops: [{retain}, { delete : data }]};
  //           changeFormat = `change = { <br>
  //             &nbsp; "ops": [ <br>
  //             &nbsp;&nbsp;&nbsp;&nbsp; { <br>
  //             &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; "retain": ${retain} <br>
  //             &nbsp;&nbsp;&nbsp;&nbsp;  },<br>
  //             &nbsp;&nbsp;&nbsp;&nbsp;  {<br>
  //             &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; "${op}": "${data}"<br>
  //             &nbsp;&nbsp;&nbsp;&nbsp;  }<br>
  //             &nbsp;&nbsp;]<br>
  //           }`;


  //         } else {
  //           if (op === 'insert') {
  //             this.change = { ops: [{ insert: data }]};
  //           } else {
  //             this.change = { ops: [{ delete : data }]};
  //           }

  //           changeFormat = `change = { <br>
  //             &nbsp; "ops": [ <br>
  //             &nbsp;&nbsp;&nbsp;&nbsp;  {<br>
  //             &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; "${op}": "${data}"<br>
  //             &nbsp;&nbsp;&nbsp;&nbsp;  }<br>
  //             &nbsp;&nbsp;]<br>
  //           }`;
  //         }
  //     }
  //     let s = document.getElementById('editor').innerHTML;
  //     s = s.replace(/<br>/g, '/n');
  //     s = s.replace(/<\/[p,br]*>/g, '/n');
  //     s = s.replace(/<\/?[p]*>/g, '');
  //     s = s.replace(/\\/g, '\\\\');
  //     const a = this.author;
  //     this.content = {
  //       ops : [{ insert : s, author: a }]
  //     };
  //     contentFormat = `content = {<br>
  //       &nbsp; "ops": [ <br>
  //       &nbsp;&nbsp;&nbsp;&nbsp;  {<br>
  //       &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; "insert": "${s}"<br>
  //       &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; "author": "${this.author}"<br>
  //       &nbsp;&nbsp;&nbsp;&nbsp;  }<br>
  //       &nbsp;&nbsp;]<br>
  //     }`;

  //     d.innerHTML = changeFormat + '\n\n' + contentFormat; // Development Purpose
  //     // if ($event.source !== 'user') return;
  //     this.doc.submitOp(this.change, {source: 'editor'});
  // }



  setValue(event: any, innerText: string, innerHtml: string) {

    // if (event) {
    //    if (event.data) {
    //       this.generateDelta('insert', event.data, this.showPosition(document.getElementById('editor')));
    //    } else {
    //      this.generateDelta('delete', this.deleteLength, this.showPosition(document.getElementById('editor')));
    //    }
    // }

    this.innerText = innerText;
    this.innerHtml = innerHtml;
    if (this.innerText === ''){
      document.execCommand('removeFormat', false, ''); // remove previous format once the editor is clear
    }
    this.lastChar = this.getPrecedingCharacter(window.getSelection().anchorNode); // gets the last input character
    if (this.format && this.startOffset && this.tribute){
      this.format = false;
      this.endOffset = this.sel.getRangeAt(0).endOffset;

      const range = document.createRange();
      range.setStart(this.node, this.startOffset - 1);
      range.setEnd(this.node, this.endOffset);
      range.deleteContents(); // deleting previous set contents
    }

    if (this.lastChar === '@' || this.lastChar === '#') {
      this.node = window.getSelection().anchorNode;
      this.format = true;
      this.startOffset = window.getSelection().getRangeAt(0).startOffset;
    }
  }

  insChar(char: string) {
    if (window.getSelection) {
      this.focus();
      const code = char === '@' ? 'Digit2' : 'Digit3';
      const event = new KeyboardEvent('keydown',{ key : char, code});
      document.getElementById('editor').dispatchEvent(event);
      const r = this.sel.getRangeAt(0).cloneRange();
      this.sel.removeAllRanges();
      const a = document.createTextNode(`${char}`);
      r.insertNode(a);
      r.setStartAfter(a);
      this.sel.addRange(r);
      this.setValue(null, this.innerText, this.innerHtml);
    }
  }

  focus() {
    document.getElementById('editor').focus();
  }

  getPrecedingCharacter(container: any) { // get last character

    const r = this.sel.getRangeAt(0).cloneRange();
    r.setStart(container, 0);
    return r.toString().slice(-1);
  }

  closed(event: any) { // insert mentions

    if (this.tribute !== '') {

      const input = document.createElement('input');
      input.setAttribute('value', `${this.tribute}`);
      input.setAttribute('type', 'button');
      input.style.border = 'none';
      input.style.padding = '3px';
      input.style.backgroundColor = '#dff6f0';
      input.style.color = '#2e279d';
      input.style.fontWeight = '';
      input.style.fontSize = 'inherit';
      input.style.cursor = 'pointer';
      const range = this.sel.getRangeAt(0);
      this.sel.removeAllRanges();

      const sp = document.createTextNode(' ');
      range.insertNode(input);
      range.insertNode(sp);
      range.setStartAfter(input);
      this.sel.addRange(range);
      this.tribute = '';
    }
  }
}
