import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addFromKinopoisk, deleteMovie, useMovies } from "@/features/movies";
import "@/shared/styles/pages/AddMovie.css";

export default function AdminMoviesPage() {
  const { data: movies = [], isLoading, isError, error } = useMovies();
  const [kpId, setKpId] = useState("");
  const [msg, setMsg] = useState("");
  const qc = useQueryClient();

  const addMut = useMutation({
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

  const deleteMut = useMutation({
    mutationFn: (id) => deleteMovie(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["movies"] });
      setMsg("Р¤РёР»СЊРј СѓРґР°Р»РµРЅ.");
    },
    onError: (err) => {
      const status = err.response?.status;
      const backend =
        err.response?.data?.message || err.response?.data || "РћС€РёР±РєР° СЃРµСЂРІРµСЂР°";
      const errorMsg = `${status ? `[${status}] ` : ""}${backend}`;
      setMsg(`РћС€РёР±РєР° СѓРґР°Р»РµРЅРёСЏ: ${errorMsg}`);
    },
  });

  const onSubmit = (event) => {
    event.preventDefault();
    const id = kpId.trim();

    if (!/^[0-9]+$/.test(id)) {
      setMsg("Р’РІРµРґРёС‚Рµ С‡РёСЃР»РѕРІРѕР№ Kinopoisk ID");
      return;
    }

    addMut.mutate(id);
  };

  if (isLoading) {
    return <div className="container"><p>Р—Р°РіСЂСѓР·РєР° СЃРїРёСЃРєР° С„РёР»СЊРјРѕРІ...</p></div>;
  }

  if (isError) {
    return <div className="container"><p>РћС€РёР±РєР°: {error?.message || "РќРµ СѓРґР°Р»РѕСЃСЊ РїРѕР»СѓС‡РёС‚СЊ С„РёР»СЊРјС‹"}</p></div>;
  }

  return (
    <div className="container addmovie-page">
      <h1>РђРґРјРёРЅ: СѓРїСЂР°РІР»РµРЅРёРµ С„РёР»СЊРјР°РјРё</h1>

      <section className="admin-add-section">
        <h2>Р”РѕР±Р°РІРёС‚СЊ С„РёР»СЊРј РїРѕ Kinopoisk ID</h2>
        <form onSubmit={onSubmit} className="imdb-import">
          <input
            className="input"
            value={kpId}
            onChange={(event) => setKpId(event.target.value)}
            placeholder="РџСЂРёРјРµСЂ: 301"
          />
          <button className="button" disabled={addMut.isPending}>
            {addMut.isPending ? "РРјРїРѕСЂС‚..." : "РРјРїРѕСЂС‚РёСЂРѕРІР°С‚СЊ"}
          </button>
        </form>
      </section>

      {msg && (
        <p className={`status-message ${addMut.isError || deleteMut.isError ? "error" : "success"}`} role="status">
          {msg}
        </p>
      )}

      <section className="admin-list-section">
        <h2>РЎРїРёСЃРѕРє С„РёР»СЊРјРѕРІ</h2>
        {movies.length === 0 ? (
          <p>Р¤РёР»СЊРјС‹ РЅРµ РЅР°Р№РґРµРЅС‹.</p>
        ) : (
          <div className="movie-table-wrap">
            <table className="admin-movie-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>РќР°Р·РІР°РЅРёРµ</th>
                  <th>Р“РѕРґ</th>
                  <th>Р–Р°РЅСЂ</th>
                  <th>Р”РµР№СЃС‚РІРёСЏ</th>
                </tr>
              </thead>
              <tbody>
                {movies.map((movie) => (
                  <tr key={movie.id}>
                    <td>{movie.id}</td>
                    <td>{movie.title}</td>
                    <td>{movie.year || "—"}</td>
                    <td>{movie.genre || "—"}</td>
                    <td>
                      <button
                        className="button button--ghost"
                        disabled={deleteMut.isPending}
                        onClick={() => {
                          if (!window.confirm(`РЈРґР°Р»РёС‚СЊ С„РёР»СЊРј "${movie.title}" (ID ${movie.id})?`)) {
                            return;
                          }
                          deleteMut.mutate(movie.id);
                        }}
                      >
                        РЈРґР°Р»РёС‚СЊ
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
