import type { CSSProperties } from "react";
import { videoTransitionName } from "../../scripts/transitions";

const GridSection = ({ videos }: { videos: Video[] }) => {
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const captionElement = event.currentTarget.querySelector('.Caption');
    if (captionElement) {
      captionElement.classList.toggle('hide');
    }
  };

  return (
    <div className="GridSection py-1">
      <h3 className="text-center">ESPLORA</h3>
      <p className=""></p>
      <div className="grid grid-cols-2 auto-rows-[clamp(9rem,28vw,22rem)] gap-4 pt-2 pb-8">
        {videos.map((video, index) => (
          <div
            key={video.source}
            className={`lazyload rounded-xl ${(index % 4 === 0 || index % 6 === 0) ? 'row-span-2' : ''} ${(index % 6 === 0 && index != 0) ? 'col-span-2' : ''}`}
            onClick={handleClick}
            style={{ viewTransitionName: videoTransitionName(video.link), viewTransitionClass: 'video-morph' } as CSSProperties}>
            <video className="cursor-hover rounded-xl" autoPlay muted loop playsInline preload="metadata">
              <source src={video.source} type="video/mp4" />
              Sorry, your browser doesn't support videos.
            </video>
            <div className="Caption hide transition-opacity duration-500 absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center bg-black/75 p-2">
              <p className="text-center opacity-100">{video.title}</p>
              <a className="Link" href={video.link}>
                <img className="Arrow" src="/arrow.svg" width="32px"></img>
              </a>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center"></div>
    </div>
  );
};

export default GridSection;
