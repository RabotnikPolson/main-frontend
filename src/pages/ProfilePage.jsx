import React, { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useUserProfile } from "../hooks/useUserProfile";
import { useAuth } from "../hooks/useAuth";
import http from "../shared/api/http";
import "../styles/pages/Profile.css";

function safeInitials(str) {
  if (!str) return "U";
  const s = String(str).trim();
  if (!s) return "U";
  // Берём первые буквы из 1-2 слов, либо первые 2 символа
  const parts = s.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return s.slice(0, 2).toUpperCase();
}

function isProbablyUrl(v) {
  if (!v) return true; // пусто допустимо
  try {
    const u = new URL(v);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export default function ProfilePage() {
  const { user } = useAuth();
  const username = user?.username;

  const {
    data: profile,
    isLoading,
    isError,
    error,
    saveProfile,
    saveStatus,
    saveError,
  } = useUserProfile(username);

  const [form, setForm] = useState({
    avatarUrl: "",
    bio: "",
    isPrivate: false,
  });
  const [initialForm, setInitialForm] = useState(null);

  const [avatarBroken, setAvatarBroken] = useState(false);
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const [avatarDraft, setAvatarDraft] = useState("");
  const [avatarDraftError, setAvatarDraftError] = useState("");

  const [toast, setToast] = useState(null); // {type:'ok'|'err', text:''}

  // Analytics (не критично: если упадёт — профиль всё равно работает)
  const analytics = useQuery({
    queryKey: ["analytics", "me", "summary"],
    queryFn: async () => {
      const res = await http.get("/analytics/me/summary");
      return res.data;
    },
    enabled: !!username,
    retry: 1,
  });

  useEffect(() => {
    if (!profile) return;
    const next = {
      avatarUrl: profile.avatarUrl || "",
      bio: profile.bio || "",
      isPrivate: !!profile.isPrivate,
    };
    setForm(next);
    setInitialForm(next);
    setAvatarBroken(false);
  }, [profile]);

  const displayName = useMemo(() => {
    return profile?.nickname || profile?.username || profile?.email || username || "Пользователь";
  }, [profile, username]);

  const email = useMemo(() => profile?.email || user?.email || "", [profile, user]);

  const initials = useMemo(() => safeInitials(displayName), [displayName]);

  const hasChanges = useMemo(() => {
    if (!initialForm) return false;
    return (
        (form.avatarUrl || "") !== (initialForm.avatarUrl || "") ||
        (form.bio || "") !== (initialForm.bio || "") ||
        !!form.isPrivate !== !!initialForm.isPrivate
    );
  }, [form, initialForm]);

  const avatarSrc = useMemo(() => {
    const url = (form.avatarUrl || "").trim();
    return url ? url : "";
  }, [form.avatarUrl]);

  const openAvatarModal = () => {
    setAvatarDraft(form.avatarUrl || "");
    setAvatarDraftError("");
    setAvatarModalOpen(true);
  };

  const closeAvatarModal = () => {
    setAvatarModalOpen(false);
    setAvatarDraftError("");
  };

  const applyAvatarDraft = () => {
    const v = (avatarDraft || "").trim();
    if (!isProbablyUrl(v)) {
      setAvatarDraftError("Ссылка должна начинаться с http:// или https://");
      return;
    }
    setForm((s) => ({ ...s, avatarUrl: v }));
    setAvatarBroken(false);
    setAvatarModalOpen(false);
  };

  const onSave = async () => {
    setToast(null);

    const payload = {
      avatarUrl: (form.avatarUrl || "").trim() || null,
      bio: (form.bio || "").trim() || null,
      isPrivate: !!form.isPrivate,
    };

    try {
      await saveProfile(payload);
      setInitialForm({
        avatarUrl: payload.avatarUrl || "",
        bio: payload.bio || "",
        isPrivate: payload.isPrivate,
      });
      setToast({ type: "ok", text: "Сохранено" });
      setTimeout(() => setToast(null), 1800);
    } catch (e) {
      const msg =
          e?.response?.data?.message ||
          e?.response?.data ||
          e?.message ||
          "Ошибка сохранения";
      setToast({ type: "err", text: String(msg) });
      setTimeout(() => setToast(null), 3500);
    }
  };

  if (!username) {
    return (
        <div className="container profile-page">
          <div className="profile-shell">
            <h1 className="profile-title">Профиль</h1>
            <div className="profile-card">
              <p className="profile-muted">Войдите, чтобы управлять профилем.</p>
            </div>
          </div>
        </div>
    );
  }

  if (isLoading) {
    return (
        <div className="container profile-page">
          <div className="profile-shell">
            <h1 className="profile-title">Профиль</h1>
            <div className="profile-card">
              <p className="profile-muted">Загрузка…</p>
            </div>
          </div>
        </div>
    );
  }

  if (isError) {
    const msg =
        error?.response?.data?.message ||
        error?.response?.data ||
        error?.message ||
        "Ошибка загрузки";
    return (
        <div className="container profile-page">
          <div className="profile-shell">
            <h1 className="profile-title">Профиль</h1>
            <div className="profile-card">
              <p className="profile-error">Не удалось загрузить профиль: {String(msg)}</p>
            </div>
          </div>
        </div>
    );
  }

  return (
      <div className="container profile-page">
        <div className="profile-shell">
          <div className="profile-header">
            <h1 className="profile-title">Профиль</h1>

            <div className="profile-header-actions">
              {toast ? (
                  <div className={`profile-toast ${toast.type === "ok" ? "ok" : "err"}`}>
                    {toast.text}
                  </div>
              ) : null}

              <button
                  className="profile-btn primary"
                  onClick={onSave}
                  disabled={!hasChanges || saveStatus === "loading"}
                  title={!hasChanges ? "Нет изменений" : "Сохранить"}
              >
                {saveStatus === "loading" ? "Сохранение…" : "Сохранить"}
              </button>
            </div>
          </div>

          <div className="profile-grid">
            {/* LEFT: main card */}
            <div className="profile-card">
              <div className="profile-main">
                <div className="profile-avatar">
                  {avatarSrc && !avatarBroken ? (
                      <img
                          src={avatarSrc}
                          alt="Avatar"
                          onError={() => setAvatarBroken(true)}
                      />
                  ) : (
                      <div className="profile-avatar-fallback" aria-label="Avatar fallback">
                        {initials}
                      </div>
                  )}
                </div>

                <div className="profile-main-info">
                  <div className="profile-name">{displayName}</div>
                  {email ? <div className="profile-sub">{email}</div> : null}

                  <div className="profile-main-actions">
                    <button className="profile-btn" onClick={openAvatarModal}>
                      Изменить фото
                    </button>

                    {hasChanges ? (
                        <span className="profile-badge">Есть несохранённые изменения</span>
                    ) : (
                        <span className="profile-badge subtle">Всё сохранено</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="profile-section">
                <div className="profile-section-title">О себе</div>
                <textarea
                    className="profile-textarea"
                    value={form.bio}
                    onChange={(e) => setForm((s) => ({ ...s, bio: e.target.value }))}
                    placeholder="Напишите пару слов…"
                    maxLength={350}
                    rows={4}
                />
                <div className="profile-hint">
                  {String(form.bio || "").length}/350
                </div>
              </div>

              <div className="profile-section">
                <div className="profile-section-title">Приватность</div>

                <label className="profile-toggle">
                  <input
                      type="checkbox"
                      checked={!!form.isPrivate}
                      onChange={(e) =>
                          setForm((s) => ({ ...s, isPrivate: e.target.checked }))
                      }
                  />
                  <span className="profile-toggle-ui" />
                  <span className="profile-toggle-text">Приватный профиль</span>
                </label>

                <div className="profile-hint">
                  Если включено — другие пользователи не смогут видеть вашу публичную активность.
                </div>
              </div>

              {saveError ? (
                  <div className="profile-inline-error">
                    {String(
                        saveError?.response?.data?.message ||
                        saveError?.response?.data ||
                        saveError?.message ||
                        "Ошибка сохранения"
                    )}
                  </div>
              ) : null}
            </div>

            {/* RIGHT: side cards */}
            <div className="profile-side">
              <div className="profile-card">
                <div className="profile-section-title">Моя активность</div>

                {analytics.isLoading ? (
                    <p className="profile-muted">Загрузка…</p>
                ) : analytics.isError ? (
                    <p className="profile-muted">Пока нет данных.</p>
                ) : (
                    <div className="profile-stats">
                      <div className="profile-stat">
                        <div className="profile-stat-label">Время просмотра</div>
                        <div className="profile-stat-value">
                          {formatSeconds(analytics.data?.totalSeconds)}
                        </div>
                      </div>

                      <div className="profile-stat">
                        <div className="profile-stat-label">Топ жанры</div>
                        <div className="profile-chips">
                          {(analytics.data?.topGenres || []).slice(0, 6).map((g) => (
                              <span key={g.genre} className="profile-chip">
                          {g.genre} · {g.count}
                        </span>
                          ))}
                          {(!analytics.data?.topGenres || analytics.data.topGenres.length === 0) ? (
                              <span className="profile-muted">Нет жанров</span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                )}
              </div>

              <div className="profile-card">
                <div className="profile-section-title">Фото профиля</div>
                <p className="profile-muted">
                  Сейчас хранится как ссылка на изображение. Если захотите “загрузку файла” —
                  это уже отдельная задача на бэкенде.
                </p>

                <button className="profile-btn" onClick={openAvatarModal}>
                  Поменять фото
                </button>
              </div>
            </div>
          </div>

          {/* Avatar modal */}
          {avatarModalOpen ? (
              <div className="profile-modal-backdrop" onMouseDown={closeAvatarModal}>
                <div className="profile-modal" onMouseDown={(e) => e.stopPropagation()}>
                  <div className="profile-modal-head">
                    <div className="profile-modal-title">Изменить фото</div>
                    <button className="profile-btn icon" onClick={closeAvatarModal} aria-label="Close">
                      ✕
                    </button>
                  </div>

                  <div className="profile-modal-body">
                    <div className="profile-modal-preview">
                      {avatarDraft && isProbablyUrl(avatarDraft) ? (
                          <img
                              src={avatarDraft}
                              alt="Preview"
                              onError={() => {}}
                          />
                      ) : (
                          <div className="profile-modal-preview-fallback">{initials}</div>
                      )}
                    </div>

                    <div className="profile-modal-fields">
                      <label className="profile-label">
                        Ссылка на изображение
                        <input
                            className="profile-input"
                            value={avatarDraft}
                            onChange={(e) => {
                              setAvatarDraft(e.target.value);
                              setAvatarDraftError("");
                            }}
                            placeholder="https://..."
                        />
                      </label>

                      {avatarDraftError ? (
                          <div className="profile-inline-error">{avatarDraftError}</div>
                      ) : null}

                      <div className="profile-hint">
                        Поддерживаются обычные ссылки (http/https). Лучше брать прямую ссылку на картинку.
                      </div>
                    </div>
                  </div>

                  <div className="profile-modal-actions">
                    <button className="profile-btn" onClick={closeAvatarModal}>
                      Отмена
                    </button>
                    <button className="profile-btn primary" onClick={applyAvatarDraft}>
                      Применить
                    </button>
                  </div>
                </div>
              </div>
          ) : null}
        </div>
      </div>
  );
}

function formatSeconds(total) {
  const s = Number(total || 0);
  if (!isFinite(s) || s <= 0) return "0 мин";

  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);

  if (h <= 0) return `${m} мин`;
  if (m <= 0) return `${h} ч`;
  return `${h} ч ${m} мин`;
}
