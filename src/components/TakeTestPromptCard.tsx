export function TakeTestPromptCard({ onStart }: { onStart: () => void }) {
  return (
    <div className="bg-linear-to-br from-surface-container-lowest via-white to-primary-container/10 rounded-3xl border border-outline-variant/60 p-8 space-y-4">
      <h2 className="font-heading text-2xl font-bold text-on-surface">Faz o teste vocacional</h2>
      <p className="font-body-sm text-on-surface-variant max-w-lg">
        Responde a 18 perguntas rápidas e descobre qual dos nossos cursos combina melhor contigo.
      </p>
      <button onClick={onStart} className="bg-primary-container text-on-primary-container font-semibold px-6 py-3 rounded-xl">
        Começar agora
      </button>
    </div>
  );
}