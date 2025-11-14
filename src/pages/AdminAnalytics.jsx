// src/pages/AdminAnalytics.jsx
import React, { useEffect, useState } from 'react';
import http from '../shared/api/http';
import '../styles/pages/AdminAnalytics.css';

export default function AdminAnalytics() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    http.get('/api/admin/analytics/daily')
      .then(r => mounted && setData(r.data || []))
      .catch(() => mounted && setData([]))
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  if (loading) return <div className="container analytics-page"><p>Загрузка…</p></div>;

  return (
    <div className="container analytics-page">
      <h1>Аналитика (daily)</h1>
      <div className="table-wrap">
        <table className="analytics-table">
          <thead>
            <tr><th>userId</th><th>date</th><th>plays</th><th>likes</th><th>shares</th></tr>
          </thead>
          <tbody>
            {data.map(d => (
              <tr key={d.id}>
                <td>{d.userId}</td>
                <td>{d.d}</td>
                <td>{d.plays}</td>
                <td>{d.likes}</td>
                <td>{d.shares}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
