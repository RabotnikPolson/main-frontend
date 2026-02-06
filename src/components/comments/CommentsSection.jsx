import { useState } from "react";
import CommentItem from "./CommentItem";
import {
    useRootComments,
    useReplies,
    useCommentCount,
    useCommentMutations,
} from "../../hooks/useComments";

export default function CommentsSection({ movieId }) {
    const [order, setOrder] = useState("new");
    const [text, setText] = useState("");

    const { data: count } = useCommentCount(movieId);
    const { data, isLoading } = useRootComments({ movieId, order });
    const mutations = useCommentMutations(movieId);

    const comments = data?.content ?? [];

    const submitRoot = () => {
        if (!text.trim()) return;
        mutations.create.mutate({
            movieId,
            content: text,
            parentId: null,
        });
        setText("");
    };

    return (
        <section className="comments-section">
            <div className="comments-header">
                <h3>
                    Комментарии{" "}
                    {count && <span>({count.totalCount})</span>}
                </h3>

                <select value={order} onChange={(e) => setOrder(e.target.value)}>
                    <option value="top">Популярные</option>
                    <option value="new">Сначала новые</option>
                    <option value="old">Сначала старые</option>
                </select>
            </div>

            <div className="comment-form">
        <textarea
            placeholder="Написать комментарий…"
            value={text}
            onChange={(e) => setText(e.target.value)}
        />
                <button onClick={submitRoot}>Отправить</button>
            </div>

            {isLoading && <p>Загрузка…</p>}

            {comments.map((c) => (
                <CommentThread
                    key={c.id}
                    comment={c}
                    movieId={movieId}
                    mutations={mutations}
                />
            ))}
        </section>
    );
}

function CommentThread({ comment, movieId, mutations }) {
    const [open, setOpen] = useState(false);
    const { data } = useReplies(open ? comment.id : null);

    return (
        <div className="comment-thread">
            <CommentItem
                node={comment}
                onReply={(content) =>
                    mutations.create.mutate({
                        movieId,
                        content,
                        parentId: comment.id,
                    })
                }
                onDelete={() => mutations.remove.mutate(comment.id)}
                onReact={(emoji) =>
                    mutations.react.mutate({ id: comment.id, emoji })
                }
            />

            {comment.repliesCount > 0 && !open && (
                <button className="show-replies" onClick={() => setOpen(true)}>
                    Показать ответы ({comment.repliesCount})
                </button>
            )}

            {open &&
                data?.replies?.map((r) => (
                    <CommentItem
                        key={r.id}
                        node={r}
                        isReply
                        onDelete={() => mutations.remove.mutate(r.id)}
                        onReact={(emoji) =>
                            mutations.react.mutate({ id: r.id, emoji })
                        }
                    />
                ))}
        </div>
    );
}
