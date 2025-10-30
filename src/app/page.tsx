'use client';

import { useRouter } from 'next/navigation';
import LandingPage from "@/features/landing/LandingPage";
// Importa ArbitragesPage si quieres alternar, si no, puedes dejar solo el LandingPage.
// import ArbitragesPage from "./panel/ArbitrageList";

export default function Home() {
  const router = useRouter();

  const handleStartClick = () => {
    // Redirige al usuario a la ruta de la aplicación (dashboard)
    router.push('/panel');
  };
  
  // Renderiza la Landing Page con la función de navegación
  return <LandingPage onStartClick={handleStartClick} />;
}
