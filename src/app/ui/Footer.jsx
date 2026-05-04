import { Link } from "react-router-dom";
import "@/shared/styles/layout/Footer.css";

export default function Footer() {
  return (
    <footer className="app-footer glass">
      <div className="footer-links">
        <Link to="/terms">Пользовательское соглашение</Link>
        <Link to="/privacy">Политика конфиденциальности</Link>
        <Link to="/contacts">Контакты</Link>
      </div>
      <div className="footer-copy">
        CineVerse — премиальная платформа для просмотра фильмов и сериалов.
      </div>
    </footer>
  );
}
