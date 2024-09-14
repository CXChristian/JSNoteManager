class Note {
    constructor(id, content) {
        this.id = id;
        this.content = content;
    }
}

class noteRow {
    constructor(notesDiv) {
        this.notesDiv = notesDiv;
        this.row = document.createElement('div');

        this.textField = document.createElement('textarea');
        this.textField.className = 'text-field';
        this.textField.contentEditable = true;
        this.textField.spellcheck = false;
        this.textField.addEventListener('input', () => {
            console.log(this.textField.value);
            this.note.content = this.textField.value;
        });
        
        this.deleteButton = document.createElement('button');
        this.deleteButton.className = 'delete-button';
        this.deleteButton.innerText = 'remove';
        this.deleteButton.addEventListener('click', () => {
            this.notesDiv.removeChild(this.row);
            
        });

        this.row.appendChild(this.textField);
        this.row.appendChild(this.deleteButton);
    }
}

class Manager {
    constructor() {
        this.notesDiv = document.getElementById('notesDiv');
        this.notes = localStorage.getItem('notes') ? JSON.parse(localStorage.getItem('notes')) : [];
    }
    
    
    createNote() {
        let noteDiv = new noteRow(this.notesDiv);  
        let note = new Note(this.notes.length, '');
        this.notes.push(note);
        this.notesDiv.appendChild(noteDiv.row);
        localStorage.setItem('notes', JSON.stringify(this.notes));
    }    
    
    updateNotes() {
        
    }
    
    readAllNotes() {
        return this.notes;
    }
    
    refreshNotes() {
        localStorage.getItem('notes') ? this.notes = JSON.parse(localStorage.getItem('notes')) : this.notes = [];
    }
}

function initalizeNoteDiv() {
    manager.createNote();
}

const manager = new Manager();
setInterval(() => {
    manager.refreshNotes();
}, 2000);
