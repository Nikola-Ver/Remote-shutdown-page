import classes from './login.module.scss';
import { Close as CloseIcon, Settings as SetIcon } from '@material-ui/icons';
import { Button, TextField } from '@material-ui/core';
import { Dispatch, SetStateAction, useRef, useState } from 'react';
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
                      messagingSenderId:
                        process.env.REACT_APP_MESSAGING_SENDER_ID,
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
            }}
          >
            Set <SetIcon className={classes['set-icon']} color="primary" />
          </Button>
        </div>
      </div>
    </div>
  );
}
