import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ErrorScreenProps {
  message: string;
  onRetry?: () => void;
  showRetry?: boolean;
}

const ErrorScreen = ({ 
  message, 
  onRetry, 
  showRetry = true 
}: ErrorScreenProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-xl">Erro no Sistema</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">{message}</p>
          
          {showRetry && onRetry && (
            <Button 
              onClick={onRetry}
              className="w-full flex items-center space-x-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Tentar Novamente</span>
            </Button>
          )}
          
          <div className="text-sm text-muted-foreground">
            Se o problema persistir, entre em contato com o suporte.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ErrorScreen;