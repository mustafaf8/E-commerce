import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";

function AuthLayout({ 
  children, 
  title, 
  description, 
  footerContent,
  className = "" 
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className={`
          w-full 
          max-[510px]:border-0 
          max-[510px]:shadow-none 
          max-[510px]:bg-transparent
          shadow-lg 
          border 
          bg-card/95 
          backdrop-blur-sm
          ${className}
        `}>
          <CardHeader className="space-y-2 text-center pb-6">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <svg 
                className="w-8 h-8 text-primary-foreground" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {title}
            </h1>
            {description && (
              <p className="text-sm text-muted-foreground">
                {description}
              </p>
            )}
          </CardHeader>
          
          <CardContent className="space-y-6">
            {children}
          </CardContent>
          
          {footerContent && (
            <CardFooter className="pt-0 pb-12">
              <div className="w-full text-center text-sm text-muted-foreground">
                {footerContent}
              </div>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
}

export default AuthLayout;