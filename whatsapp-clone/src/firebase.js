import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyCcVpnz2r7Ais2IDvLNZxkN7m3Bd3sQggU",
  authDomain: "whatsapp-mern-246e1.firebaseapp.com",
  projectId: "whatsapp-mern-246e1",
  storageBucket: "whatsapp-mern-246e1.appspot.com",
  messagingSenderId: "792638143976",
  appId: "1:792638143976:web:0bd4b59c4430724a9a385d",
};

firebase.initializeApp(firebaseConfig);
var auth = firebase.auth();
export { auth, firebase };
