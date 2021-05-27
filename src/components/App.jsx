import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";
import Login from "./Login";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./createArea";
import Register from "./Register";

import {
  getAllNotes,
  createNotes,
  deleteNoteById,
  loginData,
  registerData,
} from "../services/UserService";
var count = 0;

function App() {
  const [isRegister, setIsRegister] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [notes, setNotes] = useState([]);
  const [mNotes, setmNotes] = useState([]);
  const [loginResponse, setResponse] = useState();
  const [mUsername, setmUsername] = useState("");

  const rememberMe = localStorage.getItem("rememberMe");
  const username = localStorage.getItem("username");

  const fetchAllNotes = () => {
    getAllNotes().then((response) => {
      console.log("Fetch All Notes Called");
      console.log(JSON.stringify(response.data) + "      Fetch All App");
      //ADDING OBJECT ONLY
      setmNotes([...response.data]);
      // console.log(
      //   JSON.stringify(response.data) + " NOTes ADEDEd   " + response.data
      // );
    });
  };

  console.log("count : " + count);

  if (count === 0) {
    count++;
    fetchAllNotes();
  }

  function handleLogin(data) {
    loginData(data).then((response) => {
      console.log(JSON.stringify(data) + " This");
      // const { user, rememberMe } = this.state;

      // localStorage.setItem("user", rememberMe ? user : "");

      console.log(JSON.stringify(response) + " LOGIN HANDLe");
      switch (response.data.bool) {
        case true:
          console.log("TRUE");
          localStorage.setItem("rememberMe", data.email);
          localStorage.setItem("username", response.data.username);
          // setmUsername(response.data.username);
          // setUsername(response.data.username);
          setIsLogin(true);
          break;
        // case "Password Is incorrect*":
        //   setResponse(response.data);
        //   break;
        case false:
          setResponse("Invalid email or password*");
          break;
      }
      // if (JSON.stringify(response.data)) {
      //   setIsLogin(true);
      // } else if (
      //   JSON.stringify(response.data).localeCompare("Password Is incorrect")
      // ) {
      //   console.log("MATCH 1");
      //   setResponse(response.data);
      // } else if (JSON.stringify(response.data) === "Invalid email") {
      //   setResponse(JSON.stringify(response.data));
      // } //   setResponse(JSON.stringify(response.data));
      // // }
    });
  }

  function handleRegister(data) {
    registerData(data).then((response) => {
      console.log(JSON.stringify(response.data) + "  RESPONSe");
      if (JSON.stringify(response.data).localeCompare("success")) {
        setIsRegister(true);
      }
    });
  }

  // POST REQUEST
  function handleClick(newNote) {
    createNotes(newNote).then((response) => {
      console.log(
        JSON.stringify(response.data) + "  Front Hend  " + newNote.title
      );

      // setmNotes((prevValue) => {
      //   return [...prevValue, newNote];
      // });
      fetchAllNotes();
    });
    // fetchAllNotes()

    setNotes((prevValue) => {
      return [...prevValue, newNote];
    });
    // console.log(JSON.stringify(fetchAllNotes()) + "          ?Front hend");
  }

  function deleteNotesData(data) {
    console.log(JSON.stringify(data) + "DELENOTEDATA FUNC");
    deleteNoteById(data).then(() => {
      console.log("WORKING PROPERLY");
      fetchAllNotes();
    });
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
  function handleLogout() {
    localStorage.clear();
    console.log("STORAGE CLEARED");
    window.location.reload();
  }

  return (
    <Router>
      <div>
        {/* <Link to="/login"></Link>
        <Link to="/"></Link>
        <Link to="/"></Link> */}
        <Switch>
          <Route exact path="/login">
            {rememberMe !== null ? (
              <Redirect to="/" />
            ) : (
              <Login login={handleLogin} LoginResponse={loginResponse} />
            )}
          </Route>

          <Route path="/register">
            {rememberMe !== null ? (
              <Redirect to="/" />
            ) : (
              <Register register={handleRegister} />
            )}
          </Route>

          <Route path="/">
            {rememberMe !== null ? (
              <div>
                <Header heading={username} logout={handleLogout} />

                <CreateArea
                  // getAllUsers={fetchAllNotes}
                  //  createUser={userCreate}
                  addingItems={handleClick}
                />
                {/* {notes.map((notesData, index) => {  */}

                {mNotes.map((notesData, index) => {
                  const { title, content, _id } = notesData;
                  {
                    /* console.log(index + "  MAP  " + JSON.stringify(notesData)); */
                  }

                  return (
                    <Note
                      // getAllUsers={fetchAllNotes}
                      key={index}
                      id={_id}
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
            ) : (
              <Redirect to="/login" />
            )}
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
