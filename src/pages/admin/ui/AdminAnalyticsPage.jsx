import React, { useEffect, useState } from "react";
import http from "@/shared/api/http-client";
import "@/shared/styles/pages/AdminAnalytics.css";

export default function AdminAnalyticsPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    http
      .get("/admin/analytics/daily")
      .then((response) => mounted && setData(response.data || []))
      .catch(() => mounted && setData([]))
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="container analytics-page">
        <p>Р—Р°РіСЂСѓР·РєР°...</p>
      </div>
    );
  }

  return (
    <div className="container analytics-page">
      <h1>РђРЅР°Р»РёС‚РёРєР° (daily)</h1>
      <div className="table-wrap">
        <table className="analytics-table">
          <thead>
            <tr>
              <th>userId</th>
              <th>date</th>
              <th>plays</th>
              <th>likes</th>
              <th>shares</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id}>
                <td>{item.userId}</td>
                <td>{item.d}</td>
                <td>{item.plays}</td>
                <td>{item.likes}</td>
                <td>{item.shares}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
