---
layout: post
title:  "Best of de librairies Python"
date:   2016-02-25
categories: [tech, python]
author: Daniel Garnier-Moiroux
---

Comme je l'ai déjà évoqué dans un [post précédent]({% post_url 2015-12-28-python-c-est-bon %}),
j'apprécie beaucoup le langage Python, notamment pour la qualité des outils et
des libriaires disponibles. Voici une petite compilation de quelques libs qui
m'ont tapé dans l'oeil, plus ou moins récemment.

## Pour les programmes en ligne de commande

Langage de prototypage par excellence, Python est souvent utilisé pour faire de
petits utilitaires en ligne de commande - scripts d'archivage, de monitoring,
que sais-je encore ...

### click - transformer une fonction en utilitaire ligne de commande

<a href="http://click.pocoo.org/6/" target="_blank">Click</a> est une petite lib écrite
par <a href="http://lucumr.pocoo.org/about/" target="_blank">Armin Ronacher</a>
(<a href="https://github.com/mitsuhiko" target="_blank">github</a>).
Elle permet de créer rapidement des applis Python
à utiliser en ligne de commande, avec une simple fonction. L'API  est à la fois
pratique et élégante, et évite de se taper tout le parsing et la validation des
arguments à la main. Un petit exemple, pour un programme qui prend en paramètre
un user et un password :

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


## Pour le Web

Python est très apprécié pour le web, comme son cousin éloigné Ruby, et ce grâce
à des frameworks très connus : Django pour l'un, Ruby On Rails pour l'autre.
Mais Django n'est pas l'Alpha et l'Oméga du développement web en Python, et
voici quelques librairies dignes d'attention.

### flask - microframework Web

Vous en avez déjà entendu parler, c'est sûr.
<a href="http://flask.pocoo.org/" target="_blank">Flask</a> est un des frameworks
web les plus connus pour Python. Contrairement à Django, Flask est plutôt simple
et petit : il est même qualifié de microframework - c'est donc  à vous de
choisir quelles libs utiliser pour chaque fonctionnalité à dévélopper : login,
ORM, mail, etc. En fait, ça me fait penser aux outils Javascript qui sont apparus
avec NodeJS, plein de modules à associer les uns aux autres - ca ressemble par
exemple au framework ExpressJS.

Flask est de très loin mon framework web préféré ! C'est un sujet plutôt vaste,on pourrait écrire un article exclusivement là-dessus ... Je vous encourage donc à
aller jeter un oeil à la doc.

Ah ! J'oubliais presque, il a été écrit par Armin Ronacher, cf `click` présenté
ci-dessus ... Vous verrez, ce type est un peu mon héro.


### requests - _le_ client HTTP à utiliser

Si vous avez déjà eu à utiliser `urllib3`, vous aurez remarqué que l'API est
plutôt désagréable à utiliser. Grâce à
<a href="http://docs.python-requests.org/en/master/" target="_blank">requests</a>,
on a enfin accès à une API très naturelle.

{% highlight python %}
import requests

# httpbin.org est un service HTTP très pratique qui renvoie des infos sur la requête
r = requests.post   (   'http://httpbin.org/post',
                        data = {'key':'value'},
                        headers =   {   'x-test':       "toto",
                                        'content-type': "application/json",
                                        'accept':       "application/json"
                                    }
                    )
{% endhighlight %}

Et on récupère le contenu grâce à `r.json()` :

{% highlight text %}
{   'json':     None,
    'url':      'http://httpbin.org/post',
    'files':    {},
    'data':     'key=value',
    'origin':   '81.57.228.136',
    'form':     {},
    'args':     {},
    'headers':  {   'Accept': 'application/json',
                    'Accept-Encoding': 'gzip, deflate',
                    'User-Agent': 'python-requests/2.9.1',
                    'X-Test': 'my-header',
                    'Host': 'httpbin.org',
                    'Content-Type': 'application/json',
                    'Content-Length': '9'
                }
}
{% endhighlight %}


### itsdangerous - pour signer des données

Dès qu'il y a de la gestion d'utilisateur sur le web, il y a de la gestion de
mot de passe, et donc une fonctionnalité de "Mot de passe oublié".

L'approche historique était de générer un token, de le stocker dans une base de
données, puis d'envoyer un mail à l'utilisateur avec un lien contenant ce token
- prouvant ainsi que la personne qui visite la page de reset de mot de passe est
bien autorisée.

L'autre facon de prouver l'identité de l'utilisateur consiste à "signer" des
données, par exemple le mail de l'utilisateur et la date jusqu'à laquelle il a
le droit de reset son mot de passe, et lui envoyer ces informations signées.
Ainsi, pas besoin de sauvegarder ces infos en base de données ; lorsqu'un
utilisateur visite la page de reset, si la signature correspond bien à son adresse
mail, il a le droit de reset le mot de passe.

Une librairie d'Armin Ronacher (décidément) facilite ce genre de process :
<a href="http://pythonhosted.org/itsdangerous/" target="_blank">itsdangerous</a>.

{% highlight python %}
from itsdangerous import URLSafeSerializer
from datetime import datetime, timedelta

# date de validité du lien de reset : 12h
valid_until = datetime.now() + timedelta(hours=12)

s = URLSafeSerializer('ma-clef-top-secrete')
token = s.dumps({ 'user' : 'dgm@blog.com', 'validity' : str(valid_until) })

# le token peut maintenant être envoyé à l'utilisateur
print(token)
#   -> eyJ2YWxpZGl0eSI6IjIwMTYtMDItMjkgMDU6NTg6NDEuNTUxMDM1IiwidXNlciI6ImRnbUBibG9nLmNvbSJ9.k3_2aMJneyS1l2cIEeeZgjgZ_3E

# On peut vérifier qu'un token est valide, et obtenir les données
print(s.loads(token))
#   -> {'validity': '2016-02-29 05:58:41.551035', 'user': 'dgm@blog.com'}

# Et s'il n'est pas valide
print(s.loads(token + "toto"))
#   -> itsdangerous.BadSignature: Signature b'k3_2aMJneyS1l2cIEeeZgjgZ_3Etoto' does not match
{% endhighlight %}


## Vrac !

Il y a des dizaines et des dizaines de librairies de ce genre, et je ne vais pas
toutes les présenter ici - c'est long, d'écrire ... Je vais quand même lister mes trouvailles récentes :

- <a href="https://github.com/alecthomas/voluptuous" target="_blank">voluptuous</a> :
validation de schéma JSON.
- <a href="https://github.com/zestyping/q" target="_blank">q</a> : outils de
logging pour débugger des programmes facilement.
- <a href="https://tinydb.readthedocs.org/en/latest/" target="_blank">Tinydb</a> :
base de données non relationnelle, avec une belle API. Attention, c'est pas fait
pour 15 millions de requêtes par seconde ...
- <a href="https://github.com/kennethreitz/records" target="_blank">Records</a> :
un projet en cours de Kenneth Reitz (l'auteur de requests), pour faire accès
simple à des bases de données : on écrit du SQL, on obtient des résultats. C'est
en cours de développement, mais la lecture du code est très intéressante.
