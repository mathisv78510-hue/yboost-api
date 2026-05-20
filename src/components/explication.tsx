export default function Explication() {
  return (
    <section className="w-full py-14 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-4xl">🍽️</span>
          <h2 className="text-3xl font-bold text-gray-900 mt-3 mb-2">
            À propos de Plats du Monde
          </h2>
          <p className="text-gray-500">Explorez la richesse culinaire de chaque continent</p>
        </div>

        <div className="space-y-6">
          <p className="text-base leading-relaxed text-center text-gray-600 max-w-2xl mx-auto">
            Bienvenue sur <span className="font-semibold text-gray-900">Plats du Monde</span> !
            Notre plateforme répertorie les saveurs et traditions gastronomiques du monde entier.
          </p>

          <div className="grid md:grid-cols-2 gap-5">
            <div className="bg-white rounded-lg border border-gray-200 p-7 hover:border-orange-300 transition-colors">
              <div className="text-2xl mb-3">🎯</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Notre Mission</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Nous répertorions les plats traditionnels et populaires de tous les pays et cuisines
                du monde, pour vous permettre de découvrir et explorer la richesse culinaire globale.
              </p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-7 hover:border-orange-300 transition-colors">
              <div className="text-2xl mb-3">🔍</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Comment ça marche ?</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Utilisez la <span className="font-semibold text-gray-800">barre de recherche</span> pour explorer
                les plats selon vos intérêts. Filtrez par type, région ou niveau de difficulté.
              </p>
            </div>
          </div>

          <div className="bg-orange-50 rounded-lg border border-orange-200 p-7">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              <div className="text-center">
                <div className="text-3xl mb-2">🍝</div>
                <p className="font-medium text-gray-800 text-sm">Types de plats</p>
                <p className="text-xs text-gray-500 mt-0.5">Pâtes, Riz, Soupes...</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🍅</div>
                <p className="font-medium text-gray-800 text-sm">Ingrédients</p>
                <p className="text-xs text-gray-500 mt-0.5">Tomate, Ail, Gingembre...</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🌍</div>
                <p className="font-medium text-gray-800 text-sm">Régions & Pays</p>
                <p className="text-xs text-gray-500 mt-0.5">France, Thaïlande, Japon...</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🔥</div>
                <p className="font-medium text-gray-800 text-sm">Niveaux de difficulté</p>
                <p className="text-xs text-gray-500 mt-0.5">De doux à très épicé</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg p-7 text-white">
            <h3 className="text-lg font-semibold mb-3">Explorez sans limites</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Que vous cherchiez une recette spécifique ou que vous vouliez découvrir les spécialités
              d'une région, notre base de données complète vous offre les réponses. Chaque plat est
              accompagné de détails sur ses origines, ses ingrédients principaux et sa région d'origine.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
