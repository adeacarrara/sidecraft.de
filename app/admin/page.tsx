import type { Metadata } from "next";
import Background from "@/components/Background";
import AdminPanel from "@/components/AdminPanel";

export const metadata: Metadata = { title: "Rendez-vous", robots: { index: false, follow: false } };

export default function AdminPage() {
  return (
    <>
      <Background />
      <main className="legal admin">
        <h1>Rendez-vous</h1>
        <AdminPanel />
      </main>
    </>
  );
}
