import { useQuery } from "@tanstack/react-query";
import { listRightRail } from "../shared/api/recommendations";

export const useRightRail = (imdbId, limit = 15) =>
  useQuery({
    queryKey: ["rightRail", imdbId, limit],
    queryFn: () => listRightRail(imdbId, limit),
  });
