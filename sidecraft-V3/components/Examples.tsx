import type { CSSProperties } from "react";

/** Section « Exemples » : les maquettes sont générées par public/js/site.js.
 * Les attributs data-i relient chaque texte aux traductions FR/DE de public/js/site.js. */
export default function Examples() {
  return (
    <>
      <section id="portfolio">
          <div className="wrap">
            <h2 className="rv" data-i="t1">Exemples</h2>
            <div className="work">
              <article className="glass frame rv" data-site="d" tabIndex={0} role="button" style={{ "--d": "0s" } as CSSProperties}><div className="bar"><i></i><i></i><i></i><span>zahnarzt-muster.de</span></div><div className="slot site"></div><div className="cap"></div></article>
              <article className="glass frame rv" data-site="s" tabIndex={0} role="button" style={{ "--d": ".12s" } as CSSProperties}><div className="bar"><i></i><i></i><i></i><span>sanitaer-muster.de</span></div><div className="slot site"></div><div className="cap"></div></article>
              <article className="glass frame rv" data-site="r" tabIndex={0} role="button" style={{ "--d": ".24s" } as CSSProperties}><div className="bar"><i></i><i></i><i></i><span>dach-muster.de</span></div><div className="slot site"></div><div className="cap"></div></article>
            </div>
          </div>
        </section>
    </>
  );
}
