import React, { useState } from "react";
import { firebase, auth } from "../firebase";
import axios from "axios";
import { useStateValue } from "../StateProvider";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/Login.css";

function Login() {
  const [mynumber, setnumber] = useState("");
  const [otp, setotp] = useState("");
  const [show, setshow] = useState(false);
  const [final, setfinal] = useState("");
  const [{ userId, contact }, dispatch] = useStateValue();
  const navigate = useNavigate();

  const signin = () => {
    if (mynumber === "" || mynumber.length < 10) return;

    let verify = new firebase.auth.RecaptchaVerifier("recaptcha-container");
    auth
      .signInWithPhoneNumber(mynumber, verify)
      .then((result) => {
        setfinal(result);
        toast("Code sent!");
        setshow(true);
      })
      .catch((err) => {
        toast.danger("Error!");
        window.location.reload();
      });
  };

  const ValidateOtp = () => {
    const result = mynumber.slice(4);
    setnumber(result);
    if (otp === null || final === null) return;
    final
      .confirm(otp)
      .then(async () => {
        // success
        try {
          await axios
            .post(`http://localhost:3000/api/newuser`, { contact: result })
            .then((res) => {
              toast.success("Successfully loggedin!");
              dispatch({
                type: "SET_USERID",
                userId: res.data._id,
              });
              dispatch({
                type: "SET_USERCONTACT",
                contact: result,
              });
              localStorage.setItem("userId", JSON.stringify(res.data._id));
              localStorage.setItem("contact", JSON.stringify(result));
              console.log(typeof res.data._id);
              console.log(res.data);
            });
        } catch (error) {
          alert(error.message);
        }
        // navigate("/home");
        window.location = "/home";
      })
      .catch((err) => {
        toast.danger("Wrong code!");
      });
  };

  return (
    <div className="login">
      <div className="login__background">
        <div className="login__logo">
          <img
            src="https://cdn.usbrandcolors.com/images/logos/whatsapp-logo.svg"
            alt=""
          />
          <h3>WhatsUpp</h3>
        </div>
      </div>
      <div
        className="login__body"
        style={{ visibility: !show ? "visible" : "hidden" }}
      >
        <div className="login__heading">Verify your phone number</div>
        <p className="login__details">
          WhatsUpp will send an SMS message(carrier charges may apply) to verify
          your phone number.
        </p>
        <h4>Enter your phone number.</h4>
        <input
          value={mynumber}
          onChange={(e) => {
            setnumber(e.target.value);
          }}
          placeholder="phone number"
        />
        <br />
        <br />
        <div id="recaptcha-container"></div>
        <button onClick={signin}>NEXT</button>
        <div className="login__footer">
          <p>You must be at least 16 years old to register. Learn how </p>{" "}
          <p> WhatsUpp works with the XYZ Companies.</p>
        </div>
      </div>

      <div
        className="login__bodyOtp"
        style={{ visibility: show ? "visible" : "hidden" }}
      >
        <div className="login__heading">Verify {mynumber}</div>
        <p className="login__details">
          Waiting to automatically detect an SMS sent to{" "}
          <strong>{mynumber}</strong>?
        </p>
        <input
          type="text"
          placeholder={"Enter your OTP"}
          onChange={(e) => {
            setotp(e.target.value);
          }}
        ></input>
        <div className="login__footer">
          <p>Enter 6-digit code</p>
        </div>
        <button onClick={ValidateOtp}>SUBMIT</button>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Login;
