import classes from './computer.module.scss';
import {
  Computer as NameIcon,
  InsertLink as MacIcon,
  Wifi as IpIcon,
  LocalHotel as RegionIcon,
  PowerSettingsNew as StatusIcon,
  AlarmOn as OnIcon,
  AlarmOff as OffIcon,
} from '@material-ui/icons';
import { Typography } from '@material-ui/core';
import { Dispatch, SetStateAction } from 'react';

export function Computer({
  name,
  macAddress,
  localIp,
  region,
  status,
  lastAction,
  setMacAddress,
}: {
  name: string;
  macAddress: string;
  localIp: string;
  region: string;
  status: boolean;
  lastAction: string;
  setMacAddress: Dispatch<SetStateAction<string>>;
}) {
  return (
    <div
      style={{ pointerEvents: status ? 'auto' : 'none' }}
      className={classes.box}
      onClick={() => {
        setMacAddress(macAddress);
      }}
    >
      <div className={classes.info}>
        <NameIcon color={status ? 'primary' : 'secondary'} />
        <Typography className={classes['text-header']} variant="h3">
          Name:
        </Typography>
        <Typography className={classes['text-info']} variant="h3">
          {name}
        </Typography>
      </div>
      <div className={classes.info}>
        <MacIcon color={status ? 'primary' : 'secondary'} />
        <Typography className={classes['text-header']} variant="h3">
          Mac address:
        </Typography>
        <Typography className={classes['text-info']} variant="h3">
          {macAddress}
        </Typography>
      </div>
      <div className={classes.info}>
        <IpIcon color={status ? 'primary' : 'secondary'} />
        <Typography className={classes['text-header']} variant="h3">
          Local ip address:
        </Typography>
        <Typography className={classes['text-info']} variant="h3">
          {localIp}
        </Typography>
      </div>
      <div className={classes.info}>
        <RegionIcon color={status ? 'primary' : 'secondary'} />
        <Typography className={classes['text-header']} variant="h3">
          Region:
        </Typography>
        <Typography className={classes['text-info']} variant="h3">
          {region}
        </Typography>
      </div>
      <div className={classes.info}>
        <StatusIcon color={status ? 'primary' : 'secondary'} />
        <Typography className={classes['text-header']} variant="h3">
          Status:
        </Typography>
        <Typography className={classes['text-info']} variant="h3">
          {status ? 'on' : 'off'}
        </Typography>
      </div>
      <div className={classes.info}>
        {status ? <OnIcon color="primary" /> : <OffIcon color="secondary" />}
        <Typography className={classes['text-header']} variant="h3">
          Last action:
        </Typography>
        <Typography className={classes['text-info']} variant="h3">
          {lastAction}
        </Typography>
      </div>
    </div>
  );
}
