import Header from "@/components/(site)/Header";
import Footer from "@/components/(site)/Footer";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
      const dropDate = new Date("2025-03-01T00:00:00");
    
      const showHeader = (Date.now() > dropDate.getTime());
    return (
        <>
            {showHeader ? <Header /> : undefined}
            
            <main className="flex-1">{children}</main>
            <Footer />
        </>
    );
}