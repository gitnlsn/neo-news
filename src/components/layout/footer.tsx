import Link from "next/link";
import { Container } from "~/components/ui/container";
import { cn } from "~/lib/utils";

interface FooterProps {
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className }) => {
  return (
    <footer className={cn("bg-black text-white", className)}>
      <Container className="py-6">
        <div className="flex flex-col items-center gap-4">
          <nav className="flex gap-4 text-sm">
            <Link
              href="/about/updates"
              className="hover:text-gray-300 transition-colors"
              aria-label="Atualizações"
            >
              Atualizações
            </Link>
            <span aria-hidden="true">•</span>
            <Link
              href="/about/terms"
              className="hover:text-gray-300 transition-colors"
              aria-label="Termos de Uso"
            >
              Termos de Uso
            </Link>
          </nav>
          <p className="text-center text-sm">
            © 2025 Neo News. Todos os direitos reservados.
          </p>
        </div>
      </Container>
    </footer>
  );
};
