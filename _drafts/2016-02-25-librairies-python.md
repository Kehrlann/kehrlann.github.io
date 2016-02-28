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
### click - parser d'options
Click est une petite lib écrite par <a href="http://lucumr.pocoo.org/about/"
target="_blank">Armin Ronacher</a> (<a href="https://github.com/mitsuhiko"
target="_blank">github</a>). Elle permet de créer rapidement des applis Python
à utiliser en ligne de commande, avec une simple fonction. L'API  est à la fois
pratique et élégante, et évite de se taper tout le parsing et la validation des
arguments à la main.

{% highlight python %}
import click

@click.command()
@click.option("-u", "--user", type=str, prompt=True)
@click.option("-p", "--password", type=str, prompt=True, hide_input=True)
def login(user, password):
    if user != "toto":
        print("Utilisateur inconnu")
        return
{% endhighlight %}




tqdm

17%|██████▎                               | 7/42 [00:00<00:03,  9.95it/s]

click

Web :
flask
itsdangerous
requests
voluptuous -> https://github.com/alecthomas/voluptuous

Tools :
q -> https://pypi.python.org/pypi/q
tinydb !
kenneth reitz -> records
