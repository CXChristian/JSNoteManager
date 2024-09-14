class Note {
    constructor(id, content) {
        this.id = id;
        this.content = content;
    }
}

class noteRow {
    constructor() {
        this.textField = document.createElement('div');
        this.textField.className = 'text-field';
        this.textField.contentEditable = true;
        this.textField.spellcheck = false;
        this.textField.addEventListener('input', () => {
            console.log(this.textField.innerText);
            this.note.content = this.textField.innerText;
            this.save();
        });

        this.deleteButton = document.createElement('button');
        this.deleteButton.className = 'delete-button';
        this.deleteButton.innerText = 'Delete';
        this.deleteButton.addEventListener('click', () => {
            this.delete();
        });
    }

    buildRow() {
        const row = document.createElement('div');
        row.appendChild(this.textField);
        row.appendChild(this.deleteButton);
        return row;
    }
}

class Manager {
    constructor() {
        this.noteDiv = document.getElementById('noteDiv');
        this.notes = localStorage.getItem('notes') ? JSON.parse(localStorage.getItem('notes')) : [];
    }
    

    createNote() {
        let divRow = new noteRow();  
        let newNoteRow = divRow.buildRow();      
        let note = new Note(this.notes.length, '');

        this.notes.push(note);
        this.noteDiv.appendChild(newNoteRow);
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

let manager = new Manager();
setInterval(() => {
    manager.refreshNotes();
}, 2000);
