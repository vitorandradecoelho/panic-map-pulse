import { LanguageSelector } from "@/components/ui/language-selector";
import { useTranslation } from "@/hooks/useTranslation";

interface HeaderProps {
  title?: string;
}

export const Header = ({ title }: HeaderProps) => {
  const { t } = useTranslation();

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold text-foreground">
            {title || t('dashboard.title')}
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <LanguageSelector />
        </div>
      </div>
    </header>
  );
};