import { useEffect, useRef } from "react";
import Hls from "hls.js";
import api from "@/shared/api/http-client";

export default function WatchTracker({ url, movieId }) {
  const videoRef = useRef(null);
  const sessionIdRef = useRef(crypto.randomUUID());
  const lastSentTimeRef = useRef(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !url) return;

    let hls;

    if (Hls.isSupported() && url.includes(".m3u8")) {
      hls = new Hls();
      hls.loadSource(url);
      hls.attachMedia(video);
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = url;
    } else {
      video.src = url;
    }

    const interval = setInterval(() => {
      if (video.paused || video.ended) return;

      const currentPos = Math.floor(video.currentTime);
      const delta = currentPos - lastSentTimeRef.current;

      if (delta > 0 && delta <= 30) {
        api.post("/watch-history/beat", {
          movieId,
          sessionId: sessionIdRef.current,
          currentPositionSec: currentPos,
          deltaSec: delta
        }).catch(err => console.error(err));
      }

      lastSentTimeRef.current = currentPos;

    }, 5000);

    return () => {
      clearInterval(interval);
      if (hls) {
        hls.destroy();
      }
    };
  }, [url, movieId]);

  return (
    <video
      ref={videoRef}
      controls
      className="watch-embed-frame"
      style={{ width: "100%", background: "#000", aspectRatio: "16/9" }}
    />
  );
}
