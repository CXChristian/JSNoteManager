import { messages, components } from  "../lang/messages/en/user.js";

let manager;
document.addEventListener('DOMContentLoaded', () => {
    const notesDiv = document.getElementById('notesDiv');
    const timeDiv = document.getElementById('updateTime');
    const indexPage = document.getElementById('indexPage');
    
    buildComponents(notesDiv);
    if (indexPage == null) {   
        if (notesDiv) {
            manager = new Manager();
        } else {
            manager = new Reader();
        }
        
        setInterval(() => {
            manager.updateNotes();
            timeDiv.innerText = getCurrentTime();
        }, 2000);
    }
});

class Note {
    constructor() {
        this.id = Date.now(); // Add a unique ID to each note
        this.updateFlag = true;
        this.content = '';
    }
}

class noteRow {
    constructor(notesDiv, note, writer) {
        this.notesDiv = notesDiv;
        this.note = note;
        this.row = document.createElement('div');

        this.textField = document.createElement('textarea');
        this.textField.className = 'text-field';
        this.textField.value = note.content;
        this.textField.contentEditable = true;
        this.textField.spellcheck = false;
        this.textField.addEventListener('change', () => {
            this.note.content = this.textField.value;
            this.note.updateFlag = true;
        });
        if (!writer) {
            this.textField.disabled = true;
        }
        this.row.appendChild(this.textField);

        if (writer) {    
            this.deleteButton = document.createElement('button');
            this.deleteButton.className = 'delete-button';
            this.deleteButton.innerText = components.removeButton;
            this.deleteButton.addEventListener('click', () => {
                this.notesDiv.removeChild(this.row);
                manager.notes = manager.notes.filter(n => n.id !== this.note.id);
                localStorage.setItem('notes', JSON.stringify(manager.notes));          
            });
            this.row.appendChild(this.deleteButton);
        }

    }

    updateContent(newContent) {
        this.textField.value = newContent;
        this.note.content = newContent; // Update the note's content
        this.note.updateFlag = false;
        if (this.manager) {
            localStorage.setItem('notes', JSON.stringify(this.manager.notes)); // Save updated notes to localStorage
        }
    }
}

class Manager {
    constructor() {
        this.notesDiv = document.getElementById('notesDiv');
        this.notes = localStorage.getItem('notes') ? JSON.parse(localStorage.getItem('notes')) : [];
        this.noteRows = []; 
        this.loadNotes();
    }
    
    
    createNote() {
        let note = new Note();
        this.notes.push(note);
        localStorage.setItem('notes', JSON.stringify(this.notes));

        let noteDiv = new noteRow(this.notesDiv, note, true);  
        this.notesDiv.appendChild(noteDiv.row);
        this.noteRows.push(noteDiv); 
    }

    loadNotes() {
        this.notes.forEach(note => {
            let noteDiv = new noteRow(this.notesDiv, note, true);
            this.notesDiv.appendChild(noteDiv.row);
            this.noteRows.push(noteDiv); 
        });
    }
    
    updateNotes() {
        this.notes.forEach((note, index) => {
            if (note.updateFlag == true) {
                if (this.noteRows[index]) {
                    this.noteRows[index].updateContent(note.content);
                }
            }
        });
        localStorage.setItem('notes', JSON.stringify(this.notes));
    }
}

class Reader {
    constructor() {
        this.readDiv = document.getElementById('readDiv');
        this.notes = localStorage.getItem('notes') ? JSON.parse(localStorage.getItem('notes')) : [];
        this.noteRows = []; 
        this.loadNotes()
    }

    loadNotes() {
        this.readDiv.innerHTML = '';
        this.notes = localStorage.getItem('notes') ? JSON.parse(localStorage.getItem('notes')) : [];


        this.notes.forEach(note => {
            let noteDiv = new noteRow(this.readDiv, note, false);
            this.readDiv.appendChild(noteDiv.row);
            this.noteRows.push(noteDiv); 
        });
    }

    updateNotes() {
        this.loadNotes();
    }
}

window.initalizeNoteDiv = function() {  // need window for module type script
    manager.createNote();
}

function getCurrentTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}

function buildComponents(notesDiv) {
    const indexPage = document.getElementById('indexPage')
    const timerTitle = document.getElementById('timerTitle');
    const backButton = document.getElementById('backButton');
    const addButton = document.getElementById('addButton');
    const title = document.getElementById('title');
    const author = document.getElementById('author');
    const writerButton = document.getElementById('writerButton');
    const readerButton = document.getElementById('readerButton');

    if(notesDiv) {  // Writer Page
        addButton.innerText = components.addButton;
        timerTitle.innerText = messages.writerTimerTitle;
        backButton.innerText = components.backButton;
    } else if(indexPage != null) { // Index Page
        title.innerText = messages.indexTitle;
        author.innerText = messages.author;
        writerButton.innerText = components.writerButton;
        readerButton.innerText = components.readerButton;
    } else {  // Reader Page
        timerTitle.innerText = messages.readerTimerTitle;
        backButton.innerText = components.backButton;
    }
}

