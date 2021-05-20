import React, { useState } from "react";
import DeleteIcon from "@material-ui/icons/Delete";
import axios from "axios";
function Note(props) {
  // function getQuote() {
  //   axios
  //     .get("http://localhost:5000/", { crossdomain: true })
  //     .then((response) => {
  //       console.log(response.data);
  //       setText(response.data.text);
  //       setAuthor(response.data.author);
  //     });
  // }
  //AXIOS REQUEST
  // const [text, setText] = useState("");

  // console.log(
  //   JSON.stringify(props.getAllUsers()) + "           COMING FROM NOTes"
  // );

 const [retrievedData,setRetrievedData]=useState([])

  function getQuote() {
   
    axios
      .get("http://localhost:9000/api/users", { crossdomain: true })
      .then((response) => {
        console.log(JSON.stringify(response.data) + "   GET QOUTe");

        // console.log(response.data + "       COMING GET QOUTe");
        // setText(response.data);
      });
      

  }
  

  // props.getAllUsers()
  return (
    <div  className="note">
      <h1>{props.title}</h1>
      <p>{props.content}</p>
      <button
        onClick={() => {
          props.deleteNote(props.id);
          // console.log(props.id);
        }}
      >
        <DeleteIcon />
      </button>
    </div>
  );
}

export default Note;
