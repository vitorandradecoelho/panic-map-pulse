import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { changeLanguage, getSupportedLanguages } from "@/i18n/config";

export const LanguageSelector = () => {
  const { currentLanguage } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  
  const supportedLanguages = getSupportedLanguages();
  
  const getCurrentLanguageLabel = () => {
    switch (currentLanguage) {
      case 'pt':
        return supportedLanguages.português;
      case 'en':
        return supportedLanguages.english;
      case 'es':
        return supportedLanguages.español;
      case 'es-MX':
        return supportedLanguages["español-MX"];
      default:
        return supportedLanguages.português;
    }
  };

  const handleLanguageChange = (languageKey: string) => {
    changeLanguage(languageKey);
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">{getCurrentLanguageLabel()}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-background border border-border z-50">
        <DropdownMenuItem 
          onClick={() => handleLanguageChange('português')}
          className={currentLanguage === 'pt' ? 'bg-accent' : ''}
        >
          {supportedLanguages.português}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleLanguageChange('english')}
          className={currentLanguage === 'en' ? 'bg-accent' : ''}
        >
          {supportedLanguages.english}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleLanguageChange('español')}
          className={currentLanguage === 'es' ? 'bg-accent' : ''}
        >
          {supportedLanguages.español}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleLanguageChange('español-MX')}
          className={currentLanguage === 'es-MX' ? 'bg-accent' : ''}
        >
          {supportedLanguages["español-MX"]}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};