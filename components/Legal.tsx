/** Champ à remplir, affiché en surbrillance tant qu'il n'est pas complété. */
export function Todo({ children }: { children: React.ReactNode }) {
  return <mark className="todo">[À COMPLÉTER : {children}]</mark>;
}

export function LegalPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <article className="page container legal">
      <h1>{title}</h1>
      <p className="legal__updated">
        Dernière mise à jour : <Todo>date</Todo>
      </p>
      {children}
    </article>
  );
}
