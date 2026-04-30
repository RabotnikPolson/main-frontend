import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth";
import { useUserSettings } from "@/features/user-profile";
import { useTheme } from "@/shared/hooks";
import "@/shared/styles/pages/Settings.css";

export default function SettingsPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const username = user?.username || localStorage.getItem("username") || "";
  const userId = username || "user1";

  const {
    data: settingsResp,
    isLoading,
    isError,
    save: saveSettings,
    saveStatus,
  } = useUserSettings(username);

  const initial = useMemo(
    () => ({
      theme,
      language: "ru",
      region: "KZ",
      newsletter: false,
      ...(settingsResp?.data || {}),
    }),
    [settingsResp, theme]
  );

  const [settings, setSettings] = useState(initial);

  useEffect(() => setSettings(initial), [initial]);

  const handleSave = async () => {
    try {
      await saveSettings(settings);
      setTheme(settings.theme);
    } catch {}
  };

  const handleLogout = () => {
    logout?.();
    ["favorites_", "profile_", "history_"].forEach((prefix) =>
      localStorage.removeItem(`${prefix}${userId}`)
    );
    navigate("/login");
  };

  return (
    <div className="settings-page">
      {isLoading && <div className="loading">Р—Р°РіСЂСѓР·РєР°...</div>}
      {isError && <div className="error">РћС€РёР±РєР° Р·Р°РіСЂСѓР·РєРё РЅР°СЃС‚СЂРѕРµРє</div>}

      <div className="settings-container">
        <div className="settings-section">
          <h2>РќР°СЃС‚СЂРѕР№РєРё РїСЂРѕСЃРјРѕС‚СЂР°</h2>

          <div className="settings-grid">
            <Link to="/history" className="setting-tile">
              рџ“њ РСЃС‚РѕСЂРёСЏ РїСЂРѕСЃРјРѕС‚СЂРѕРІ
            </Link>
            <Link to="/favorites" className="setting-tile">
              в­ђ РР·Р±СЂР°РЅРЅС‹Рµ
            </Link>

            <div className="setting-row">
              <label className="setting-label">РўРµРјР°</label>
              <select
                className="setting-input"
                value={settings.theme}
                onChange={(event) => {
                  const value = event.target.value;
                  setSettings((state) => ({ ...state, theme: value }));
                  setTheme(value);
                }}
              >
                <option value="dark">РўС‘РјРЅР°СЏ</option>
                <option value="light">РЎРІРµС‚Р»Р°СЏ</option>
              </select>
            </div>

            <div className="setting-row">
              <label className="setting-label">РЇР·С‹Рє</label>
              <select
                className="setting-input"
                value={settings.language}
                onChange={(event) =>
                  setSettings((state) => ({ ...state, language: event.target.value }))
                }
              >
                <option value="ru">Р СѓСЃСЃРєРёР№</option>
                <option value="kk">Қазақша</option>
                <option value="en">English</option>
              </select>
            </div>

            <div className="setting-row">
              <label className="setting-label">Р РµРіРёРѕРЅ</label>
              <input
                className="setting-input"
                value={settings.region}
                onChange={(event) =>
                  setSettings((state) => ({ ...state, region: event.target.value }))
                }
              />
            </div>

            <div className="setting-row">
              <label className="checkbox">
                <input
                  type="checkbox"
                  checked={!!settings.newsletter}
                  onChange={(event) =>
                    setSettings((state) => ({ ...state, newsletter: event.target.checked }))
                  }
                />
                РџРѕРґРїРёСЃРєР° РЅР° СЂР°СЃСЃС‹Р»РєСѓ
              </label>
            </div>

            <button onClick={handleSave} className="btn btn-primary" disabled={saveStatus === "pending"}>
              {saveStatus === "pending" ? "РЎРѕС…СЂР°РЅРµРЅРёРµ..." : "РЎРѕС…СЂР°РЅРёС‚СЊ РЅР°СЃС‚СЂРѕР№РєРё"}
            </button>
          </div>
        </div>

        <div className="settings-section">
          <h2>РџСЂРѕС‡РµРµ</h2>
          <div className="settings-grid">
            <Link to="/analytics" className="setting-tile">рџ“Љ РђРЅР°Р»РёС‚РёРєР°</Link>
            <Link to="/subscription" className="setting-tile">рџ’° РџРѕРґРїРёСЃРєР°</Link>
            <div className="setting-tile">рџ’і РџСЂРёРІСЏР·Р°РЅРЅР°СЏ РєР°СЂС‚Р°</div>
            <div className="setting-tile">FAQ</div>
          </div>
        </div>

        <div className="settings-section">
          <h2>РЈРїСЂР°РІР»РµРЅРёРµ Р°РєРєР°СѓРЅС‚РѕРј</h2>
          <div className="settings-grid">
            <button className="btn btn-danger" onClick={handleLogout}>
              Р’С‹Р№С‚Рё
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
