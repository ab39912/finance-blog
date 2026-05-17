import { Masthead } from '@/components/Masthead';
import { Footer } from '@/components/Footer';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Masthead />
      <main className="flex-1 relative z-10">{children}</main>
      <Footer />
    </>
  );
}
