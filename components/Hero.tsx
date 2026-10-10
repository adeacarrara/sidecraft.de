/** Slogan principal (animé par public/js/site.js).
 * Les attributs data-i relient chaque texte aux traductions FR/DE de public/js/site.js. */
export default function Hero() {
  return (
    <>
      <div className="hero">
          <h1 data-i="h1">Modernisons <em>votre présence en ligne</em></h1>
          <p className="sub" data-i="sub">et éliminons les obstacles à votre croissance.</p>
        </div>
    </>
  );
}
