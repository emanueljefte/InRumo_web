import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../application/auth/useAuth";
import gsap from "gsap";
import { getHomeRoute } from "../application/auth/getHomeRoute";

const SPLASH_DELAY_MS = 700;

export default function SplashPage() {
  const { initializing, profile } = useAuth();
  const navigate = useNavigate();
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        logoRef.current,
        { opacity: 0, scale: 0.85 },
        { opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out' },
      );
    });
    return () => ctx.kill();
  }, []);

  useEffect(() => {
  if (initializing) return;
  const timeout = setTimeout(() => {
    navigate(getHomeRoute(profile), { replace: true });
  }, SPLASH_DELAY_MS);
  return () => clearTimeout(timeout);
}, [profile, initializing, navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div ref={logoRef} className="flex flex-col items-center gap-3">
        <img src="./splash-icon_2.png" alt="Logo do InRumo" className="w-50" />
      </div>
    </div>
  );
}