import classes from './login.module.scss';
import { Close as CloseIcon, Settings as SetIcon } from '@material-ui/icons';
import { Button, TextField } from '@material-ui/core';
import {
  Dispatch,
  SetStateAction,
  useRef,
  useState,
  KeyboardEvent,
} from 'react';
import firebase from 'firebase';

export function Login({
  setIsActiveLogin,
  setFirestore,
  toast,
}: {
  setIsActiveLogin: Dispatch<SetStateAction<boolean>>;
  setFirestore: any;
  toast: any;
}) {
  const background = useRef(null);
  let [apiKey, setApiKey] = useState('');
  let [authDomain, setAuthDomain] = useState('');
  let [projectId, setProjectId] = useState('');
  let [storageBucket, setStorageBucket] = useState('');
  let [messagingSenderId, setMessagingSenderId] = useState('');
  let [appId, setAppId] = useState('');

  function setNewFirestore() {
    if (
      !apiKey.length &&
      !authDomain.length &&
      !projectId.length &&
      !storageBucket.length &&
      !messagingSenderId.length &&
      !appId.length
    ) {
      firebase
        .app()
        .delete()
        .then(() => {
          firebase.initializeApp({
            apiKey: process.env.REACT_APP_API_KEY,
            authDomain: process.env.REACT_APP_AUTH_DOMAIN,
            projectId: process.env.REACT_APP_PROJECT_ID,
            storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
            messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
            appId: process.env.REACT_APP_APP_ID,
          });
          toast.success('Firestore connected');

          setFirestore(firebase.firestore());
          setIsActiveLogin(false);
        });
    } else {
      firebase
        .app()
        .delete()
        .then(() => {
          firebase.initializeApp({
            apiKey,
            authDomain,
            projectId,
            storageBucket,
            messagingSenderId,
            appId,
          });
          toast.success('Firestore connected');

          setFirestore(firebase.firestore());
          localStorage.setItem(
            'firestore',
            JSON.stringify({
              apiKey,
              authDomain,
              projectId,
              storageBucket,
              messagingSenderId,
              appId,
            })
          );
          setIsActiveLogin(false);
        });
    }
  }

  function insertKeys(keys: string): boolean {
    const reg =
      /((?<=apiKey: ")[^"]*)|((?<=authDomain: ")[^"]*)|((?<=projectId: ")[^"]*)|((?<=storageBucket: ")[^"]*)|((?<=messagingSenderId: ")[^"]*)|((?<=appId: ")[^"]*)/g;
    const res = keys.match(reg);
    if (res?.length === 6) {
      setApiKey(res[0]);
      setAuthDomain(res[1]);
      setProjectId(res[2]);
      setStorageBucket(res[3]);
      setMessagingSenderId(res[4]);
      setAppId(res[5]);
      return true;
    }
    return false;
  }

  function processKeyUp(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Enter') {
      setNewFirestore();
    }
  }

  return (
    <div
      className={classes.background}
      ref={background}
      onClick={(e) => {
        if (e.target === background.current!) setIsActiveLogin(false);
      }}
    >
      <div className={classes.form}>
        <TextField
          style={{
            /// @ts-ignore
            '--i': '8',
          }}
          className={classes.input}
          label="Api key"
          variant="outlined"
          onPaste={(e) => {
            e.preventDefault();
            const text = e.clipboardData.getData('text');
            if (!insertKeys(text)) setApiKey(text);
          }}
          onKeyUp={processKeyUp}
          value={apiKey}
          onChange={(e) => {
            setApiKey(e.target.value);
          }}
        />
        <TextField
          style={{
            /// @ts-ignore
            '--i': '7',
          }}
          className={classes.input}
          label="Auth domain"
          variant="outlined"
          onPaste={(e) => {
            e.preventDefault();
            const text = e.clipboardData.getData('text');
            if (!insertKeys(text)) setAuthDomain(text);
          }}
          onKeyUp={processKeyUp}
          value={authDomain}
          onChange={(e) => {
            setAuthDomain(e.target.value);
          }}
        />
        <TextField
          style={{
            /// @ts-ignore
            '--i': '6',
          }}
          className={classes.input}
          label="Project id"
          variant="outlined"
          onPaste={(e) => {
            e.preventDefault();
            const text = e.clipboardData.getData('text');
            if (!insertKeys(text)) setProjectId(text);
          }}
          onKeyUp={processKeyUp}
          value={projectId}
          onChange={(e) => {
            setProjectId(e.target.value);
          }}
        />
        <TextField
          style={{
            /// @ts-ignore
            '--i': '5',
          }}
          className={classes.input}
          label="Storage bucket"
          variant="outlined"
          onPaste={(e) => {
            e.preventDefault();
            const text = e.clipboardData.getData('text');
            if (!insertKeys(text)) setStorageBucket(text);
          }}
          onKeyUp={processKeyUp}
          value={storageBucket}
          onChange={(e) => {
            setStorageBucket(e.target.value);
          }}
        />
        <TextField
          style={{
            /// @ts-ignore
            '--i': '4',
          }}
          className={classes.input}
          label="Messaging sender id"
          variant="outlined"
          onPaste={(e) => {
            e.preventDefault();
            const text = e.clipboardData.getData('text');
            if (!insertKeys(text)) setMessagingSenderId(text);
          }}
          onKeyUp={processKeyUp}
          value={messagingSenderId}
          onChange={(e) => {
            setMessagingSenderId(e.target.value);
          }}
        />
        <TextField
          style={{
            /// @ts-ignore
            '--i': '3',
          }}
          className={classes.input}
          label="App id"
          variant="outlined"
          onPaste={(e) => {
            e.preventDefault();
            const text = e.clipboardData.getData('text');
            if (!insertKeys(text)) setAppId(text);
          }}
          onKeyUp={processKeyUp}
          value={appId}
          onChange={(e) => {
            setAppId(e.target.value);
          }}
        />
        <div
          style={{
            /// @ts-ignore
            '--i': '2',
          }}
          className={classes.buttons}
        >
          <Button
            className={classes.button}
            variant="outlined"
            color="secondary"
            onClick={() => {
              setIsActiveLogin(false);
            }}
          >
            <CloseIcon className={classes['close-icon']} color="secondary" />
            Close
          </Button>
          <Button
            className={classes.button}
            variant="outlined"
            color="primary"
            onClick={() => {
              setNewFirestore();
            }}
          >
            Set <SetIcon className={classes['set-icon']} color="primary" />
          </Button>
        </div>
      </div>
    </div>
  );
}
