import React, { createContext, useState, useEffect, useRef } from "react";

interface AudioContextProps {
  audioSource: string;
  playingStatus: boolean;
  volume: number;
  setAudioSource: (audioSource: string) => void;
  setPlayingStatus: (playingStatus: boolean) => void;
  setVolume: (volume: number) => void;
  songList: string[];
  currentSongIndex: number;
  setCurrentSongIndex: (currentSongIndex: number) => void;
  nextSong: () => void;
  prevSong: () => void;
}

interface AudioProviderProps {
  children: React.ReactNode;
  initialSongList: string[];
}

export const AudioContext = createContext<AudioContextProps>({
  audioSource: "",
  playingStatus: false,
  volume: 1,
  setAudioSource: () => {},
  setPlayingStatus: () => {},
  setVolume: () => {},
  songList: [],
  currentSongIndex: 0,
  setCurrentSongIndex: () => {},
  nextSong: () => {},
  prevSong: () => {}
});

function AudioProvider(props: AudioProviderProps) {
  const predefinedPlaylist = [
    "/music/1-around-the-clock.mp3",
    // "/music/2-at-the-bazaar.mp3",
    "/music/3-by-the-shore.mp3"
    // "/music/4-down-at-the-tavern.mp3",
    // "/music/5-in-the-sun.mp3"
  ];

  const [audioSource, setAudioSource] = useState("");
  const [playingStatus, setPlayingStatus] = useState(false);
  const [volume, setVolume] = useState(1);
  const [songList, setSongList] = useState(predefinedPlaylist);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioSource) {
      playingStatus ? audioRef.current?.play() : audioRef.current?.pause();
      audioRef.current!.volume = volume;
    }
  }, [audioSource, playingStatus, volume]);

  useEffect(() => {
    const audioElem = audioRef.current;

    const handleSongEnd = () => {
      const nextIndex = currentSongIndex < songList.length - 1 ? currentSongIndex + 1 : 0;
      setCurrentSongIndex(nextIndex);
    };

    if (audioElem) {
      audioElem.addEventListener("ended", handleSongEnd);
    }

    return () => {
      if (audioElem) {
        audioElem.removeEventListener("ended", handleSongEnd);
      }
    };
  }, [currentSongIndex, songList.length]);

  useEffect(() => {
    if (songList.length && currentSongIndex >= 0 && currentSongIndex < songList.length) {
      setAudioSource(songList[currentSongIndex]);
    }
  }, [songList, currentSongIndex]);

  function nextSong() {
    const nextIndex = currentSongIndex < songList.length - 1 ? currentSongIndex + 1 : 0;
    setCurrentSongIndex(nextIndex);
  }

  function prevSong() {
    const prevIndex = currentSongIndex > 0 ? currentSongIndex - 1 : songList.length - 1;
    setCurrentSongIndex(prevIndex);
  }

  const value: AudioContextProps = {
    audioSource,
    playingStatus,
    volume,
    setAudioSource,
    setPlayingStatus,
    setVolume,
    songList,
    currentSongIndex,
    setCurrentSongIndex,
    nextSong,
    prevSong
  };

  return (
    <AudioContext.Provider value={value}>
      {props.children}
      <audio ref={audioRef} src={audioSource} />
    </AudioContext.Provider>
  );
}

export default AudioProvider;
