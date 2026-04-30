import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addFromKinopoisk } from "../shared/api/movies";
import "../styles/pages/AddMovie.css";

export default function AddMovie() {
  const [kpId, setKpId] = useState("");
  const [msg, setMsg] = useState("");
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id) => addFromKinopoisk(id),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["movies"] });
      setMsg(`Фильм "${data?.title || "ID: " + kpId}" успешно добавлен`);
      setKpId("");
    },
    onError: (err) => {
      // Пытаемся достать сообщение об ошибке из ответа сервера
      const errorMsg = err.response?.data?.message || err.message || "Ошибка сервера";
      setMsg("Ошибка: " + errorMsg);
    },
  });

  const submit = (e) => {
    e.preventDefault();
    const id = kpId.trim();

    // Валидация: Кинопоиск ID — это просто число (обычно до 7-10 цифр)
    if (!/^\d+$/.test(id)) {
      setMsg("Введите корректный числовой ID (например, 301)");
      return;
    }
    
    mutation.mutate(id);
  };

  return (
    <div className="addmovie-page container">
      <h1>Добавить фильм по Кинопоиск ID</h1>

      <form onSubmit={submit} className="imdb-import">
        <input
          className="input"
          value={kpId}
          onChange={(e) => setKpId(e.target.value)}
          placeholder="Например: 301"
        />
        <button 
          className="button" 
          disabled={mutation.isPending} // В новых версиях React Query используется isPending вместо isLoading
        >
          {mutation.isPending ? "Импорт…" : "Импортировать"}
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