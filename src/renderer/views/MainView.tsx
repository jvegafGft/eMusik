/* eslint-disable no-console */
/* eslint-disable react/jsx-props-no-spreading */
import { createStyles } from '@mantine/core';
import { useViewportSize } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import useAppState from 'renderer/hooks/useAppState';
import { MenuCommand } from '../../shared/types/emusik';
import AppHeader from '../components/AppHeader';
import TrackDetail from '../components/TrackDetail';
import TrackList from '../components/TrackList';

const useStyles = createStyles(theme => ({
  main: {
    width: '100%',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
  },
  header: {
    minHeight: 70,
  },
  content: {
    flexGrow: 1,
  },
}));

const MainView = () => {
  const { classes } = useStyles();
  const { height } = useViewportSize();
  const [tHeight, setTHheight] = useState(0);
  const {
    tracks,
    addTracks,
    showCtxMenu,
    fixTrack,
    trackPlaying,
    setTrackPlaying,
    trackDetail,
    setTrackDetail,
    updateTrack,
  } = useAppState();

  useEffect(() => {
    const newHeight = height - 100;
    setTHheight(newHeight);
  }, [height]);

  const detailProps = {
    track: trackDetail,
    endCB: () => setTrackDetail(null),
    saveTags: updateTrack,
  };

  const tlprops = {
    tHeight,
    tracks,
    trackPlaying,
    setTrackPlaying,
    showCtxMenu,
  };

  return (
    <div className={classes.main}>
      <div className={classes.heaeder}>
        <AppHeader />
      </div>
      <div className={classes.content}>
        {trackDetail ? <TrackDetail {...detailProps} /> : <TrackList {...tlprops} />}
      </div>
    </div>
  );
};

window.electron.ipcRenderer.on('context-menu-command', (command: MenuCommand, trackId: string) => {
  switch (command) {
    case MenuCommand.PLAY_TRACK:
      setTrackPlaying(tracks.find(t => t.id === trackId));
      break;

    case MenuCommand.VIEW_DETAIL:
      setTrackDetail(tracks.find(t => t.id === trackId));
      break;

    case MenuCommand.FIX_TAGS:
      fixTrack(trackId);
      break;

    default:
      break;
  }
});

export default MainView;
