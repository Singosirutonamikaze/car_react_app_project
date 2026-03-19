import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import ROUTES from "../../../router";

const LoaderPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(ROUTES.HOME);
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center client-loader-gradient-shift">
      <div className="absolute inset-0 backdrop-blur-sm client-theme-loader-overlay"></div>
      <div className="relative z-10 client-loader-shell">
        <div className="client-loader-car-wrap">
          <svg width="240" height="70" viewBox="0 0 240 70" xmlns="http://www.w3.org/2000/svg" aria-label="Chargement en cours">
            <rect x="20" y="20" width="200" height="32" rx="8" fill="#5F5E5A" />
            <rect x="20" y="36" width="200" height="8" fill="#444441" />
            <path d="M72,20 Q84,2 102,0 L146,0 Q162,2 170,20 Z" fill="#444441" />
            <polygon points="80,18 94,5 146,5 160,18" fill="#B4B2A9" opacity="0.6" />

            <ellipse cx="224" cy="32" rx="18" ry="8" fill="#FAC775" opacity="0.25" className="client-loader-headlight" />
            <rect x="198" y="26" width="20" height="12" rx="3" fill="#FAC775" className="client-loader-headlight" />
            <rect x="208" y="26" width="10" height="12" rx="3" fill="#EF9F27" className="client-loader-headlight" />

            <rect x="22" y="26" width="18" height="12" rx="3" fill="#E24B4A" />

            <rect x="140" y="22" width="18" height="4" rx="2" fill="#888780" />
            <rect x="100" y="22" width="32" height="4" rx="2" fill="#888780" />

            <circle cx="68" cy="48" r="19" fill="#1a1a1a" />
            <circle cx="68" cy="48" r="12" fill="#444441" />
            <circle cx="68" cy="48" r="5" fill="#B4B2A9" />
            <g className="client-loader-wheel">
              <line x1="68" y1="29" x2="68" y2="67" stroke="#5F5E5A" strokeWidth="2.5" />
              <line x1="49" y1="48" x2="87" y2="48" stroke="#5F5E5A" strokeWidth="2.5" />
            </g>

            <circle cx="172" cy="48" r="19" fill="#1a1a1a" />
            <circle cx="172" cy="48" r="12" fill="#444441" />
            <circle cx="172" cy="48" r="5" fill="#B4B2A9" />
            <g className="client-loader-wheel">
              <line x1="172" y1="29" x2="172" y2="67" stroke="#5F5E5A" strokeWidth="2.5" />
              <line x1="153" y1="48" x2="191" y2="48" stroke="#5F5E5A" strokeWidth="2.5" />
            </g>
          </svg>
        </div>

        <div className="client-loader-progress-track" aria-hidden="true">
          <div className="client-loader-progress-bar"></div>
          <div className="client-loader-progress-glow"></div>
        </div>
      </div>
    </div>
  );
};

export default LoaderPage;
