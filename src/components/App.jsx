import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./createArea";
import { getAllNotes, createNotes } from "../services/UserService";

function App() {
  var count = 0;
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

  if (mNotes.length === 0 && count == 0) {
    fetchAllNotes();
    count++;
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

  function deleteNote(id) {
    setNotes((prevValue) => {
      return prevValue.filter((notes, index) => {
        return id !== index;
      });
    });

    setmNotes((prevValue) => {
      return prevValue.filter((notes, index) => {
        console.log("Id :"+id +" Index: "+ index);
        return id !== index;
      });
    });
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
            key={notesData._id}
            id={index}
            title={title}
            content={content}
            deleteNote={deleteNote}
          />
        );
      })}
      <Footer />
    </div>
  );
}

export default App;
