import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyCtlMMMlhNegA7Bq84ih8hQQ8MDRBhoA2M",
  authDomain: "listecim-app.firebaseapp.com",
  projectId: "listecim-app",
  storageBucket: "listecim-app.appspot.com",
  messagingSenderId: "575621529361",
  appId: "1:575621529361:web:fe7bbefb78470da57dd6b0"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { 
    db
}