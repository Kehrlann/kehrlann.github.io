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
Autour de Python s'est construite une "philosophie", un mode de pensée adopté par les utilisateurs et les développeurs, qui transparait dans le code et dans la façon d'utiliser le langage. Je vous invite à lire les 20 aphorismes qui constituent le "<a href="https://www.python.org/dev/peps/pep-0020/" target="_blank">Zen de Python</a>." Et rappelez-vous, "simple is better than complex".

#### Communauté
La communauté est plutôt respectueuse et constructive, et produit des libs au kilo, en général très pratiques et très bien documentées. Bientôt un article sur la question :) 

#### Puissant !
Python est langage très expressif, et il faut explorer un peu pour l'apprécier. Par exemple, il y a une belle maîtrise des arrays, avec une fonction "map" et une fonction "filter" intégrées :
 
{% highlight python %}
a = [1, 2, 3, 4, 5]

# Les valeurs au carré (fonction "map")
squared = [x*x for x in a]  
#   -> donne [1, 4, 9, 16, 25]

# Filtrage
odd = [x for x in a if (x % 2) == 1]
#   -> donne [1, 3, 5]
{% endhighlight %}

De plus, Python est multi-paradigme, et les fonctions sont des "citoyens de première classe", ce qui fait qu'on peut les utiliser comme des simples variables, en argument d'autres fonctions. Pour comprendre les concepts de programmtion fonctionnelle, un petit exemple illustré. Supposons qu'on définise à la main les fonctions ajout, soustraction, multiplication, etc.
 
{% highlight python %}
def add(a, b):
    return a + b

def sub(a, b):
    return b - a

add(3, 8)   #   ->  donne 11
sub(8, 3)   #   ->  donne -5

def print_name(func):
    # Petite fonction qui affiche le nom de "func" avant d'exécuter func
    def run(*args, **kwargs):
        if hasattr(func, '__name__'):
            print(func.__name__)
        return func(*args, **kwargs)

    return run
       
add = print_name(add)
sub = print_name(sub)

add(3, 8)   #   ->  print "add" et donne 11
sub(8, 3)   #   ->  print "sub" et donne -5
{% endhighlight %}

Grâce à une facilité de Python, on aurait pu écrire :
{% highlight python %}
@print_name
def add(a, b):
    return a + b

@print_name
def sub(a, b):
    return b - a
{% endhighlight %}

Et ceci n'est qu'une petite fenêtre dans ce que peut faire Python. Il faudra un peu de pratique pour saisir toute l'expressivité du langage !

### The ugly
Ne faites jamais confiance à quelqu'un qui vous vend sa came sans jamais aborder les effets secondaires. Tout n'est pas rose dans le monde de Python, et il y a quelques défauts à sérieusement considérer avant d'en faire son outil n°1.

#### Performance...

#### IDE, imports, tooling


[^1]: Read-Eval-Print Loop, technique qui consiste à avoir un terminal qui lit une ligne, l'évalue, éventuellement affiche le résultat dans la sortie standard, puis rend la main. Plus sur <a href="https://en.wikipedia.org/wiki/Read%E2%80%93eval%E2%80%93print_loop" target="_blank">Wikipédia</a>.
