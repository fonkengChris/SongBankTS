import React, { useRef, useEffect, useState } from "react";
import {
  Box,
  VStack,
  Text,
  Button,
  HStack,
  Badge,
  Alert,
  AlertIcon,
  Spinner,
  Select,
} from "@chakra-ui/react";
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute, FaDownload, FaExternalLinkAlt } from "react-icons/fa";

interface BrowserSpecificVideoPlayerProps {
  videoUrl: string;
  title: string;
  thumbnailUrl?: string;
  onError?: (error: string) => void;
}

type BrowserType = 'firefox' | 'chrome' | 'safari' | 'opera' | 'edge' | 'yandex' | 'unknown';

interface BrowserInfo {
  type: BrowserType;
  version: string;
  userAgent: string;
  supportsH264: boolean;
  supportsWebM: boolean;
  supportsMP4: boolean;
  hasHardwareAcceleration: boolean;
}

const BrowserSpecificVideoPlayer: React.FC<BrowserSpecificVideoPlayerProps> = ({
  videoUrl,
  title,
  thumbnailUrl,
  onError,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [browserInfo, setBrowserInfo] = useState<BrowserInfo | null>(null);
  const [forceMode, setForceMode] = useState<string>('auto');

  // Detect browser and capabilities
  const detectBrowser = (): BrowserInfo => {
    const userAgent = navigator.userAgent;
    let type: BrowserType = 'unknown';
    let version = '';

    // Detect browser type
    if (userAgent.includes('Firefox')) {
      type = 'firefox';
      version = userAgent.match(/Firefox\/(\d+)/)?.[1] || '';
    } else if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
      type = 'chrome';
      version = userAgent.match(/Chrome\/(\d+)/)?.[1] || '';
    } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
      type = 'safari';
      version = userAgent.match(/Version\/(\d+)/)?.[1] || '';
    } else if (userAgent.includes('OPR') || userAgent.includes('Opera')) {
      type = 'opera';
      version = userAgent.match(/(?:OPR|Opera)\/(\d+)/)?.[1] || '';
    } else if (userAgent.includes('Edg')) {
      type = 'edge';
      version = userAgent.match(/Edg\/(\d+)/)?.[1] || '';
    } else if (userAgent.includes('YaBrowser')) {
      type = 'yandex';
      version = userAgent.match(/YaBrowser\/(\d+)/)?.[1] || '';
    }

    // Test codec support
    const video = document.createElement('video');
    const supportsH264 = video.canPlayType('video/mp4; codecs="avc1.42E01E"') !== '';
    const supportsWebM = video.canPlayType('video/webm; codecs="vp8, vorbis"') !== '';
    const supportsMP4 = video.canPlayType('video/mp4') !== '';

    // Test hardware acceleration
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    const hasHardwareAcceleration = !!gl;

    return {
      type,
      version,
      userAgent,
      supportsH264,
      supportsWebM,
      supportsMP4,
      hasHardwareAcceleration,
    };
  };

  // Get optimal settings for each browser
  const getBrowserSettings = (browser: BrowserType) => {
    const settings = {
      preload: 'auto' as string,
      controls: false,
      muted: false,
      playsInline: true,
      style: {} as React.CSSProperties,
      attributes: {} as Record<string, string>,
    };

    switch (browser) {
      case 'firefox':
        // Firefox works well with default settings
        settings.preload = 'auto';
        settings.style = {
          transform: 'translateZ(0)',
          willChange: 'auto',
        };
        break;

      case 'chrome':
        // Chrome needs specific settings to prevent freezing
        settings.preload = 'metadata';
        settings.style = {
          transform: 'translateZ(0)',
          willChange: 'auto',
          backfaceVisibility: 'hidden',
        };
        settings.attributes = {
          'webkit-playsinline': 'true',
          'x5-playsinline': 'true',
          'x5-video-player-type': 'h5',
          'x5-video-player-fullscreen': 'false',
        };
        break;

      case 'safari':
        // Safari needs specific settings
        settings.preload = 'metadata';
        settings.style = {
          transform: 'translateZ(0)',
          willChange: 'auto',
        };
        settings.attributes = {
          'webkit-playsinline': 'true',
          'playsinline': 'true',
        };
        break;

      case 'opera':
        // Opera needs conservative settings
        settings.preload = 'none';
        settings.style = {
          transform: 'translateZ(0)',
          willChange: 'auto',
        };
        break;

      case 'edge':
        // Edge (Chromium-based) needs Chrome-like settings
        settings.preload = 'metadata';
        settings.style = {
          transform: 'translateZ(0)',
          willChange: 'auto',
        };
        break;

      case 'yandex':
        // Yandex (Chromium-based) needs Chrome-like settings
        settings.preload = 'metadata';
        settings.style = {
          transform: 'translateZ(0)',
          willChange: 'auto',
        };
        break;

      default:
        // Conservative settings for unknown browsers
        settings.preload = 'none';
        settings.style = {
          transform: 'translateZ(0)',
          willChange: 'auto',
        };
    }

    return settings;
  };

  useEffect(() => {
    const detectedBrowser = detectBrowser();
    setBrowserInfo(detectedBrowser);
    console.log('🌐 Browser detected:', detectedBrowser);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !browserInfo) return;

    console.log('🎬 Initializing video for browser:', browserInfo.type);

    const settings = getBrowserSettings(browserInfo.type);
    
    // Apply browser-specific settings
    (video as any).preload = settings.preload;
    video.controls = settings.controls;
    video.muted = settings.muted;
    video.playsInline = settings.playsInline;

    // Apply style settings
    Object.assign(video.style, settings.style);

    // Apply custom attributes
    Object.entries(settings.attributes).forEach(([key, value]) => {
      video.setAttribute(key, value);
    });

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      setIsLoading(false);
      console.log('✅ Video metadata loaded for', browserInfo.type);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const handleError = (e: Event) => {
      console.error('❌ Video error for', browserInfo.type, ':', e);
      setIsLoading(false);
      
      let errorMessage = `Video playback error in ${browserInfo.type}. `;
      
      if (browserInfo.type === 'chrome') {
        errorMessage += "Chrome may freeze with certain video formats. Try Firefox or download the video.";
      } else if (browserInfo.type === 'safari') {
        errorMessage += "Safari has limited MP4 support. Try Firefox or download the video.";
      } else if (browserInfo.type === 'opera') {
        errorMessage += "Opera has limited video support. Try Firefox or download the video.";
      } else {
        errorMessage += "This browser may not support this video format. Try Firefox or download the video.";
      }
      
      setError(errorMessage);
      onError?.(errorMessage);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
      setError(null);
      console.log('✅ Video can play in', browserInfo.type);
    };

    const handlePlay = () => {
      setIsPlaying(true);
      console.log('▶️ Video playing in', browserInfo.type);
    };

    const handlePause = () => {
      setIsPlaying(false);
      console.log('⏸️ Video paused in', browserInfo.type);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      console.log('⏹️ Video ended in', browserInfo.type);
    };

    // Add event listeners
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('error', handleError);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);

    // Set video source
    video.src = videoUrl;
    video.load();

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('error', handleError);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
    };
  }, [videoUrl, browserInfo, onError]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play().catch((err) => {
        console.error('Play error:', err);
        setError('Failed to play video. Try downloading instead.');
      });
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const newTime = parseFloat(e.target.value);
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = videoUrl;
    link.download = title || 'video';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenInNewTab = () => {
    window.open(videoUrl, '_blank');
  };

  if (error) {
    return (
      <Box
        border="2px dashed"
        borderColor="red.300"
        borderRadius="lg"
        p={6}
        textAlign="center"
        bg="red.50"
      >
        <VStack spacing={4}>
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            <Text>{error}</Text>
          </Alert>
          
          <HStack spacing={4}>
            <Button
              leftIcon={<FaDownload />}
              colorScheme="blue"
              onClick={handleDownload}
            >
              Download Video
            </Button>
            
            <Button
              leftIcon={<FaExternalLinkAlt />}
              variant="outline"
              onClick={handleOpenInNewTab}
            >
              Open in New Tab
            </Button>
          </HStack>
        </VStack>
      </Box>
    );
  }

  if (!browserInfo) {
    return (
      <Box display="flex" justifyContent="center" p={8}>
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <VStack spacing={4} align="stretch">
      <Alert status="info" borderRadius="md">
        <AlertIcon />
        <Box>
          <Text fontWeight="bold">Browser-Specific Video Player</Text>
          <Text fontSize="sm">
            Browser: {browserInfo.type} v{browserInfo.version} | 
            MP4 Support: {browserInfo.supportsMP4 ? 'Yes' : 'No'} | 
            Hardware: {browserInfo.hasHardwareAcceleration ? 'Yes' : 'No'}
          </Text>
        </Box>
      </Alert>

      <Box 
        position="relative" 
        w="100%" 
        h="400px" 
        bg="black"
        borderRadius="lg"
        overflow="hidden"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        <video
          ref={videoRef}
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'contain' as const,
            backgroundColor: '#000000',
            display: 'block',
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 1,
          }}
          poster={thumbnailUrl}
        >
          Your browser does not support the video tag.
        </video>

        {/* Loading overlay */}
        {isLoading && (
          <Box
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            bg="blackAlpha.700"
            color="white"
            px={4}
            py={2}
            borderRadius="md"
            zIndex={10}
          >
            <HStack spacing={2}>
              <Spinner size="sm" />
              <Text>Loading video...</Text>
            </HStack>
          </Box>
        )}

        {/* Custom controls */}
        {showControls && (
          <Box
            position="absolute"
            bottom={0}
            left={0}
            right={0}
            bg="blackAlpha.800"
            p={4}
            color="white"
            zIndex={10}
          >
            <VStack spacing={2}>
              {/* Progress bar */}
              <input
                type="range"
                min={0}
                max={duration || 0}
                value={currentTime}
                onChange={handleSeek}
                style={{
                  width: '100%',
                  height: '4px',
                  borderRadius: '2px',
                  background: 'rgba(255, 255, 255, 0.3)',
                  outline: 'none',
                  cursor: 'pointer',
                }}
              />

              {/* Control buttons */}
              <HStack justify="space-between" w="100%">
                <HStack spacing={2}>
                  <Button
                    size="sm"
                    variant="ghost"
                    color="white"
                    onClick={togglePlay}
                    _hover={{ bg: 'whiteAlpha.200' }}
                  >
                    {isPlaying ? <FaPause /> : <FaPlay />}
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    color="white"
                    onClick={toggleMute}
                    _hover={{ bg: 'whiteAlpha.200' }}
                  >
                    {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
                  </Button>

                  <Text fontSize="sm">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </Text>
                </HStack>

                <HStack spacing={2}>
                  <Button
                    size="sm"
                    variant="ghost"
                    color="white"
                    onClick={handleDownload}
                    _hover={{ bg: 'whiteAlpha.200' }}
                    leftIcon={<FaDownload />}
                  >
                    Download
                  </Button>
                </HStack>
              </HStack>
            </VStack>
          </Box>
        )}

        {/* Browser indicator */}
        <Box 
          position="absolute" 
          top={2} 
          right={2} 
          bg="blue.500" 
          color="white" 
          px={2} 
          py={1} 
          borderRadius="sm" 
          fontSize="xs"
          zIndex={10}
        >
          {browserInfo.type}
        </Box>
      </Box>

      <HStack spacing={2} justify="center" wrap="wrap">
        <Badge colorScheme="blue">{browserInfo.type}</Badge>
        <Badge colorScheme={isPlaying ? "green" : "gray"}>
          {isPlaying ? "Playing" : "Paused"}
        </Badge>
        <Badge colorScheme={isMuted ? "red" : "green"}>
          {isMuted ? "Muted" : "Unmuted"}
        </Badge>
        <Badge colorScheme={browserInfo.supportsMP4 ? "green" : "red"}>
          MP4: {browserInfo.supportsMP4 ? "Yes" : "No"}
        </Badge>
        <Badge colorScheme={browserInfo.hasHardwareAcceleration ? "green" : "red"}>
          HW: {browserInfo.hasHardwareAcceleration ? "Yes" : "No"}
        </Badge>
      </HStack>
    </VStack>
  );
};

export default BrowserSpecificVideoPlayer; 