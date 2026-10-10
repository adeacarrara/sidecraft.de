import type { CSSProperties } from "react";

/** Offres et bouton « Nous contacter ».
 * Les attributs data-i relient chaque texte aux traductions FR/DE de public/js/site.js. */
export default function Pricing() {
  return (
    <>
      <section id="prix">
          <div className="wrap">
            <h2 className="rv" data-i="t3">Prix</h2>
            <p className="hint rv" data-i="t5">Cliquez sur une offre pour configurer votre site.</p>
            <div className="price">
              <div className="glass p1 rv" data-offer="p1" tabIndex={0} role="button"><h3 data-i="p1">Page Google</h3><div className="amt" data-n="500">500 €</div><ul className="ft"><li data-i="q11">Première version en 24 h</li><li data-i="q12">Page vitrine</li><li data-i="q13">2 versions possibles</li><li data-i="q14">5 retouches possibles</li></ul><span className="pick" data-i="pk">Choisir cette offre →</span></div>
              <div className="glass p2 mid rv" style={{ "--d": ".12s" } as CSSProperties} data-offer="p2" tabIndex={0} role="button"><h3 data-i="p2">Site vitrine</h3><div className="amt" data-n="1500">1 500 €</div><ul className="ft"><li data-i="q21">Première version en 48 h</li><li data-i="q22">Jusqu’à 3 pages</li><li data-i="q23">3 versions possibles</li><li data-i="q24">10 retouches possibles</li><li data-i="q25">Déploiement du site inclus</li></ul><span className="pick" data-i="pk">Choisir cette offre →</span></div>
              <div className="glass p3 rv" style={{ "--d": ".24s" } as CSSProperties} data-offer="p3" tabIndex={0} role="button"><h3 data-i="p3">Site complet</h3><div className="amt" data-n="2000">2 000 €</div><ul className="ft"><li data-i="q31">Première version en 72 h</li><li data-i="q32">Jusqu’à 6 pages</li><li data-i="q33">3 versions possibles</li><li data-i="q34">15 retouches possibles</li><li data-i="q35">Déploiement du site inclus</li></ul><span className="pick" data-i="pk">Choisir cette offre →</span></div>
            </div>
            <div className="ask rv"><p data-i="t6">Une question ?</p><button type="button" className="askb" id="askb" data-i="t7">Nous contacter</button></div>
          </div>
        </section>
    </>
  );
}
