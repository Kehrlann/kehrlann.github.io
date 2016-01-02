---
layout: post
title:  "Python, c'est bon"
date:   2015-12-28
categories: tech, python
author: Daniel Garnier-Moiroux
---

<div id="cover-pic" class="text-center">
    <img src="/assets/python.png" title="Logo Python" />
</div>

Il y a quelques jours, au hasard d'un projet pro, j'ai eu l'occasion de revenir à mes premières amours, Python, et d'implémenter une petite librairie dans ce langage. J'avais oublié à quel point j'_adore_ Python. C'est à la fois simple comme un jardin Zen et touffu comme la moustache de Nietzsche. Je vous propose un petit tour d'horizon de ce qui m'enchante dans le language.

### The good

#### Syntaxe
La syntaxe de Python est simple, concise et claire. Les conventions de nommages sont facile à lire. Par exemple, il est recommandé d'utiliser des underscore pour les noms composés de plusieurs plutôt que du CamelCase : `MyPersonLoader` deviendra `my_person_loader`. Le langage n'est pas très verbeux, sans en devenir illisible - bon, en programmation orientée objet il y a quand même du `self` partout. Grâce au système des keyword-arguments, il y a des valeurs par défaut dans les fonctions qui permettent de ne passer que certains paramètres à une fonction.

Un des aspects les plus clivants est le scoping par indentation : les fonctions, classes, structures de contrôle, définissent un scope en forçant à indenter dans ce qui suit. Très longtemps décrié, ce style de programmation a été adopté par d'autres langages, comme CoffeeScript.

{% highlight python %}
def factorielle(n, acc=1):
    """
    Une implémentation "tail-recursive" de la fonction factorielle.

    :param n:   L'entier dont on veut calculer la factorielle
    :param acc: Accumulateur, pour permettre la tail-récursivité. Utilisé en interne uniquement.
    """
    if n <= 0:
        return 1
    else:
        return factorielle(n-1, n*acc)

# Hop, on fait le calcul ici
result = factorielle(5)
print(result)
{% endhighlight %}


#### Prototypage
Python est également un excellent langage de prototypage. Pas besoin de compilation, d'IDE ou de mise en place d'une architecture quelconque pour écrire un petit script dans un coin et le tester. Grâce au REPL[^1], on peut tester des morceaux de code sans avoir à lancer un script. L'aide est intégrée grâce à la commande `help(NOM_DE_L_ELEMENT)`, ce qui permet de travailler sereinement offline - oui oui, on peut aimer le développement et l'élevage de chèvres dans le Larzac.

Et, comble du luxe, Python est multi-paradigme, ce qui permet de démarrer un projet avec des scripts à droite et à gauche puis ensuite de les consolider en un programme propre et structuré très rapidement, par exemple en y ajoutant un modèle objet. 

#### Modules
La gestion des modules est réalisée avec l'outil _pip_, pour _Pip Installs Packages_, qui va chercher directement les packages dans le repository unifié de Python : <a href="https://pypi.python.org/pypi" target="_blank">PyPI</a>. 

La richesse de Python vient en grande partie du nombre de packages disponibles. Si vous avez besoin de quelque chose :

  1. Quelqu'un l'a probablement déjà implémenté,
  2. C'est facile à installer grâce à pip,
  3. Il y a une documentation claire et concise,
  4. La source est disponible

Je romance peut-être un peu, mais c'est un sentiment général. Je n'ai qu'un contre-exemple en quelques années d'utilisation : il me fallait une petite lib pour sauvegarder des cookies HTTP sur disque dans une base de données SQLite ... Auto-promotion : j'en ai fait une petite librairie, disponible sur pip (`pip install sqlitecookiejar`) ou sur <a href="https://github.com/timsoft-oss/sqlitecookiejar" target="_blank">Github</a>.

#### Déploiement
Grâce à pip / setuptools, déployer un programme est très simple. En plus, Python étant interprété, pas besoin de précompiler son projet : on peut directement puller le code directement depuis un repository git et lancer le programme.

L'isolation des "environnements" dans lesquels tournent les applications, avec leurs propres dépendences, leurs propres versions des différents modules, etc, est faite grâce à _virtualenv_, un excellent outil, facile à installer et à utiliser.

De plus, Python est plutôt léger en terme d'utilisation mémoire, par rapport à de plus gros runtimes comme Java, ce qui permet de déployer des process en parallèle sans trop de difficulté (dans un premier temps, en tout cas). 


#### License, 
Un petit plus non négligeable, Python est distribué en open-source, comme l'immense majorité des modules.

Sa licence, combiné à la possibilité de déployer sur un Linux, permet de faire des déploiements sans coûts de license. Quand on a un peu touché à des produits Microsoft, et à l'enfer des licences propriétaires et de leurs revendeurs associés, c'est une bénédiction.


### The <span style="text-decoration:line-through;">bad</span> great

#### Philosophie
-> Zen of python

#### Communauté
- Ils font de tout
- Plutôt respectueux
- C'est beau, et bien documenté

#### Puissant !
- Multi paradigme
- Décorations
- Contextes, itérateurs ...
- Facilité d'utilisation sur les tableaux

### The ugly

#### Performance...

#### IDE, imports, tooling


[^1]: Read-Eval-Print Loop, technique qui consiste à avoir un terminal qui lit une ligne, l'évalue, éventuellement affiche le résultat dans la sortie standard, puis rend la main. Plus sur <a href="https://en.wikipedia.org/wiki/Read%E2%80%93eval%E2%80%93print_loop" target="_blank">Wikipédia</a>.
