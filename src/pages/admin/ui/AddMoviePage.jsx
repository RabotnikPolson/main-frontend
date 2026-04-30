import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addFromKinopoisk } from "@/features/movies";
import "@/shared/styles/pages/AddMovie.css";

export default function AddMoviePage() {
  const [kpId, setKpId] = useState("");
  const [msg, setMsg] = useState("");
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id) => addFromKinopoisk(id),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["movies"] });
      setMsg(`Р¤РёР»СЊРј "${data?.title || `ID: ${kpId}`}" СѓСЃРїРµС€РЅРѕ РґРѕР±Р°РІР»РµРЅ`);
      setKpId("");
    },
    onError: (err) => {
      const errorMsg =
        err.response?.data?.message || err.message || "РћС€РёР±РєР° СЃРµСЂРІРµСЂР°";
      setMsg(`РћС€РёР±РєР°: ${errorMsg}`);
    },
  });

  const submit = (event) => {
    event.preventDefault();
    const id = kpId.trim();

    if (!/^\d+$/.test(id)) {
      setMsg("Р’РІРµРґРёС‚Рµ РєРѕСЂСЂРµРєС‚РЅС‹Р№ С‡РёСЃР»РѕРІРѕР№ ID");
      return;
    }

    mutation.mutate(id);
  };

  return (
    <div className="addmovie-page container">
      <h1>Р”РѕР±Р°РІРёС‚СЊ С„РёР»СЊРј РїРѕ РљРёРЅРѕРїРѕРёСЃРє ID</h1>

      <form onSubmit={submit} className="imdb-import">
        <input
          className="input"
          value={kpId}
          onChange={(event) => setKpId(event.target.value)}
          placeholder="РќР°РїСЂРёРјРµСЂ: 301"
        />
        <button className="button" disabled={mutation.isPending}>
          {mutation.isPending ? "РРјРїРѕСЂС‚..." : "РРјРїРѕСЂС‚РёСЂРѕРІР°С‚СЊ"}
        </button>
      </form>

      {msg && (
        <p className={`status-message ${mutation.isError ? "error" : "success"}`} role="status">
          {msg}
        </p>
      )}
    </div>
  );
}
