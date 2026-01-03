import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { DocsSidebar } from "@/components/docs/DocsSidebar";

export default function DocsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-white dark:bg-black flex flex-col">
            <Navbar />
            <div className="flex-1 container mx-auto px-6 pt-24 pb-12">
                <div className="flex flex-col md:flex-row gap-10">
                    <aside className="hidden md:block w-64 shrink-0">
                        <div className="sticky top-24">
                            <DocsSidebar />
                        </div>
                    </aside>
                    <main className="flex-1 min-w-0">
                        {children}
                    </main>
                </div>
            </div>
            <Footer />
        </div>
    );
}
