import Sidebar from "./components/Sidebar";
import Chat from "./components/Chat";
import Login from "./components/Login";
import { useStateValue } from "./StateProvider";
// import Pusher from "pusher-js";
import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";
import "./App.css";
import NewContact from "./components/NewContact";
import Opacity from "./components/Opacity";

function App() {
  const [user] = useAuthState(auth);
  const [{ userId, contact }, dispatch] = useStateValue();

  useEffect(() => {
    dispatch({
      type: "SET_USERID",
      userId: JSON.parse(localStorage.getItem("userId")),
    });
    dispatch({
      type: "SET_USERCONTACT",
      contact: JSON.parse(localStorage.getItem("contact")),
    });
  }, []);

  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          {user ? (
            <Route
              path="/home"
              element={
                <div className="app__body">
                  <Sidebar />
                  <Chat />
                  {/* <NewContact /> */}
                  {/* <Opacity /> */}
                </div>
              }
            />
          ) : (
            <Route path="/" element={<Login />} />
          )}

          {/* <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <div className="app__body">
                <Sidebar />
                <Chat />
              </div>
            }
          /> */}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
