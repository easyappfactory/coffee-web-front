import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSlotDetail, postComment } from "@/lib/api";

export function useComments(slotId: string) {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["slot", slotId],
    queryFn: () => getSlotDetail(slotId),
    enabled: !!slotId,
    select: (d) => d.comments,
  });

  const mutation = useMutation({
    mutationFn: (content: string) => postComment(slotId, content),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["slot", slotId] }),
  });

  return { comments: data ?? [], postComment: mutation.mutateAsync, isPending: mutation.isPending };
}
