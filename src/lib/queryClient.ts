import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      // 기본은 재시도 없이 1회만 호출. 재시도가 필요한 쿼리는 개별 useQuery 에서 retry 를 override.
      retry: false,
    },
  },
});
