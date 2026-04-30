import React from "react";
import { useAuth } from "@/features/auth";
import { useSubscription } from "@/features/subscription";
import "@/shared/styles/pages/Subscription.css";

export default function SubscriptionPage() {
  const { user } = useAuth();
  const username = user?.username;
  const { data: sub, isLoading, subscribe, cancel } = useSubscription(username);

  if (!username) {
    return (
      <div className="container subscription-page">
        <p>Р’РѕР№РґРёС‚Рµ РґР»СЏ СѓРїСЂР°РІР»РµРЅРёСЏ РїРѕРґРїРёСЃРєРѕР№</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container subscription-page">
        <p>Р—Р°РіСЂСѓР·РєР°...</p>
      </div>
    );
  }

  const onSubscribe = async () => {
    try {
      await subscribe({ plan: "pro" });
    } catch {}
  };

  const onCancel = async () => {
    try {
      await cancel();
    } catch {}
  };

  return (
    <div className="container subscription-page">
      <h1>РџРѕРґРїРёСЃРєР°</h1>
      <div className="sub-card">
        <div>
          РўРµРєСѓС‰РёР№ РїР»Р°РЅ: <strong>{sub?.plan || "free"}</strong>
        </div>
        <div>
          РЎС‚Р°С‚СѓСЃ: <strong>{sub?.status || "none"}</strong>
        </div>

        {sub?.status === "active" ? (
          <button onClick={onCancel} className="button button--ghost">
            РћС‚РјРµРЅРёС‚СЊ РїРѕРґРїРёСЃРєСѓ
          </button>
        ) : (
          <button onClick={onSubscribe} className="button">
            РћС„РѕСЂРјРёС‚СЊ PRO
          </button>
        )}
      </div>
    </div>
  );
}
