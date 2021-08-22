import './styles/variables.scss';
import classes from './App.module.scss';
import { createTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { VpnKey as KeyIcon } from '@material-ui/icons';
import { Button } from '@material-ui/core';
import { Login } from './components/login';
import { Computer } from './components/computer';
import { Control } from './components/control';
import { useEffect, useState } from 'react';
import { Firestore } from './firestore';
import firebase from 'firebase';

const firebaseKeys = JSON.parse(localStorage.getItem('firestore') || '{}');
if (firebaseKeys.apiKey) {
  firebase.initializeApp({
    apiKey: firebaseKeys.apiKey,
    authDomain: firebaseKeys.authDomain,
    projectId: firebaseKeys.projectId,
    storageBucket: firebaseKeys.storageBucket,
    messagingSenderId: firebaseKeys.messagingSenderId,
    appId: firebaseKeys.appId,
  });
} else {
  firebase.initializeApp({
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID,
  });
}

const theme = createTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#00cc9f',
    },
    text: {
      primary: '#fff',
      secondary: '#fff',
    },
    background: {
      paper: '#00cc9f',
    },
  },
  typography: {
    allVariants: {
      fontSize: '18px',
      color: 'white',
    },
  },
});

let unsubscribe: any = null;

function App() {
  let [isActiveLogin, setIsActiveLogin] = useState(false);
  let [macAddress, setMacAddress] = useState('');
  let [computers, setComputers]: any = useState([]);
  let [firestore, setFirestore] = useState(firebase.firestore());

  document.onkeydown = (e) => {
    if (e.key === 'Escape') {
      setIsActiveLogin(false);
      setMacAddress('');
    }
  };

  useEffect(() => {
    if (unsubscribe) unsubscribe();

    unsubscribe = firestore.collection('computers').onSnapshot((doc) => {
      setComputers(
        doc.docs.map((e) => {
          const { lastAction, localIp, message, name, userName, status } =
            e.data();
          return {
            macAddress: e.id,
            lastAction,
            localIp,
            message,
            name,
            userName,
            status,
          };
        })
      );
    });
  }, [firestore]);

  return (
    <Firestore.Provider value={firestore}>
      <ThemeProvider theme={theme}>
        <Button
          color="primary"
          variant="outlined"
          onClick={() => {
            setIsActiveLogin(true);
          }}
          className={classes.button}
        >
          <KeyIcon color="primary" />
        </Button>
        {isActiveLogin && (
          <Login
            setFirestore={setFirestore}
            setIsActiveLogin={setIsActiveLogin}
          />
        )}
        {macAddress && (
          <Control macAddress={macAddress} setMacAddress={setMacAddress} />
        )}
        <div className={classes.box}>
          {computers?.map((e: any) => (
            <Computer
              name={e.name}
              macAddress={e.macAddress}
              localIp={e.localIp}
              userName={e.userName}
              status={e.status}
              lastAction={e.lastAction}
              setMacAddress={setMacAddress}
            />
          ))}
        </div>
      </ThemeProvider>
    </Firestore.Provider>
  );
}

export default App;
