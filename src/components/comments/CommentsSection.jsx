// src/components/Comments/CommentsSection.jsx
import { useState } from "react";
import CommentItem from "./CommentItem";
import {
  useRootComments,
  useReplies,
  useCommentMutations,
} from "../../hooks/useComments";

function Replies({ commentId }) {
  const { data, isLoading } = useReplies(commentId);
  if (isLoading) return <div style={{ color: "#8a8f98" }}>Загрузка…</div>;
  if (!data || data.items?.length === 0) return null;

  return (
    <div style={{ borderLeft: "2px solid #2a2f3a", marginLeft: 12, paddingLeft: 12 }}>
      {data.items.map((n) => (
        <CommentItem key={n.id} node={n} />
      ))}
    </div>
  );
}

export default function CommentsSection({ imdbId }) {
  const [sort, setSort] = useState("top");
  const [page, setPage] = useState(0);

  const { data, isLoading } = useRootComments(imdbId, page, 20, sort);
  const { create, update, remove, react } = useCommentMutations(imdbId);

  const reply = (parentId, text) =>
    create.mutate({ imdbId, body: text, parentId });

  const edit = (id, text) =>
    update.mutate({ id, payload: { body: text } });

  const del = (id) => remove.mutate(id);

  const reactFn = (id, reaction) =>
    react.mutate({ id, reaction });

  return (
    <section>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h3>Комментарии</h3>
        <select
          value={sort}
          onChange={(e) => {
            setSort(e.target.value);
            setPage(0);
          }}
        >
          <option value="top">Топ</option>
          <option value="new">Новые</option>
        </select>
      </div>

      <div style={{ marginBottom: 12 }}>
        <textarea id="newComment" rows={3} style={{ width: "100%" }} />
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 6 }}>
          <button
            onClick={() => {
              const el = document.getElementById("newComment");
              const value = el.value.trim();
              if (value)
                create.mutate(
                  { imdbId, body: value },
                  { onSuccess: () => (el.value = "") }
                );
            }}
          >
            Отправить
          </button>
        </div>
      </div>

      {isLoading && <div style={{ color: "#8a8f98" }}>Загрузка…</div>}

      {!isLoading && data?.items?.length === 0 && (
        <div style={{ color: "#8a8f98" }}>Комментариев пока нет</div>
      )}

      {data?.items?.map((n) => (
        <CommentItem
          key={n.id}
          node={n}
          onReply={reply}
          onEdit={edit}
          onDelete={del}
          onReact={reactFn}
        >
          <Replies commentId={n.id} />
        </CommentItem>
      ))}

      {data?.hasMore && (
        <button onClick={() => setPage((p) => p + 1)}>Загрузить ещё</button>
      )}
    </section>
  );
}
