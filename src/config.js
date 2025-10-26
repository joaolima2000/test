import {initializeApp} from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyA6S8EJToVyXBAwogyAD6CJ1-FRAXHu56Y",
    authDomain: "test-1305d.firebaseapp.com",
    databaseURL: "https://test-1305d-default-rtdb.firebaseio.com",
    projectId: "test-1305d",
    storageBucket: "test-1305d.firebasestorage.app",
    messagingSenderId: "922176968487",
    appId: "1:922176968487:web:ab7564dbe00f546fd57b02",
    measurementId: "G-4YN87QTFJN"
};
  
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
export {app, database};