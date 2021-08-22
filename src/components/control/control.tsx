import { Dispatch, SetStateAction, useContext, useRef, useState } from 'react';
import { TextField, Button } from '@material-ui/core';
import {
  PowerSettingsNew as ShutdownIcon,
  Send as SendIcon,
} from '@material-ui/icons';
import classes from './control.module.scss';
import { Firestore } from '../../firestore';

export function Control({
  macAddress,
  setMacAddress,
}: {
  macAddress: string;
  setMacAddress: Dispatch<SetStateAction<string>>;
}) {
  const firestore = useContext(Firestore);
  const background = useRef(null);
  const [text, setText] = useState('');

  async function setValues(status: boolean, message: string) {
    console.log(status, message);

    const res = await firestore.collection('computers').doc(macAddress).get();
    if (status) {
      await firestore
        .collection('computers')
        .doc(macAddress)
        .set({
          ...res.data(),
          status,
          message,
        });
    } else {
      await firestore
        .collection('computers')
        .doc(macAddress)
        .set({
          ...res.data(),
          status,
          message,
          lastAction: new Date().toLocaleString().replace(/\//g, '.'),
        });
    }
  }

  return (
    <div
      className={classes.background}
      ref={background}
      onClick={(e) => {
        if (e.target === background.current!) setMacAddress('');
      }}
    >
      <TextField
        value={text}
        onChange={(e) => {
          setText(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            setValues(true, text);
            setText('');
          }
        }}
        className={classes.input}
        label="Message"
        variant="outlined"
      />
      <div className={classes.buttons}>
        <Button
          onClick={() => {
            setValues(false, '');
            setMacAddress('');
          }}
          className={classes.button}
          variant="outlined"
          color="secondary"
        >
          <ShutdownIcon
            className={classes['shutdown-icon']}
            color="secondary"
          />{' '}
          Shutdown
        </Button>
        <Button
          onClick={() => {
            setValues(true, text);
            setText('');
          }}
          className={classes.button}
          variant="outlined"
          color="primary"
        >
          Send <SendIcon color="primary" className={classes['send-icon']} />
        </Button>
      </div>
    </div>
  );
}
