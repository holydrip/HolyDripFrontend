import Header from "@/components/(site)/Header";
import Footer from "@/components/(site)/Footer";
import { Countdown } from "@/components/countdown/Countdown";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
    const dropDate = new Date("2026-02-28T00:00:00");
    
    return (
        <Countdown date={dropDate}>
            <Header/>
            
            <main className="flex-1">{children}</main>
            <Footer />
        </Countdown>
    );
}