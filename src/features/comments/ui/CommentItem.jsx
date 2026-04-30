import { useState } from "react";

export default function CommentItem({
                                        node,
                                        onReply,
                                        onDelete,
                                        onReact,
                                        isReply = false,
                                    }) {
    const [replyText, setReplyText] = useState("");
    const [replying, setReplying] = useState(false);

    return (
        <div className={`comment ${isReply ? "reply" : ""}`}>
            <div className="comment-avatar">
                {node.authorAvatarUrl ? (
                    <img src={node.authorAvatarUrl} alt="" />
                ) : (
                    <div className="avatar-fallback">
                        {node.authorUsername?.[0]?.toUpperCase() ?? "?"}
                    </div>
                )}
            </div>

            <div className="comment-body">
                <div className="comment-meta">
                    <strong>{node.authorUsername ?? "Удалённый пользователь"}</strong>
                    <span>{new Date(node.createdAt).toLocaleString()}</span>
                </div>

                <div className="comment-text">{node.content}</div>

                <div className="comment-actions">
                    <button onClick={() => onReact("👍")}>
                        👍 {node.totalReactions || ""}
                    </button>

                    {!isReply && onReply && (
                        <button onClick={() => setReplying(!replying)}>Ответить</button>
                    )}

                    <button onClick={onDelete}>Удалить</button>
                </div>

                {replying && (
                    <div className="reply-form">
            <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Ответить…"
            />
                        <button
                            onClick={() => {
                                onReply(replyText);
                                setReplyText("");
                                setReplying(false);
                            }}
                        >
                            Отправить
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
