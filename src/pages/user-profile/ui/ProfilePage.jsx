import React, { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/features/auth";
import { useUserProfile } from "@/features/user-profile";
import http from "@/shared/api/http-client";
import "@/shared/styles/pages/Profile.css";

function safeInitials(value) {
  if (!value) {
    return "U";
  }

  const normalized = String(value).trim();
  if (!normalized) {
    return "U";
  }

  const parts = normalized.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }

  return normalized.slice(0, 2).toUpperCase();
}

function isProbablyUrl(value) {
  if (!value) {
    return true;
  }

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function formatSeconds(total) {
  const seconds = Number(total || 0);
  if (!isFinite(seconds) || seconds <= 0) {
    return "0 РјРёРЅ";
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours <= 0) {
    return `${minutes} РјРёРЅ`;
  }

  if (minutes <= 0) {
    return `${hours} С‡`;
  }

  return `${hours} С‡ ${minutes} РјРёРЅ`;
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
  const [toast, setToast] = useState(null);

  const analytics = useQuery({
    queryKey: ["analytics", "me", "summary"],
    queryFn: async () => {
      const response = await http.get("/analytics/me/summary");
      return response.data;
    },
    enabled: !!username,
    retry: 1,
  });

  useEffect(() => {
    if (!profile) {
      return;
    }

    const next = {
      avatarUrl: profile.avatarUrl || "",
      bio: profile.bio || "",
      isPrivate: !!profile.isPrivate,
    };

    setForm(next);
    setInitialForm(next);
    setAvatarBroken(false);
  }, [profile]);

  const displayName = useMemo(
    () => profile?.nickname || profile?.username || profile?.email || username || "РџРѕР»СЊР·РѕРІР°С‚РµР»СЊ",
    [profile, username]
  );
  const email = useMemo(() => profile?.email || user?.email || "", [profile, user]);
  const initials = useMemo(() => safeInitials(displayName), [displayName]);
  const hasChanges = useMemo(() => {
    if (!initialForm) {
      return false;
    }

    return (
      (form.avatarUrl || "") !== (initialForm.avatarUrl || "") ||
      (form.bio || "") !== (initialForm.bio || "") ||
      !!form.isPrivate !== !!initialForm.isPrivate
    );
  }, [form, initialForm]);

  const avatarSrc = useMemo(() => (form.avatarUrl || "").trim(), [form.avatarUrl]);

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
    const nextValue = (avatarDraft || "").trim();
    if (!isProbablyUrl(nextValue)) {
      setAvatarDraftError("РЎСЃС‹Р»РєР° РґРѕР»Р¶РЅР° РЅР°С‡РёРЅР°С‚СЊСЃСЏ СЃ http:// РёР»Рё https://");
      return;
    }

    setForm((state) => ({ ...state, avatarUrl: nextValue }));
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
      setToast({ type: "ok", text: "РЎРѕС…СЂР°РЅРµРЅРѕ" });
      setTimeout(() => setToast(null), 1800);
    } catch (saveProfileError) {
      const msg =
        saveProfileError?.response?.data?.message ||
        saveProfileError?.response?.data ||
        saveProfileError?.message ||
        "РћС€РёР±РєР° СЃРѕС…СЂР°РЅРµРЅРёСЏ";
      setToast({ type: "err", text: String(msg) });
      setTimeout(() => setToast(null), 3500);
    }
  };

  if (!username) {
    return (
      <div className="container profile-page">
        <div className="profile-shell">
          <h1 className="profile-title">РџСЂРѕС„РёР»СЊ</h1>
          <div className="profile-card">
            <p className="profile-muted">Р’РѕР№РґРёС‚Рµ, С‡С‚РѕР±С‹ СѓРїСЂР°РІР»СЏС‚СЊ РїСЂРѕС„РёР»РµРј.</p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container profile-page">
        <div className="profile-shell">
          <h1 className="profile-title">РџСЂРѕС„РёР»СЊ</h1>
          <div className="profile-card">
            <p className="profile-muted">Р—Р°РіСЂСѓР·РєР°...</p>
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
      "РћС€РёР±РєР° Р·Р°РіСЂСѓР·РєРё";

    return (
      <div className="container profile-page">
        <div className="profile-shell">
          <h1 className="profile-title">РџСЂРѕС„РёР»СЊ</h1>
          <div className="profile-card">
            <p className="profile-error">РќРµ СѓРґР°Р»РѕСЃСЊ Р·Р°РіСЂСѓР·РёС‚СЊ РїСЂРѕС„РёР»СЊ: {String(msg)}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container profile-page">
      <div className="profile-shell">
        <div className="profile-header">
          <h1 className="profile-title">РџСЂРѕС„РёР»СЊ</h1>

          <div className="profile-header-actions">
            {toast ? (
              <div className={`profile-toast ${toast.type === "ok" ? "ok" : "err"}`}>
                {toast.text}
              </div>
            ) : null}

            <button
              className="profile-btn primary"
              onClick={onSave}
              disabled={!hasChanges || saveStatus === "pending"}
              title={!hasChanges ? "РќРµС‚ РёР·РјРµРЅРµРЅРёР№" : "РЎРѕС…СЂР°РЅРёС‚СЊ"}
            >
              {saveStatus === "pending" ? "РЎРѕС…СЂР°РЅРµРЅРёРµ..." : "РЎРѕС…СЂР°РЅРёС‚СЊ"}
            </button>
          </div>
        </div>

        <div className="profile-grid">
          <div className="profile-card">
            <div className="profile-main">
              <div className="profile-avatar">
                {avatarSrc && !avatarBroken ? (
                  <img src={avatarSrc} alt="Avatar" onError={() => setAvatarBroken(true)} />
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
                    РР·РјРµРЅРёС‚СЊ С„РѕС‚Рѕ
                  </button>

                  {hasChanges ? (
                    <span className="profile-badge">Р•СЃС‚СЊ РЅРµСЃРѕС…СЂР°РЅРµРЅРЅС‹Рµ РёР·РјРµРЅРµРЅРёСЏ</span>
                  ) : (
                    <span className="profile-badge subtle">Р’СЃС‘ СЃРѕС…СЂР°РЅРµРЅРѕ</span>
                  )}
                </div>
              </div>
            </div>

            <div className="profile-section">
              <div className="profile-section-title">Рћ СЃРµР±Рµ</div>
              <textarea
                className="profile-textarea"
                value={form.bio}
                onChange={(event) => setForm((state) => ({ ...state, bio: event.target.value }))}
                placeholder="РќР°РїРёС€РёС‚Рµ РїР°СЂСѓ СЃР»РѕРІ..."
                maxLength={350}
                rows={4}
              />
              <div className="profile-hint">{String(form.bio || "").length}/350</div>
            </div>

            <div className="profile-section">
              <div className="profile-section-title">РџСЂРёРІР°С‚РЅРѕСЃС‚СЊ</div>

              <label className="profile-toggle">
                <input
                  type="checkbox"
                  checked={!!form.isPrivate}
                  onChange={(event) =>
                    setForm((state) => ({ ...state, isPrivate: event.target.checked }))
                  }
                />
                <span className="profile-toggle-ui" />
                <span className="profile-toggle-text">РџСЂРёРІР°С‚РЅС‹Р№ РїСЂРѕС„РёР»СЊ</span>
              </label>

              <div className="profile-hint">
                Р•СЃР»Рё РІРєР»СЋС‡РµРЅРѕ, РґСЂСѓРіРёРµ РїРѕР»СЊР·РѕРІР°С‚РµР»Рё РЅРµ СѓРІРёРґСЏС‚ РІР°С€Сѓ Р°РєС‚РёРІРЅРѕСЃС‚СЊ.
              </div>
            </div>

            {saveError ? (
              <div className="profile-inline-error">
                {String(
                  saveError?.response?.data?.message ||
                    saveError?.response?.data ||
                    saveError?.message ||
                    "РћС€РёР±РєР° СЃРѕС…СЂР°РЅРµРЅРёСЏ"
                )}
              </div>
            ) : null}
          </div>

          <div className="profile-side">
            <div className="profile-card">
              <div className="profile-section-title">РђРєС‚РёРІРЅРѕСЃС‚СЊ</div>
              <button className="profile-btn" onClick={() => (window.location.href = `/activity/${username}`)}>
                РџРѕСЃРјРѕС‚СЂРµС‚СЊ РЅРµРґР°РІРЅРёРµ Р°РєС‚РёРІРЅРѕСЃС‚Рё
              </button>
            </div>

            <div className="profile-card">
              <div className="profile-section-title">РњРѕСЏ Р°РєС‚РёРІРЅРѕСЃС‚СЊ</div>

              {analytics.isLoading ? (
                <p className="profile-muted">Р—Р°РіСЂСѓР·РєР°...</p>
              ) : analytics.isError ? (
                <p className="profile-muted">РџРѕРєР° РЅРµС‚ РґР°РЅРЅС‹С….</p>
              ) : (
                <div className="profile-stats">
                  <div className="profile-stat">
                    <div className="profile-stat-label">Р’СЂРµРјСЏ РїСЂРѕСЃРјРѕС‚СЂР°</div>
                    <div className="profile-stat-value">
                      {formatSeconds(analytics.data?.totalSeconds)}
                    </div>
                  </div>

                  <div className="profile-stat">
                    <div className="profile-stat-label">РўРѕРї Р¶Р°РЅСЂС‹</div>
                    <div className="profile-chips">
                      {(analytics.data?.topGenres || []).slice(0, 6).map((genre) => (
                        <span key={genre.genre} className="profile-chip">
                          {genre.genre} · {genre.count}
                        </span>
                      ))}
                      {(!analytics.data?.topGenres || analytics.data.topGenres.length === 0) && (
                        <span className="profile-muted">РќРµС‚ Р¶Р°РЅСЂРѕРІ</span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="profile-card">
              <div className="profile-section-title">Р¤РѕС‚Рѕ РїСЂРѕС„РёР»СЏ</div>
              <p className="profile-muted">
                РЎРµР№С‡Р°СЃ С„РѕС‚Рѕ С…СЂР°РЅРёС‚СЃСЏ РєР°Рє СЃСЃС‹Р»РєР°. Р•СЃР»Рё РЅСѓР¶РЅР° Р·Р°РіСЂСѓР·РєР° С„Р°Р№Р»РѕРІ, СЌС‚Рѕ С‚СЂРµР±СѓРµС‚ РѕС‚РґРµР»СЊРЅРѕР№ Р·Р°РґР°С‡Рё РЅР° Р±СЌРєРµРЅРґРµ.
              </p>
              <button className="profile-btn" onClick={openAvatarModal}>
                РџРѕРјРµРЅСЏС‚СЊ С„РѕС‚Рѕ
              </button>
            </div>
          </div>
        </div>

        {avatarModalOpen ? (
          <div className="profile-modal-backdrop" onMouseDown={closeAvatarModal}>
            <div className="profile-modal" onMouseDown={(event) => event.stopPropagation()}>
              <div className="profile-modal-head">
                <div className="profile-modal-title">РР·РјРµРЅРёС‚СЊ С„РѕС‚Рѕ</div>
                <button className="profile-btn icon" onClick={closeAvatarModal} aria-label="Close">
                  x
                </button>
              </div>

              <div className="profile-modal-body">
                <div className="profile-modal-preview">
                  {avatarDraft && isProbablyUrl(avatarDraft) ? (
                    <img src={avatarDraft} alt="Preview" />
                  ) : (
                    <div className="profile-modal-preview-fallback">{initials}</div>
                  )}
                </div>

                <div className="profile-modal-fields">
                  <label className="profile-label">
                    РЎСЃС‹Р»РєР° РЅР° РёР·РѕР±СЂР°Р¶РµРЅРёРµ
                    <input
                      className="profile-input"
                      value={avatarDraft}
                      onChange={(event) => {
                        setAvatarDraft(event.target.value);
                        setAvatarDraftError("");
                      }}
                      placeholder="https://..."
                    />
                  </label>

                  {avatarDraftError ? (
                    <div className="profile-inline-error">{avatarDraftError}</div>
                  ) : null}

                  <div className="profile-hint">
                    РџРѕРґРґРµСЂР¶РёРІР°СЋС‚СЃСЏ РѕР±С‹С‡РЅС‹Рµ http/https СЃСЃС‹Р»РєРё.
                  </div>
                </div>
              </div>

              <div className="profile-modal-actions">
                <button className="profile-btn" onClick={closeAvatarModal}>
                  РћС‚РјРµРЅР°
                </button>
                <button className="profile-btn primary" onClick={applyAvatarDraft}>
                  РџСЂРёРјРµРЅРёС‚СЊ
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
