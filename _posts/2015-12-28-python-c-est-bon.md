---
layout: post
title:  "Python, c'est bon"
date:   2015-12-28
categories: [tech, python]
author: Daniel Garnier-Moiroux
---

<div id="cover-pic" class="text-center">
    <img src="/assets/python.png" title="Logo Python" />
</div>

Il y a quelques jours, au hasard d'un projet pro, j'ai eu l'occasion de revenir à mes premières amours, Python, et d'implémenter une petite librairie dans ce langage. J'avais oublié à quel point j'_adore_ Python. C'est à la fois simple comme un jardin Zen et touffu comme la moustache de Nietzsche. Je vous propose un petit tour d'horizon de ce qui m'enchante dans le language.

### The good

#### Syntaxe
La syntaxe de Python est simple, concise et claire. Les conventions de nommage sont faciles à lire. Par exemple, il est recommandé d'utiliser des underscore pour les noms composés de plusieurs mots, plutôt que du CamelCase : `IsValueInRange` deviendra `is_value_in_range`.

{% highlight python %}
def is_value_in_range(value):
    range_start = 42
    range_end = 1337
    return (value >= range_start and value <= range_end)
{% endhighlight %}

Le langage n'est en général pas très verbeux, tout en restant lisible. Par exemple, pas besoin de déclarer des variables avec un mot-clef tel que "var".

Grâce au système des keyword-arguments, on peut donner des valeurs par défaut à certains arguments d'une fonction, pour avoir des appels plus simples, par exemple :

{% highlight python %}
def create_vehicle(name, number_wheels=4, color="black"):
    return { "name" : name, "number_wheels" : number_wheels, "color" : color  }

default_car = create_vehicle("My Car")
print(default_car["color"])     # affiche "black"

red_car = create_vehicle("My Red Car", color="red")
print(red_car["color"])         # affiche "red"
{% endhighlight %}


Un des aspects les plus clivants est le scoping par indentation : les fonctions, classes, structures de contrôle, définissent un scope en forçant à indenter dans ce qui suit. Très longtemps décrié, ce style de programmation a été adopté par d'autres langages, comme CoffeeScript.

