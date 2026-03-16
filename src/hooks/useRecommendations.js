import { useQuery } from "@tanstack/react-query";
import { listRightRail, getSmartFeed } from "../shared/api/recommendations";

export const useRightRail = (movieId, limit = 15) =>
  useQuery({
    queryKey: ["rightRail", movieId, limit],
    queryFn: () => listRightRail(movieId, limit),
    enabled: !!movieId,
  });

export const useSmartFeed = () =>
  useQuery({
    queryKey: ["smartFeed"],
    queryFn: () => getSmartFeed(),
  });
