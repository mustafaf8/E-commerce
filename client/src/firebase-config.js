import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAWZn6bYt7Ayb5VW9ln9jqzVTc_DnHHeYo",
  authDomain: "rmrm-d84da.firebaseapp.com",
  projectId: "rmrm-d84da",
  storageBucket: "rmrm-d84da.firebasestorage.app",
  messagingSenderId: "570960794681",
  appId: "1:570960794681:web:0c1e3130131cbb184769e8",
  measurementId: "G-RD7SLB76QJ",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export default app;
