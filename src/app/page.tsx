import { LegalAdvisor } from "@/components/legal-advisor";
import { Footer } from "@/components/footer";
import { ScrollToTop } from "@/components/scroll-to-top";

export default function Home() {
  return (
    <>
      <main className="flex-1 w-full">
        <LegalAdvisor />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
