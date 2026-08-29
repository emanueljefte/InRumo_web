import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background gap-stack-md px-margin-mobile text-center">
      <p className="font-heading text-display-lg text-primary">404</p>
      <h1 className="font-heading text-headline-md text-on-background">Página não encontrada</h1>
      <p className="font-body text-body-md text-on-variant max-w-md">
        A página que procuras não existe ou foi movida.
      </p>
      <Link
        to="/"
        className="mt-stack-sm rounded bg-primary px-6 py-2 font-body text-body-md text-primary-foreground"
      >
        Voltar ao início
      </Link>
    </div>
  );
}