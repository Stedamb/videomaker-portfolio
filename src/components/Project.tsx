import { useState, type CSSProperties } from 'react';
import { videoTransitionName } from '../scripts/transitions';

const Project = ({ video }: { video: Video }) => {
    const [fullscreen, setFullscreen] = useState<boolean>(false);

    const handleVideoClick = () => {
        setFullscreen(!fullscreen);
    };

    return (
        <div className="container-xl">
            <div className={`cursor-hover cursor-fullscreen  ${fullscreen
                ? 'fixed top-0 left-0 right-0 bottom-0 w-screen h-screen bg-background z-50 flex items-center justify-center container-xl'
                : 'h-[50vh] lg:h-[75vh] lazyload'
                }`}
                onClick={fullscreen ? undefined : handleVideoClick}
                style={{ viewTransitionName: videoTransitionName(video.link), viewTransitionClass: 'video-morph' } as CSSProperties}
            >
                <video className='rounded-xl w-full max-h-screen' controls={fullscreen} autoPlay muted loop playsInline preload="metadata">
                    <source src={video.source} type="video/mp4" />
                    Sorry, your browser doesn't support videos.
                </video>
                <div
                    className={`${fullscreen ? 'cursor-hover fixed top-10 right-10 z-50' : 'hidden'}`}
                    onClick={handleVideoClick}>
                    Chiudi
                </div>
            </div>
            <div className="container-sm text-center flex flex-col items-center">
                <p className="pt-8 pb-8">Un video-diario dei miei viaggi, avventure e qualche esperimento di videomaking. </p>
                <a className="Link mb-8" href="/">Guarda su YouTube
                    <img className="mx-auto" src="/youtube.svg" width="32px"></img>
                </a>
                <a className="Link" href="/">Torna alla Home
                    <img className="rotate-180 mx-auto" src="/arrow.svg" width="32px"></img>
                </a>
            </div>
        </div>
    );
};

export default Project;
