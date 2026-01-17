import { AppProvider } from "@shopify/polaris";
import { useNavigate } from "@remix-run/react";
import "@shopify/polaris/build/esm/styles.css";

interface AppLayoutProps {
  children: React.ReactNode;
  apiKey?: string;
  shop?: string;
  host?: string;
}

export function AppLayout({ children }: AppLayoutProps) {
  const navigate = useNavigate();

  return (
    <AppProvider
      linkComponent={({ children, url, ...props }) => {
        return (
          <a
            href={url}
            onClick={(e) => {
              e.preventDefault();
              if (url) {
                navigate(url);
              }
            }}
            {...props}
          >
            {children}
          </a>
        );
      }}
    >
      {children}
    </AppProvider>
  );
}