{% highlight python %}
def factorielle(n, acc=1):
    """
    Une implémentation "tail-recursive" de la fonction factorielle.

    :param n:   L'entier dont on veut calculer la factorielle
    :param acc: Accumulateur, pour permettre la tail-récursivité. Default : 1.
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
Python est également un excellent langage de prototypage. Pas besoin de compilation, d'IDE ou de mise en place d'une architecture quelconque pour écrire un petit script dans un coin et le tester. Grâce au REPL[^1], on peut tester des morceaux de code sans avoir à lancer un script. L'aide est intégrée grâce à la commande `help(NOM_DE_L_ELEMENT)`, ce qui permet de travailler sereinement offline - parfait pour développer pendant un week-end depuis la ferme familiale dans le Larzac.

{% highlight python %}
help(len)

# Affiche l'aide suivante :
#
# Help on built-in function len in module __builtin__:
#
# len(...)
#     len(object) -> integer
#
#     Return the number of items of a sequence or collection.
{% endhighlight %}

Et, comble du luxe, Python est multi-paradigmes, ce qui permet de démarrer un projet avec des scripts à droite et à gauche puis ensuite de les consolider en un programme propre et structuré très rapidement, par exemple en y ajoutant un modèle objet.

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

L'isolation des "environnements" dans lesquels tournent les applications, avec leurs propres dépendances, leurs propres versions des différents modules, etc, est faite grâce à _virtualenv_, un excellent outil, facile à installer et à utiliser.

De plus, Python est plutôt léger en terme d'utilisation mémoire, par rapport à de plus gros runtimes comme Java, ce qui permet de déployer des process en parallèle sans trop de difficultés (dans un premier temps, en tout cas).


#### Licence
Un petit plus non négligeable, Python est distribué en open-source, comme l'immense majorité des modules.

Sa licence, combinée à la possibilité de déployer sur un Linux, permet de faire des déploiements sans coûts de licence. Quand on a un peu touché à des produits Microsoft, et à l'enfer des licences propriétaires et de leurs revendeurs associés, c'est une bénédiction.

#### Calcul scientifique
Enfin, je ne suis pas concerné par la question, mais il existe de très bonnes librairies de calcul scientifique et d'analyse numérique qui font de Python un des langages de choix de la communauté scientifique... Il paraît que c'est très bien, mais ne me faites pas confiance sur parole :)


### The <span style="text-decoration:line-through;">bad</span> great

#### Philosophie
Autour de Python s'est construite une "philosophie", un mode de pensée adopté par les utilisateurs et les développeurs, qui transparait dans le code et dans la façon d'utiliser le langage. Je vous invite à lire les 20 aphorismes qui constituent le "<a href="https://www.python.org/dev/peps/pep-0020/" target="_blank">Zen de Python</a>."

{% highlight text %}
Beautiful is better than ugly.
Explicit is better than implicit.
Simple is better than complex.
Complex is better than complicated.
Flat is better than nested.
Sparse is better than dense.
Readability counts.
Special cases aren't special enough to break the rules.
Although practicality beats purity.
Errors should never pass silently.
Unless explicitly silenced.
In the face of ambiguity, refuse the temptation to guess.
There should be one-- and preferably only one --obvious way to do it.
Although that way may not be obvious at first unless you're Dutch.
Now is better than never.
Although never is often better than *right* now.
If the implementation is hard to explain, it's a bad idea.
If the implementation is easy to explain, it may be a good idea.
Namespaces are one honking great idea -- let's do more of those!
{% endhighlight %}

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

De plus, Python est multi-paradigme, et les fonctions sont des "<a href="https://fr.wikipedia.org/wiki/Objet_de_premi%C3%A8re_classe" target="_blank">objets de première classe</a>", ce qui fait qu'on peut les utiliser comme des simples variables, en argument d'autres fonctions. Pour comprendre les concepts de programmation fonctionnelle, un petit exemple illustré. Supposons qu'on définise à la main les fonctions ajout, soustraction, multiplication, etc.

{% highlight python %}
forbidden_funcs = []

def forbidden_modifier(func):
    """
    Ajouter la fonction à la liste des fonctions interdites
    """

    forbidden_funcs.append(func)

    def run(*args, **kwargs):
        if func in forbidden_funcs:
            raise PermissionError("Calling %s is forbidden !" % func.__name__)
        else:
            return func(*args, **kwargs)

    return run

@forbidden_modifier
def my_func(toto, tata, tutu):
    ...
    return titi

def your_func():
    print("hurray !")

my_func(1, 2, 3)
# Renvoie une erreur "Calling my_func is forbidden !""

your_func()
# print "hurray !"
{% endhighlight %}


### The ugly
Ne faites jamais confiance à quelqu'un qui vous vend sa came sans jamais aborder les effets secondaires et les désagréments actuels et potentiels. Levons pudiquement le voile sur quelques défauts.

#### Programmation orientée objet
Comme je l'ai évoqué plus haut, Python permet de faire de la programmation orientée objet. Néanmoins, la syntaxe est parfois un peu lourdingue : par exemple, on doit coller des "self" dans chaque méthode de classe et devant chaque variable. Certes, c'est nécessaire mais ça n'en est pas moins lourd !

{% highlight python %}
class MyClass:

    def __init__(self, my_array, threshold=10):
        self.my_array
        self.threshold = threshold

    def count_value_in_array(self, value):
        res = 0
        for element in self.my_array:
            if value == element:
                res = res + 1
        return res

    def is_value_above_threshold(self, value):
        return self.count_value_in_array(value) > self.threshold

{% endhighlight %}

De plus, il "manque" un certain nombre de fonctionnalités par rapport à d'autres langages. Par exemple, le concept d'interface n'est pas natif au langage, et, si on peut s'en sortir grâce à l'héritage multiple et aux classes abstraites, ce n'est pas très plaisant à utiliser.


#### IDE, imports, tooling
S'il y a des bons outils pour travailler avec Python, comme l'éditeur <a href="http://www.jetbrains.com/pycharm" target="_blank">PyCharm de Jetbrains</a>, ils sont payants. Pour le reste, les outils sont plus ou moins puissants, plus ou moins bien intégrés. Les fanas de Linux s'en sortiront avec un vim ou un emacs customisé, mais pour un débutant sur Windows, c'est rude. J'ai essayé il y a longtemps Eclipse pour Python mais j'avais été très déçu par l'expérience. L'autocomplétion, notamment, n'est pas au top.

Enfin, le système d'import et de gestion de dépendances, à base de "modules" et de "packages" est difficile à appréhender par un débutant. L'absence d'IDE standard qui règle tous ces problèmes en permettant de lier les projets entre eux rend les choses encore plus difficiles pour un débutant.

#### Support Windows
L'intégration Windows est un peu hasardeuse ... Il est toujours possible de développer en Python sur Windows, mais avec certaines difficultés. Par exemple un certain nombre de packages se basent sur des binaires compilés notamment pour Linux. Il alors faudra trouver des portages spécifiques Windows et les installer à la main sans passer par pip.

#### Performance...
Enfin, la critique la plus féroce concerne la performance. En terme de vitesse d'éxécution, Python est très loin derrière les langages compilés (pensez : C++) ou à machine virtuelle (pensez : Java, C#), et même loin derrière d'autres concurrents comme JavaScript. Nativement, Python est très mauvais en parallélisme, à cause de choix de design qui persistent après plus de vingt ans.

Bien sûr, il y a de multiples remèdes pour ces problèmes de performance : par exemple du parallélisme avec Twisted, et même un runtime Python alternatif, écrit en Python, appelé PyPy (le runtime officiel étant CPython, écrit en C).


### Conclusion
Python ne répond pas à tous les cas d'usage, mais c'est un outil très puissant, pratique et agréable à l'usage. Il permet de démarrer un projet rapidement, et de le consolider au fur et à mesure pour en faire un produit robuste et de qualité, déployable en production. J'espère vous avoir donné envie d'installer Python et de découvrir ce langage que j'apprécie énormement, d'abord pour jouer un peu avec, puis, si vous accrochez, vous lancer dans des projets plus complexes.

Pour donner une idée, ma dernière appli était un petit proto de retro-engineering de protocole propriétaire - grâce à Python j'ai pu déclencher en TCP l'extraction de vidéos stockées dans un enregistreur, et recomposer les vidéos ainsi téléchargées, le tout en trois fichiers et 300 lignes de code.



[^1]: Read-Eval-Print Loop, technique qui consiste à avoir un terminal qui lit une ligne, l'évalue, éventuellement affiche le résultat dans la sortie standard, puis rend la main. Plus sur <a href="https://en.wikipedia.org/wiki/Read%E2%80%93eval%E2%80%93print_loop" target="_blank">Wikipédia</a>.
