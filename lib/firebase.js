// import { initializeApp } from "firebase/app";
// import {
//   getAuth,
//   GoogleAuthProvider,
//   signInWithPopup,
//   signOut,
// } from "firebase/auth";

// const firebaseConfig = {
//   apiKey: "AIzaSyCiAoaXVYLeYj8vRsCA916kxqtSoSBofjE",
//   authDomain: "ribs-e5595.firebaseapp.com",
//   projectId: "ribs-e5595",
//   storageBucket: "ribs-e5595.firebasestorage.app",
//   messagingSenderId: "1513364360",
//   appId: "1:1513364360:web:644d76f02fb6fc34f7f83d",
// };

// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// const provider = new GoogleAuthProvider();

// export { auth, provider, signInWithPopup, signOut };


import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
   apiKey: "AIzaSyCiAoaXVYLeYj8vRsCA916kxqtSoSBofjE",
  authDomain: "ribs-e5595.firebaseapp.com",
  projectId: "ribs-e5595",
  storageBucket: "ribs-e5595.firebasestorage.app",
  messagingSenderId: "1513364360",
  appId: "1:1513364360:web:644d76f02fb6fc34f7f83d",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
