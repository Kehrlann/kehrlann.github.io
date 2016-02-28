---
layout: post
title:  "Best of de librairies Python"
date:   2015-02-26
categories: [tech, python]
author: Daniel Garnier-Moiroux
---

Comme je l'ai déjà évoqué dans un [post précédent]({% post_url 2015-12-28-python-c-est-bon %}),
j'apprécie beaucoup le langage Python, notamment pour la qualité des outils et
des libriaires disponibles. Voici une petite compilation de quelques libs qui
m'ont tapé dans l'oeil, plus ou moins récentes.

## Pour les programmes en ligne de commande

### click - transformer une fonction en utilitaire ligne de commande

<a href="http://click.pocoo.org/6/" target="_blank">Click</a> est une petite lib écrite
par <a href="http://lucumr.pocoo.org/about/" target="_blank">Armin Ronacher</a>
(<a href="https://github.com/mitsuhiko" target="_blank">github</a>).
Elle permet de créer rapidement des applis Python
à utiliser en ligne de commande, avec une simple fonction. L'API  est à la fois
pratique et élégante, et évite de se taper tout le parsing et la validation des
arguments à la main. Un petit exemple, pour un programme qui prend un user et un
password en ligne de commande :

{% highlight python %}
import click

@click.command()
@click.option("-u", "--user", type=str, prompt=True, help="Le login de connexion.")
@click.option("-p", "--password", type=str, prompt=True, hide_input=True, help="Le mot de passe.")
def login(user, password):
    """Petit utilitaire en ligne de commande pour se connecter à ..."""
    if user != "toto":
        print("Utilisateur inconnu")
    elif password != "secret":
        print("Mot de passe incorrect")
    else:
        print("Bienvenue, %s !" % user)

if __name__ == "__main__":
    login()
{% endhighlight %}

C'est beaucoup plus facile à mettre en oeuvre qu' `argparse` ; et beaucoup plus
clair, je trouve, que `docopts`, la validation est faite en amont, et en plus on
a doit à une page d'aide, en faisait par exemple `python myscript.py --help` :


{% highlight text %}
Usage: myscript.py [OPTIONS]

  Petit utilitaire en ligne de commande pour se connecter à ...

Options:
  -u, --user TEXT      Le login de connexion.
  -p, --password TEXT  Le mot de passe.
  --help               Show this message and exit.
{% endhighlight %}


### TQDM, des progress-bar en ligne de commande

<a href="https://github.com/noamraph/tqdm" target="_blank">tqdm</a> permet de
créer des progress-bar sur un iterable comme un tableau, des résultats sql, etc.
Très pratique par exemple pour les sysadmin qui créent des petits scripts de
batch et qui veulent un retour visuel.

{% highlight python %}
from tqdm import tqdm
import time

for i in tqdm(range(42), desc="Counting"):
        time.sleep(.1)
{% endhighlight %}

Ce qui produira une sortie dans STDOUT qui ressemblera à :

{% highlight text %}
Counting:  29%|██████               | 12/42 [00:01<00:03,  9.95it/s]
{% endhighlight %}


Web :
flask
itsdangerous
requests
voluptuous -> https://github.com/alecthomas/voluptuous

Tools :
q -> https://pypi.python.org/pypi/q
tinydb !
kenneth reitz -> records
