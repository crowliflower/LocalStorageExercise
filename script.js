document.addEventListener("DOMContentLoaded", function() {
    //getting all the elements I need to change later
    const noteContainer = document.getElementById("note-container");
    const newNoteButton = document.getElementById("new-note-button");
    const colorForm = document.getElementById("color-form");
    const colorInput = document.getElementById("color-input");


    //note Color will help the color assignment process by holding the user entered color in the color form
    //note IDCounter keeps track of made notes and stores their IDs
    let noteColor = localStorage.getItem("noteColor") || null;//setting the color to the read value from storage, or zero if storage comes up null
    let noteIDCounter = Number(localStorage.getItem("noteIDCounter")) || 0;


    function readNotes () {//retrieving the notes stored in memory, but not yet doing anything with them
        let notes = localStorage.getItem("notes");

        if (!notes) {//if notes comes back as null, then we're assigning it as a new empty array
            notes = [];
        } else {
            notes = JSON.parse(notes);//otherwise, parse the saved JSON
        }
        return notes;

    }

    function saveNotes(notes) {
        localStorage.setItem("notes", JSON.stringify(notes));
    }

    function loadNotes () {
        const notes = readNotes(); //reading all notes from memory to be loaded in a for of loop
        console.log(notes);
        for (const note of notes) {// this function assigns all the proper data to where it goes in the note
            const noteElement = document.createElement("div");//instatiating the note
            noteElement.setAttribute("data-note-id", note.id.toString()); //putting the note's id in the data attribute where the others have them
            noteElement.textContent = note.content;//setting note ID 
            noteElement.className = "note";//puts the note in the 'note' css class
            noteElement.style.backgroundColor = noteColor;//setting the note to be the same color as the others currently are
            noteContainer.appendChild(noteElement);//puts the note  in the right group so it continues to be updated after the dom is created
        }
    }

    loadNotes();
    

    colorForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const newColor = colorInput.value.trim();
        if (!newColor) return;

        const notes = readNotes();
        document.querySelectorAll(".note").forEach(note => {
            note.style.backgroundColor = newColor;
            const id = Number(note.getAttribute("data-note-id"));
            const noteObj = notes.find(n => n.id === id);
            if (noteObj) noteObj.color = newColor;
        });

        saveNotes(notes);
        noteColor = newColor;
        localStorage.setItem("noteColor", noteColor);
        colorInput.value = "";
    });
    
    function addNewNote () {
        const notes = readNotes();
        const note = document.createElement('div'); //instantiating the box as a new div
        note.setAttribute('data-note-id', noteIDCounter.toString()); //assigning the data attribute to the box id
        note.textContent = `Note ${noteIDCounter}`;//setting the box ID as content
        note.className = 'note';//assigning class name
        note.style.backgroundColor = noteColor;//assigning box color
        noteContainer.appendChild(note);//putting this new box in the box container so the DOM still has jurisdiction over it even after creation
        
        notes.push({
            id: noteIDCounter,
            content: note.textContent,
            color: noteColor
        });
        saveNotes(notes);

        console.log(noteIDCounter);

        noteIDCounter++;

        console.log(noteIDCounter);
        localStorage.setItem("noteIDCounter", noteIDCounter);
        //holy shit, this function was hard for me

    }

    newNoteButton.addEventListener("click", function () {
        addNewNote();
    });

    document.addEventListener("dblclick", function (e) {
        // console.log(e);
        if (e.target.classList.contains("note")) {
            e.target.remove();

            const id = Number(e.target.getAttribute("data-note-id"));// retrieving the target note's data id attribute and assigning it to a variable to be used later 
            const notes = readNotes();//retrieving all notes

            for (let i = 0; i < notes.length; i++) {//loop through all notes, looking for one that has a matching id the the one we clicked on
                if (notes[i].id === id) {
                    notes.splice(i, 1)
                }
            
            }
            saveNotes(notes);
        }
        
    });

    document.addEventListener("mouseover", function (e) {
        // console.log(e);
        if (e.target.classList.contains('note')) {
            e.target.textContent = `x ${e.pageX}, y ${e.pageY}`;
        }

    });

    document.addEventListener("mouseout", function(e) {
        if (e.target.classList.contains("note")) {
            const noteID = e.target.getAttribute("data-note-id")
            e.target.textContent = `Note ${noteID}`;
        }
    });

    document.addEventListener("keydown", function(e) {
        if (e.target.id === "color-input") {
            return;
        }

        let keypress = e.key.toLowerCase();
        if (keypress === "n") {
            addNewNote();
        }
    });
});