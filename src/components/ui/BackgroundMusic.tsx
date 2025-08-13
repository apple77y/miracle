'use client';

import { useState, useRef, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useIsPWA } from '../../hooks/useIsPWA';

export default function BackgroundMusic() {
  const intl = useIntl();
  const isPWA = useIsPWA();
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume] = useState(0.3);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Royalty-free lofi music tracks - actual working URLs
  const lofiTracks = [
    {
      url: "https://cdn.pixabay.com/audio/2024/04/04/audio_269dc3d36d.mp3" // Pixabay royalty-free
    }
  ];

  useEffect(() => {
    const audioElement = audioRef.current;
    if (audioElement) {
      audioElement.volume = volume;
    }
    
    return () => {
      if (audioElement) {
        try {
          audioElement.pause();
          audioElement.currentTime = 0;
          audioElement.src = '';
          audioElement.load();
        } catch (error) {
          console.log('Audio cleanup error:', error);
        }
      }
    };
  }, [volume]);

  // Auto-play when component mounts
  useEffect(() => {
    const audioElement = audioRef.current;
    
    const autoPlay = async () => {
      if (audioElement) {
        try {
          await audioElement.play();
          setIsPlaying(true);
        } catch (error) {
          console.log('Auto-play failed, user interaction required:', error);
          // Auto-play failed, but don't show alert - user can manually play
        }
      }
    };

    // Small delay to ensure audio element is ready
    const timer = setTimeout(autoPlay, 1000);
    
    return () => {
      clearTimeout(timer);
      // Additional cleanup when component unmounts
      if (audioElement) {
        try {
          audioElement.pause();
          audioElement.currentTime = 0;
          audioElement.src = '';
          audioElement.load();
        } catch (error) {
          console.log('Audio cleanup error:', error);
        }
      }
    };
  }, []);

  const togglePlay = async () => {
    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        // Ensure audio is properly loaded before playing
        if (audioRef.current.readyState < 2) {
          audioRef.current.load();
        }
        audioRef.current.currentTime = 0;
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Audio playback failed:', error);
      setIsPlaying(false);
      // More graceful error handling
      console.log('음악 재생에 실패했습니다. 브라우저 설정이나 네트워크 문제일 수 있습니다.');
    }
  };

  if (isPWA) {
    return null;
  }


  return (
    <button
      onClick={togglePlay}
      className="fixed bottom-20 md:bottom-24 right-6 bg-sage hover:bg-sage-dark text-white rounded-full p-3 md:p-4 shadow-lg hover:shadow-xl transition-all duration-300 z-50 group"
      aria-label={isPlaying ? 'Pause music' : 'Play music'}
      title={isPlaying ? 'Pause music' : 'Play music'}
    >
      <audio
        ref={audioRef}
        src={lofiTracks[0]?.url}
        loop
        preload="none"
      />
      
      <div className="flex items-center justify-center w-5 h-5 md:w-6 md:h-6">
        {isPlaying ? (
          <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
          </svg>
        ) : (
          <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7L8 5z"/>
          </svg>
        )}
      </div>
      
      <span className="absolute right-16 bg-gray-800 text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
        {isPlaying ? intl.formatMessage({ id: 'ui.musicPause' }) : intl.formatMessage({ id: 'ui.musicPlay' })}
      </span>
    </button>
  );
}