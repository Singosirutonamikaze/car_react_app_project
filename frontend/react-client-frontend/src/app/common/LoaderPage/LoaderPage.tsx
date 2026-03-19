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
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center client-layout-gradient">
      <div className="absolute inset-0 backdrop-blur-sm client-theme-loader-overlay"></div>

      <div className="relative z-10">
        <style>{`
          .cube { width: 60px; height: 60px; position: relative; transform-style: preserve-3d; animation: rotate 3s infinite linear; }
          .cube .face { position: absolute; width: 60px; height: 60px; background: linear-gradient(135deg, var(--client-accent-strong), var(--client-bg-via)); border: 1px solid var(--client-border); backdrop-filter: blur(10px); }
          .cube .front { transform: rotateY(0deg) translateZ(30px); }
          .cube .back { transform: rotateY(180deg) translateZ(30px); background: linear-gradient(135deg, var(--client-bg-via), var(--client-bg-to)); }
          .cube .right { transform: rotateY(90deg) translateZ(30px); background: linear-gradient(135deg, var(--client-accent), var(--client-bg-via)); }
          .cube .left { transform: rotateY(-90deg) translateZ(30px); background: linear-gradient(135deg, var(--client-accent-strong), var(--client-bg-from)); }
          .cube .top { transform: rotateX(90deg) translateZ(30px); background: linear-gradient(135deg, var(--client-text-secondary), var(--client-accent-strong)); }
          .cube .bottom { transform: rotateX(-90deg) translateZ(30px); background: linear-gradient(135deg, var(--client-bg-via), var(--client-bg-to)); }
          @keyframes rotate { 0% { transform: rotateX(0deg) rotateY(0deg); } 100% { transform: rotateX(360deg) rotateY(360deg); } }
          .cube::before { content: ''; position: absolute; top: -10px; left: -10px; right: -10px; bottom: -10px; background: radial-gradient(circle, var(--client-accent) 0%, transparent 70%); border-radius: 10px; animation: pulse 2s ease-in-out infinite alternate; z-index: -1; }
          @keyframes pulse { 0% { opacity: 0.4; transform: scale(1); } 100% { opacity: 0.8; transform: scale(1.1); } }
          .progress-bar { position: relative; width: 120px; height: 4px; background: var(--client-surface); border-radius: 2px; overflow: hidden; backdrop-filter: blur(10px); border: 1px solid var(--client-border); margin: 16px auto 0; }
          .progress-fill { height: 100%; background: linear-gradient(90deg, var(--client-accent), var(--client-accent-strong)); border-radius: 2px; animation: progress 5s linear forwards; }
          @keyframes progress { 0% { width: 0%; } 100% { width: 100%; } }
          @media (max-width: 480px) {
            .cube { width: 45px; height: 45px; }
            .cube .face { width: 45px; height: 45px; }
            .cube .front { transform: rotateY(0deg) translateZ(22.5px); }
            .cube .back { transform: rotateY(180deg) translateZ(22.5px); }
            .cube .right { transform: rotateY(90deg) translateZ(22.5px); }
            .cube .left { transform: rotateY(-90deg) translateZ(22.5px); }
            .cube .top { transform: rotateX(90deg) translateZ(22.5px); }
            .cube .bottom { transform: rotateX(-90deg) translateZ(22.5px); }
            .progress-bar { width: 100px; margin-top: 14px; }
          }
        `}</style>

        <div className="cube">
          <div className="face front"></div>
          <div className="face back"></div>
          <div className="face right"></div>
          <div className="face left"></div>
          <div className="face top"></div>
          <div className="face bottom"></div>
        </div>

        <div className="progress-bar">
          <div className="progress-fill"></div>
        </div>
      </div>
    </div>
  );
};

export default LoaderPage;
