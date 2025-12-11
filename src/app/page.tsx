import Image from "next/image";
import Explication from "../components/explication";
export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans bg-gradient-to-b from-amber-50 to-orange-50">
      <Explication />
    </div>
  );
}
