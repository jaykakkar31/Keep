import React, { useState } from "react";
import Fab from "@material-ui/core/Fab";

import AddIcon from "@material-ui/icons/Add";
import Zoom from "@material-ui/core/Zoom";

import axios from "axios";
import { createUser } from "../services/UserService";

function CreateArea(props) {
  // props.getAllUsers()
  //   const [title, setTitle] = useState("");
  //   const [content, setContent] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const [notesData, setNotesData] = useState({
    title: "",
    content: "",
  });
  //   const [inputTitle, setInputTitle] = useState([]);
  //   const [notes, setNotes] = useState([]);

  function handleChange(event) {
    const { name, value } = event.target;
    setNotesData((prevValue) => {
      return {
        ...prevValue,
        [name]: value,
      };
      console.log(notesdata);
    });
  }

  //   function handleContentChange(event) {
  //     setContent(event.target.value);
  //   }
  function expand() {
    setIsExpanded(true);
  }

  function submit(event) {
    // const url = "http://localhost:9000/";
    // props.getAllUsers();

    event.preventDefault();
    // axios
    //   .post(url, { title: notesData.title, content: notesData.content })
    //   .then((res) => console.log(res.data));

    // props.createUser()
    if (notesData.title === "") {
      alert("Title Cannot Be Empty");
    } else if (notesData.content === "") {
      alert("Content Cannot Be Empty");
    } else {
      props.addingItems(notesData);
      setNotesData({
        title: "",
        content: "",
      });
    }
  }

  return (
    <div>
      <form className="create-note" required>
        {isExpanded && (
          <input
            onChange={handleChange}
            //   onChange={handleTitleChange}

            name="title"
            placeholder="Title"
            value={notesData.title}
          />
        )}
        <textarea
          onClick={expand}
          onChange={handleChange}
          //   onChange={handleContentChange}
          name="content"
          placeholder="Take a note..."
          rows={isExpanded ? "3" : "1"}
          value={notesData.content}
        />
        <Zoom in={isExpanded}>
          <Fab type="submit" onClick={submit}>
            <AddIcon />
          </Fab>
        </Zoom>
      </form>
    </div>
  );
}

export default CreateArea;
