import './img/sad-smile.svg';
import classes from './App.module.scss';
import { createTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { VpnKey as KeyIcon } from '@material-ui/icons';
import { Button, Typography } from '@material-ui/core';
import { Login } from './components/login';
import { Computer } from './components/computer';
import { Control } from './components/control';
import { useEffect, useState } from 'react';
import { Firestore } from './firestore';
import firebase from 'firebase';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PING_TIME = 6 * 60 * 1000;
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
let idInterval: any = 0;

function App() {
  let [isActiveLogin, setIsActiveLogin] = useState(false);
  let [macAddress, setMacAddress] = useState('');
  let [computers, setComputers]: any = useState([]);
  let [firestore, setFirestore] = useState(firebase.firestore());

  useEffect(() => {
    document.onkeydown = (e) => {
      if (e.key === 'Escape') {
        setIsActiveLogin(false);
        setMacAddress('');
      }
    };
  }, []);

  useEffect(() => {
    function getComputers(
      doc: firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>
    ) {
      return doc.docs
        .map((e) => {
          let {
            lastAction,
            pingTime,
            localIp,
            message,
            name,
            userName,
            status,
          } = e.data();

          if (status) {
            const lastPingTime = new Date(
              pingTime
                .split(', ')
                .map((e: string, i: number) =>
                  i ? e : e.split('.').reverse().join('.')
                )
                .join(', ')
            ).valueOf();

            if (lastPingTime + PING_TIME < new Date().valueOf()) {
              lastAction = pingTime;
              status = false;
            }
          }

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
        .sort((a, b) => (a.status > b.status ? -1 : 0));
    }

    if (unsubscribe) unsubscribe();
    if (idInterval) clearInterval(idInterval);

    unsubscribe = firestore.collection('computers').onSnapshot((doc) => {
      setComputers(getComputers(doc));
    });

    idInterval = setInterval(async () => {
      const doc = await firestore.collection('computers').get();
      setComputers(getComputers(doc));
    }, PING_TIME);
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
            toast={toast}
          />
        )}
        {macAddress && (
          <Control
            macAddress={macAddress}
            setMacAddress={setMacAddress}
            toast={toast}
          />
        )}
        <ToastContainer
          position="top-center"
          autoClose={2500}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          limit={3}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <div className={classes.box}>
          {computers?.map((e: any, index: number) => (
            <Computer
              name={e.name}
              macAddress={e.macAddress}
              localIp={e.localIp}
              userName={e.userName}
              status={e.status}
              lastAction={e.lastAction}
              setMacAddress={setMacAddress}
              key={index}
            />
          ))}
          {computers && !computers.length && (
            <div className={classes['empty-box']}>
              <div className={classes['sad-smile']}></div>
              <Typography className={classes.header} variant="h1">
                No computers connected yet
              </Typography>
            </div>
          )}
        </div>
      </ThemeProvider>
    </Firestore.Provider>
  );
}

export default App;
