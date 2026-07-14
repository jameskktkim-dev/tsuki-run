import tsukiLogo from "../assets/tsuki-run-logo.svg";
import "./OpeningScreen.css";

export default function OpeningScreen({ onEnter }) {
  return (
    <section className="opening-screen">
      <div className="opening-content">
        <img
          src={tsukiLogo}
          alt="Tsuki Run"
          className="opening-logo"
        />

        <button
          type="button"
          className="opening-enter"
          onClick={onEnter}
        >
          Enter
        </button>
      </div>
    </section>
  );
}