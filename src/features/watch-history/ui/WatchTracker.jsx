import { useEffect, useRef } from "react";
import api from "@/shared/api/http-client";

export default function WatchTracker({ url, movieId }) {
  const videoRef = useRef(null);
  const sessionIdRef = useRef(crypto.randomUUID());
  const lastSentTimeRef = useRef(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !url) return;

    let hls;
    let disposed = false;

    const attachPlayer = async () => {
      if (url.includes(".m3u8")) {
        const { default: Hls } = await import("hls.js/light");
        if (disposed) {
          return;
        }

        if (Hls.isSupported()) {
          hls = new Hls();
          hls.loadSource(url);
          hls.attachMedia(video);
          return;
        }
      }

      video.src = url;
    };

    attachPlayer().catch((err) => {
      console.error(err);
      video.src = url;
    });

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
      disposed = true;
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
