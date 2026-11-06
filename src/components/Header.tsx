import { useState, useRef } from "react";
import { header } from "../data/header";

const Header = () => {
    const [isPlaying, setIsPlaying] = useState(true);
    const [isMuted, setIsMuted] = useState(true);
    const vidRef = useRef<HTMLVideoElement | null>(null);

    const playPauseVideo = () => {
        if (vidRef.current) {
            isPlaying ? vidRef.current.pause() : vidRef.current.play();
            setIsPlaying(!isPlaying);
        }
    };

    const muteUnmuteVideo = () => {
        if (vidRef.current) {
            vidRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const handleVideoClick = () => {
        playPauseVideo();
    };

    const toggleFullscreen = () => {
        if (vidRef.current) {
            if (!document.fullscreenElement) {
                // Enter fullscreen
                if (vidRef.current.requestFullscreen) {
                    vidRef.current.requestFullscreen();
                }
            } else {
                // Exit fullscreen
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                }
            }
        }
    };

    return (
        <div className="container-xl lazyload aspect-[1876/900]">
            <video ref={vidRef}
                className="cursor-hover play-pause rounded-xl"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                onClick={handleVideoClick}>
                <source src={header.source} type="video/mp4" />
                Sorry, your browser doesn't support videos.
            </video>
            <div className="cursor-hover absolute bottom-3 right-10 lg:right-14" onClick={muteUnmuteVideo}>
                <img src="/audio.svg" width="40px" className={isMuted ? 'hidden' : 'max-lg:w-5'} />
                <img src="/mute.svg" width="40px" className={isMuted ? 'max-lg:w-5' : 'hidden'} />
            </div>
            <div className="cursor-hover absolute bottom-3.5 lg:bottom-4 right-4" onClick={toggleFullscreen}>
                <img src="/fullscreen.svg" width="32px" className="max-lg:w-4" />
            </div>
        </div>
    );
};

export default Header;
