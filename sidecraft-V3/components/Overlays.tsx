/** Fenêtres : exemple de site, questionnaire de commande, message de contact.
 * Les attributs data-i relient chaque texte aux traductions FR/DE de public/js/site.js. */
export default function Overlays() {
  return (
    <>
      <div className="ov" id="ov" role="dialog" aria-modal="true"><div className="ovbar"><span data-i="ovh">Vous naviguez dans un exemple de site</span><button type="button" className="ovc" id="ovc" data-i="ovc">Je veux un site comme ça →</button><div className="lang" role="group" aria-label="Langue / Sprache"><button type="button" data-l="fr" className="on"><span className="fl fr"></span>FR</button><button type="button" data-l="de"><span className="fl de"></span>DE</button></div><button className="ovx" id="ovx" aria-label="Fermer">✕</button></div><div className="ovb" id="ovb"></div></div>
      <div className="bkm" id="bkm" role="dialog" aria-modal="true"><div className="bkc glass" id="bkc"><button type="button" className="bkx" data-act="x" aria-label="Fermer">✕</button><div id="bkb"></div></div></div>
      <div className="bkm" id="ctm" role="dialog" aria-modal="true"><div className="bkc sm glass"><button type="button" className="bkx" data-act="x" aria-label="Fermer">✕</button><div id="ctb2"></div></div></div>
    </>
  );
}
