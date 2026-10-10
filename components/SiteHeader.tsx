/** Barre de navigation fixe (logo, liens, sélecteur FR/DE).
 * Les attributs data-i relient chaque texte aux traductions FR/DE de public/js/site.js. */
export default function SiteHeader() {
  return (
    <>
      <nav className="glass" aria-label="Navigation">
        <a className="logo" href="#top"><span className="lt">sidecraft.de</span><i className="sp s1">✦</i><i className="sp s2">✧</i><i className="sp s3">✦</i><i className="sp s4">✧</i></a>
        <a className="l" href="#prix" data-i="n1">Prix</a>
        <a className="l" href="#portfolio" data-i="n2">Exemples</a>
        <a className="l" href="#nous" data-i="n3">Nous</a>
        <a className="l" href="#contact" data-i="n4">Contact</a>
        <div className="lang" role="group" aria-label="Langue / Sprache"><button type="button" data-l="fr" className="on"><span className="fl fr"></span>FR</button><button type="button" data-l="de"><span className="fl de"></span>DE</button></div>
        <button type="button" className="mb" aria-label="Menu" aria-expanded="false"><span></span><span></span><span></span></button>
      </nav>
    </>
  );
}
