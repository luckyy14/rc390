import { useEffect, useState } from "react";

export default function usePhone() {
  const [isPhone, setIsPhone] = useState(() => window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsPhone(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return { isPhone };
}
