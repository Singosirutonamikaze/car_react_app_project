import { useEffect } from "react";
import { useNavigate } from "react-router";
import ROUTES from "../../router";

const LoaderPage = () => {
  const navigate =  useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(ROUTES.HOME);
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);
  
  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center bg-gradient-to-b from-blue-900 via-blue-950 to-black">
      <div className="absolute inset-0 backdrop-blur-sm bg-gradient-to-br from-blue-500/5 via-transparent to-black/20"></div>
      
      <div className="relative z-10">
        <style>{`
          .cube {
            width: 60px;
            height: 60px;
            position: relative;
            transform-style: preserve-3d;
            animation: rotate 3s infinite linear;
          }

          .cube .face {
            position: absolute;
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #3b82f6, #1d4ed8);
            border: 1px solid rgba(59, 130, 246, 0.3);
            backdrop-filter: blur(10px);
          }

          .cube .front {
            transform: rotateY(0deg) translateZ(30px);
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.4);
          }

          .cube .back {
            transform: rotateY(180deg) translateZ(30px);
            background: linear-gradient(135deg, #1e40af, #1e3a8a);
          }

          .cube .right {
            transform: rotateY(90deg) translateZ(30px);
            background: linear-gradient(135deg, #2563eb, #1d4ed8);
          }

          .cube .left {
            transform: rotateY(-90deg) translateZ(30px);
            background: linear-gradient(135deg, #1e40af, #1e3a8a);
          }

          .cube .top {
            transform: rotateX(90deg) translateZ(30px);
            background: linear-gradient(135deg, #60a5fa, #3b82f6);
            box-shadow: 0 0 15px rgba(96, 165, 250, 0.3);
          }

          .cube .bottom {
            transform: rotateX(-90deg) translateZ(30px);
            background: linear-gradient(135deg, #1e40af, #1e3a8a);
          }

          @keyframes rotate {
            0% {
              transform: rotateX(0deg) rotateY(0deg);
            }
            100% {
              transform: rotateX(360deg) rotateY(360deg);
            }
          }

          /* Effet de lueur autour du cube */
          .cube::before {
            content: '';
            position: absolute;
            top: -10px;
            left: -10px;
            right: -10px;
            bottom: -10px;
            background: radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%);
            border-radius: 10px;
            animation: pulse 2s ease-in-out infinite alternate;
            z-index: -1;
          }

          @keyframes pulse {
            0% {
              opacity: 0.4;
              transform: scale(1);
            }
            100% {
              opacity: 0.8;
              transform: scale(1.1);
            }
          }

          /* Barre de progression */
          .progress-bar {
            position: absolute;
            bottom: 50px;
            left: 50%;
            transform: translateX(-50%);
            width: 200px;
            height: 4px;
            background: rgba(59, 130, 246, 0.2);
            border-radius: 2px;
            overflow: hidden;
            backdrop-filter: blur(10px);
          }

          .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #3b82f6, #60a5fa);
            border-radius: 2px;
            animation: progress 5s linear forwards;
            box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
          }

          @keyframes progress {
            0% { width: 0%; }
            100% { width: 100%; }
          }
          /* Responsive */
          @media (max-width: 480px) {
            .cube {
              width: 45px;
              height: 45px;
            }
            .cube .face {
              width: 45px;
              height: 45px;
            }
            .cube .front { transform: rotateY(0deg) translateZ(22.5px); }
            .cube .back { transform: rotateY(180deg) translateZ(22.5px); }
            .cube .right { transform: rotateY(90deg) translateZ(22.5px); }
            .cube .left { transform: rotateY(-90deg) translateZ(22.5px); }
            .cube .top { transform: rotateX(90deg) translateZ(22.5px); }
            .cube .bottom { transform: rotateX(-90deg) translateZ(22.5px); }
            
            .progress-bar {
              width: 150px;
              bottom: 30px;
            }
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