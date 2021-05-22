import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./createArea";
import {
  getAllNotes,
  createNotes,
  deleteNoteById,
} from "../services/UserService";
var count = 0;

function App() {
  const [notes, setNotes] = useState([]);
  const [mNotes, setmNotes] = useState([]);

  const fetchAllNotes = () => {
    getAllNotes().then((response) => {
      console.log(JSON.stringify(response.data) + "      Fetch All App");
      //ADDING OBJECT ONLY
      setmNotes([...response.data]);
      console.log(
        JSON.stringify(response.data) + " NOTes ADEDEd   " + response.data
      );
    });
  };
  console.log("count : " + count);

  if (count === 0) {
    count++;
    fetchAllNotes();
  }

  // POST REQUEST
  function handleClick(newNote) {
    createNotes(newNote).then((response) => {
      console.log(
        JSON.stringify(response.data) + "  Front Hend  " + newNote.title
      );
      setmNotes((prevValue) => {
        return [...prevValue, newNote];
      });
      // console.log(newNote);
      //  setNumberOfUsers(numberOfUsers + 1);
    });

    setNotes((prevValue) => {
      return [...prevValue, newNote];
    });
    // console.log(JSON.stringify(fetchAllNotes()) + "          ?Front hend");

    // const userCreate = (e) => {

    // };
  }

  function deleteNotesData(data) {
    deleteNoteById(data).then(() => {
      console.log("WORKING PROPERLY");
      fetchAllNotes();
    });
    //  console.log(data._id + "    deleteNotesData");
  }

  function deleteNote(id) {
    setNotes((prevValue) => {
      return prevValue.filter((notes, index) => {
        return id !== index;
      });
    });
    // NOT REQUIRED THIS METHOD
    // setmNotes((prevValue) => {
    //   return prevValue.filter((notes, index) => {
    //     console.log("Id :" + id + " Index: " + index);
    //     return id !== index;
    //   });
    // });
  }
  return (
    <div>
      <Header />

      <CreateArea
        // getAllUsers={fetchAllNotes}
        //  createUser={userCreate}
        addingItems={handleClick}
      />
      {/* {notes.map((notesData, index) => {  */}

      {mNotes.map((notesData, index) => {
        const { title, content } = notesData;
        console.log(index + "  MAP  " + notesData.title);

        return (
          <Note
            // getAllUsers={fetchAllNotes}
            key={index}
            id={notesData._id}
            title={title}
            notesData={notesData}
            content={content}
            deleteNote={deleteNote}
            deleteNoteById={deleteNotesData}
          />
        );
      })}
      <Footer />
    </div>
  );
}

export default App;
