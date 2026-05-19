export default function Explication() {
  return (
    <section className="w-full bg-gradient-to-b from-white via-orange-50/30 to-white py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <span className="text-5xl">🍽️</span>
          </div>
          <h2 className="text-5xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-3">
            À propos de Plats du Monde
          </h2>
          <p className="text-lg text-gray-600">Explorez la richesse culinaire de chaque continent</p>
        </div>
        
        <div className="space-y-6">
          <p className="text-lg leading-relaxed text-center text-gray-700 max-w-2xl mx-auto">
            Bienvenue sur <span className="font-bold text-orange-600">Plats du Monde</span> ! 
            Notre plateforme est une célébration culinaire des saveurs et traditions gastronomiques 
            du monde entier.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="group relative bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 p-8 border border-orange-100 hover:border-orange-300 overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-100 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="text-3xl mb-3">🎯</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Notre Mission</h3>
                <p className="text-gray-700 leading-relaxed">
                  Nous répertorions les plats traditionnels et populaires de tous les pays et cuisines 
                  du monde, pour vous permettre de découvrir et explorer la richesse culinaire globale.
                </p>
              </div>
            </div>
            
            <div className="group relative bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 p-8 border border-orange-100 hover:border-orange-300 overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-red-100 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="text-3xl mb-3">🔍</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Comment ça marche ?</h3>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  Utilisez notre <span className="font-bold text-orange-600">barre de recherche</span> pour explorer 
                  les plats selon vos intérêts. Filtrez par :
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-2xl border border-orange-200 p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center group">
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">🍝</div>
                <p className="font-semibold text-gray-900 text-sm">Types de plats</p>
                <p className="text-xs text-gray-600 mt-1">Pâtes, Riz, Soupes...</p>
              </div>
              <div className="text-center group">
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">🍅</div>
                <p className="font-semibold text-gray-900 text-sm">Ingrédients</p>
                <p className="text-xs text-gray-600 mt-1">Tomate, Ail, Gingembre...</p>
              </div>
              <div className="text-center group">
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">🌍</div>
                <p className="font-semibold text-gray-900 text-sm">Régions & Pays</p>
                <p className="text-xs text-gray-600 mt-1">France, Thaïlande, Japon...</p>
              </div>
              <div className="text-center group">
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">🔥</div>
                <p className="font-semibold text-gray-900 text-sm">Niveaux de piquant</p>
                <p className="text-xs text-gray-600 mt-1">De doux à très épicé</p>
              </div>
            </div>
          </div>

          <div className="group relative bg-gradient-to-br from-orange-600 to-red-600 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 text-white overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-4">✨ Explorez sans limites</h3>
              <p className="leading-relaxed text-orange-50">
                Qu'vous cherchiez une recette spécifique ou que vous vouliez découvrir les spécialités 
                d'une région, notre base de données complète vous offre les réponses. Chaque plat est 
                accompagné de détails sur ses origines, ses ingrédients principaux et sa région d'origine.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>





  );
}
    