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
Python est également un excellent langage de prototypage. Pas besoin de compilation, d'IDE ou de mise en place d'une architecture quelconque pour écrire un petit script dans un coin et le tester. Grâce au REPL[^1]
- REPL
- Pas besoin d'archi
- Multi-paradigme : ce qui commence en script peut finir en POO

#### Modules
- Pip
- ya de tout


#### License, déploiement
- Gratuit, open source, accès au code
- Facile à déployer
- Compatible avec des milliards d'outils
- Isolation grâce à virtualenv


#### Léger
- Empreinte mémoire de quelques MO


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


[^1] : Read-Eval-Print Loop, technique qui consiste à avoir un terminal qui lit une ligne, l'évalue, éventuellement affiche le résultat dans la sortie standard, puis rend la main. Plus sur wikipédia : https://en.wikipedia.org/wiki/Read%E2%80%93eval%E2%80%93print_loop
