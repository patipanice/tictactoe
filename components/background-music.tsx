import { Button } from "@nextui-org/button";
import { useEffect, useRef, useState } from "react";
import { SpeakerWaveIcon } from "./icons/SpeakerWaveIcon";
import { SpeakerXIcon } from "./icons/SpeakerXIcon";

const BackgroundMusic: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleMusic = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    audioRef.current = new Audio("/sounds/sound-background.mp3");
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3; 
    return () => {
      // Reset music to start before unmounting
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0; // Resetting the current time safely
      }
    };
  }, []);

  return (
    <Button
      onClick={toggleMusic}
      startContent={isPlaying ? <SpeakerWaveIcon /> : <SpeakerXIcon />}
      fullWidth
      isIconOnly
      color="default"
    />
  );
};

export default BackgroundMusic;
