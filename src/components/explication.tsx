export default function Explication() {
  return (
    <section className="bg-gradient-to-b from-amber-50 to-orange-50 py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-amber-900 mb-8 text-center">À propos des Plats du Monde</h2>
        
        <div className="space-y-6 text-gray-700">
          <p className="text-lg leading-relaxed">
            Bienvenue sur <span className="font-semibold text-orange-600">Les Plats du Monde</span> ! 
            Notre plateforme est une célébration culinaire des saveurs et traditions gastronomiques 
            du monde entier.
          </p>
          
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
            <h3 className="text-2xl font-bold text-amber-900 mb-4">Notre Mission</h3>
            <p className="text-lg">
              Nous répertorions les plats traditionnels et populaires de tous les pays et cuisines 
              du monde, pour vous permettre de découvrir et explorer la richesse culinaire globale.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
            <h3 className="text-2xl font-bold text-amber-900 mb-4">Comment ça marche ?</h3>
            <p className="mb-4">
              Utilisez notre <span className="font-semibold text-orange-600">barre de recherche</span> pour explorer 
              les plats selon vos intérêts. Vous pouvez rechercher par :
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-4">
              <li className="flex items-start">
                <span className="text-orange-500 font-bold mr-3">🍝</span>
                <span><strong>Type de plat</strong> - Pâtes, Riz, Soupes, Grillades, etc.</span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-500 font-bold mr-3">🍅</span>
                <span><strong>Ingrédients</strong> - Tomate, Ail, Gingembre, Citron, etc.</span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-500 font-bold mr-3">🥩</span>
                <span><strong>Protéines</strong> - Viande, Poisson, Fruits de mer, Légumineuses, etc.</span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-500 font-bold mr-3">🌍</span>
                <span><strong>Région/Pays</strong> - France, Italie, Thaïlande, Japon, Maroc, etc.</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
            <h3 className="text-2xl font-bold text-amber-900 mb-4">Explorez sans limites</h3>
            <p>
              Qu'vous cherchiez une recette spécifique ou que vous vouliez découvrir les spécialités 
              d'une région, notre base de données complète vous offre les réponses. Chaque plat est 
              accompagné de détails sur ses origines, ses ingrédients principaux et sa région d'origine.
            </p>
          </div>
        </div>
      </div>
    </section>





  );
}
    