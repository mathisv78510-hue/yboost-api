import Image from "next/image";
import Explication from "../components/explication";
export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Explication />
    </div>
  );
}
