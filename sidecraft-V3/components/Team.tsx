import type { CSSProperties } from "react";

/** Section « Nous » : présentation d’Adea et Ashley.
 * Les attributs data-i relient chaque texte aux traductions FR/DE de public/js/site.js. */
export default function Team() {
  return (
    <>
      <section id="nous">
          <div className="wrap">
            <h2 className="rv" data-i="t2">Nous</h2>
            <div className="team">
              <div className="glass rv"><div className="av">A</div><h3>Adea</h3><div className="role" data-i="ra">Creative &amp; Web Design</div>
                <p data-i="a1">À 21 ans, Adea conçoit les sites de Sidecraft avec une conviction simple : un bon site doit apporter des opportunités, pas seulement une belle image.</p>
                <p data-i="a2">Il travaille sur l’UX/UI, le responsive design, l’architecture de l’information, les animations, le SEO technique et les performances. Derrière ces termes, un objectif concret : être trouvé, inspirer confiance rapidement et guider un prospect jusqu’à la prise de contact.</p>
                <p data-i="a3">Son approche est fortement influencée par son univers créatif — photographie, peinture, musique et écriture — mais aussi par une culture du web développée au contact de son père, web designer depuis plus de 10 ans.</p>
                <p data-i="a4">Adea aime comprendre comment les choses fonctionnent, les simplifier et les pousser plus loin. C’est cette exigence qu’il applique à chaque projet : un site rapide, précis, distinctif et pensé pour faire grandir l'entreprise.</p></div>
              <div className="glass rv" style={{ "--d": ".12s" } as CSSProperties}><div className="av">A</div><h3>Ashley</h3><div className="role" data-i="rs">Sales &amp; Business Development</div>
                <p data-i="s1">À 23 ans, Ashley s’occupe du développement commercial et de la relation client chez Sidecraft, avec une priorité : comprendre ce qui fait gagner — ou perdre — un client.</p>
                <p data-i="s2">Son expérience dans la vente en ligne lui a permis de maîtriser la prospection, la qualification des leads, la négociation et le closing.</p>
                <p data-i="s3">Cette expérience lui permet d’aborder chaque projet avec un regard différent : qu’est-ce qui convainc un prospect, qu’est-ce qui le rassure et qu’est-ce qui peut le faire partir chez un concurrent ? Native allemande, Ashley connaît les attentes du marché local et accompagne personnellement les clients de Sidecraft pour que chaque décision prise sur leur site ait une véritable utilité commerciale.</p>
                <p data-i="s4">Son objectif est simple : que le site ne soit pas une dépense de plus, mais un outil capable de générer de nouvelles opportunités.</p></div>
            </div>
          </div>
        </section>
    </>
  );
}
