import { ROUTES } from "@/utils/constants";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">Senex Tours</h1>
      <Link href={ROUTES.SIGNIN}>Sign in</Link>
    </div>
  );
}
