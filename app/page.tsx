import { SITE_CONFIG } from "@/lib/constants";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <h1 className="text-6xl font-bold text-pc-red">
        {SITE_CONFIG.tagline.toUpperCase()}
      </h1>
    </main>
  );
}
