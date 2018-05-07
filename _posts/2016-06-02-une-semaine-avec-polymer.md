---
layout: post
title:  "Une semaine avec Polymer"
date:   2016-06-02
categories: [tech, javascript, Polymer]
author: Daniel Garnier-Moiroux
excerpt:    Feedback sur l'utilisation du framework JavaScript Polymer de Google.
---

<div id="cover-pic" class="text-center">
    <img src="/assets/2016-06-02-polymer.jpg" title="Logo Polymer" />
</div>

Ah ! Les frameworks JavaScript pour le web... il en sort 12 par an, et à chacun sa philosophie, à chacune sa petite spécificité, son tooling, etc. Il est loin, le temps où on bidouillait du HTML à la main à grands coups de jQuery. Pour ma part, j'ai fait pas mal de Angular 1.X, notamment pour de gros projets professionnels, mais j'ai également eu l'occasion de tester Angular 2 et React sur des petits projets persos, ce qui m'a permis d'avoir un peu de recul sur les philosophies de frameworks JS "à la mode".

Tout récemment, j'ai pris un peu de temps pour jouer avec <a href="https://www.polymer-project.org" target="_blank">Polymer</a>, un autre framework publié par Google. Pour voir à quoi ça ressemble, une <a href="https://ratp.garnier.wf/" target="_blank">démo</a> et le <a href="https://github.com/Kehrlann/pwa-ratp/" target="_blank">repo github</a> associé.

## Polymer, le framework
Polymer est avant tout un micro-framework, qui permet de mettre en oeuvre la spec "<a href="http://webcomponents.org/" target="_blank">Web Components </a>" du W3C. En gros, il s'agit de créer vos propres tags HTML, avec leur look and feel, leur logique propre et leurs événements personnalisés : c'est un peu l'idée d'Angular avec les Components et autres Directives, ou de React avec les Classes. Ici, on vous offre une gestion d'événements agréable, des facilités de templating HTML (dom-if, dom-repeat) et du databinding. Et c'est tout. Pas de foultitude de services comme AngularJS, c'est beaucoup plus proche de React : à vous d'inventer l'organisation de votre appli, le cycle de vie des composants, la gestion des données, etc.

Polymer marche principalement à coup <a href="http://www.html5rocks.com/en/tutorials/webcomponents/imports/" target="_blank">d'imports HTML</a>. Il n'est plus nécessaire d'avoir un outil de build compliqué (on vous regarde, grunt, gulp, webpack et consorts) pour packager son appli, il suffit d'utiliser un tag HTML simple :

{% highlight html %}
    <!-- import du composant -->
    <link rel="import" href="/components/my-component.html">

    <my-component my-attribute="toto" on-my-event="handleMyEvent">
        <div content>Content !</div>
    </my-component>
{% endhighlight %}

 Alors bien sûr, ce n'est pas le plus efficient, mais, dans un grand nombre de cas, ça fera l'affaire - au moins pour commencer.

À noter que les Web Components ne sont pas supportés nativements par tous les browsers, mais du coup on a droit à un traditionnel polyfill ; avec la promesse que ça sera "plus rapide une fois que la spec sera implémentée par tous les browsers".


## Progressive Web Apps, l'autre face de Polymer
Google a un pied sur chaque rive. D'un côté ils portent et poussent Android et ses applis natives, et ils sont en compétition directe avec le modèle Apple et son iEcosystème. D'un autre côté, ils commencent à saper le concept même d'App Store avec les <a href="https://developers.google.com/web/progressive-web-apps/" target="_blank">Progressive Web Apps (PWA)</a>. Ce sont des sites webs, conçus avec l'idée de les faire tourner sur mobile. Ils faut qu'ils :

- aient un look & feel très "app"
- chargent vite
- aient un <a href="http://www.html5rocks.com/en/tutorials/service-worker/introduction/" target="_blank">service worker</a> déclaré
- donc fonctionnent en mode offline
- soient servis en https

Ca permet à ces "applis" de bénéficier de la plateforme web, beaucoup plus ouverte qu'un store, de la "discoverability" par liens hypertextes, tout en évitant les processus de publication et de qualification d'un app store. Si cette vision l'emporte, exit l'app store, retour au web : les revenus publicitaires glissent directement ou presque de la poche d'Apple à celle de Google.

Pour une première appli, il n'y a pas besoin du package complet, il faut simplement avoir un service worker, un site en HTTPS, et puisque c'est le but, un look & feel "app-y". Pour avoir bossé sur une PWA à la main (création du service worker, du minimum vital à charger immédiatement, etc) : même en ne faisant que les étapes importantes, c'est très long et pas fun du tout. En plus, comme la plupart des API natives pondues par le W3C, l'API des service workers est assez ... aride. Pas très naturelle, en tout cas. Mais c'est là qu'intervient Polymer.

Il faut avouer que, pour du web, ça ressemble vraiment à une appli native :

<div id="cover-pic" class="text-center">
    <img src="/assets/2016-06-02-demo-ratp.png" title="Appli construite avec Polymer" />
</div>


## Polymer, la boîte à outil
Car Polymer, en plus d'être un micro-framework, c'est aussi une méga-toolbox, orientée pour faire les apps sur la plateforme web.
Polymer propose un nombre impressionnant de composants pré-packagés, appelés <a href="https://elements.polymer-project.org/" target="_blank">Elements</a>.

- Il y a notamment tout le package "paper" qui propose des éléments graphiques calqués sur les principes <a href="https://material.google.com/" target="_blank">Material Design</a> de Google : des fenêtres modales, des cards, des floating action buttons... De quoi très facilement faire un clone d'appli Android, mais en HTML.
- Il y a également des Elements "platinum" qui permet, en quelques lignes, de créer et maintenir un service worker, sans avoir à se taper les affreuses APIs natives.
- Pour tout les éléments techniques, les Elements "iron" sont parfaits : data-binding sur des ressources HTTP, wrappers Flexbox, etc.

Et tout ces éléments sont de pures balises HTML, à placer dans la page, la plupart du temps dans avoir à écrire une ligne de JavaScript !

{% highlight html %}
    <!-- import des composants polymer -->
    <link rel="import" href="/bower_components/paper-toast/paper-toast.html">
    <link rel="import" href="/bower_components/platinum-sw/platinum-sw-register.html">
    <link rel="import" href="/bower_components/platinum-sw/platinum-sw-cache.html">

    <!-- ajout d'un "toast" à afficher sur certaines actions -->
    <paper-toast    id="addingCard"
                    duration="2000"
                    text="Favori ajouté !">
    </paper-toast>

    <!-- enregistrement d'un service worker -->
    <platinum-sw-register   auto-register
                            clients-claim
                            skip-waiting
                            href="/sw-import.js"
    >
        <platinum-sw-cache default-cache-strategy="networkFirst">
        </platinum-sw-cache>
    </platinum-sw-register>

    <!-- reste du site -->
    <div>...</div>
{% endhighlight %}

Selon la plaquette de pub Polymer, ce serait un développement "déclaratif", par rapport à un truc plus Javascript, plus "impératif". Ils fournissent néanmoins un certain nombre de handlers pour customiser tous ces éléments : paramètres de configuration, méthodes, styling css, events spécifiques.

Bref, la promesse de faire une WebApp sans avoir à se salir les mains, tout en ayant la possibilité dépasser le cadre initial.

Mais tout n'est pas rose dans le monde des bisounours de Google.


## Une courbe d'apprentissage vallonnée
Ca s'améliore de semaine en semaine, mais, quand j'ai commencé à jouer avec, je ne comprenais même pas ce qu'était Polymer. Ce n'était pas vraiment expliqué sur le site, ou très mal. Ils mettaient beaucoup en avant leurs "Elements" réutilisables - qui sont certes très sexy, mais sans contexte, on se retrouve un peu comme une poule devant une brosse à dents.

La courbe d'apprentissage est très étrange. Ca s'apprend plutôt bien, alors on progresse vite, on prend confiance, on essaye des choses nouvelles et là, on tombe sur un gros, gros os - mais comment on fait pour mettre en forme tel élément ? mais pourquoi mes requêtes http ne fonctionnent pas ? et cette scrollbar qui flotte au milieu de l'écran, c'est quoi ce bazar ?!

Ca manque d'un vrai quickstart pour faire une petit appli complète, la doc est simple mais parfois trop synthétique, il manque les petits détails qui expliquent vraiment le comportement de leurs éléments. Heureusement, on finit par prendre le rythme, et à comprendre où chercher les ressources. Tout d'abord, quoique succinte, la doc est plutôt bien construite. De plus, pour chaque élément, il y a des exemples, dont le code source est disponible sur Github, et c'est probablement ça qui vous sauvera la vie. Enfin, tout le projet est open source, et commes les éléments sont eux-mêmes construits avec Polymer, c'est une excellente source d'inspiration.

Il y a aussi une excellente chaîne Youtube consacrée à Polymer, avec des tutoriaux produits par Google, les <a href="https://www.youtube.com/playlist?list=PLOU2XLYxmsII5c3Mgw6fNYCzaWrsM3sMN" target="_blank">Polycasts</a>. Le sympathique Rob Dodson y détaille l'utilisation des différents Elements, ce qui permet de comprendre les détails obscurs non abordés dans la doc, mais surtout donne un aperçu de l'esprit dans lequel ces Elements ont été conçus.


## Les limites du modèle
Et il est vraiment crucial de comprendre l'esprit derrière chaque élément. En effet, comme c'est du pur HTML 5, on peut faire à peu près ce qu'on veut avec Polymer ... Mais à quel coût ? Les éléments ont été faits avec un certain cas d'usage en tête, et on a beaucoup facilité à les assembler. Du coup, on a envie de  personnaliser son appli, de tout contrôler, de faire de belles transitions, de créer des services pour bien partager les données, etc. Et là le cadre devient rapidement contraignant. Envie d'une popup qui prend toute la hauteur de l'écran mais pas forcément toute la largeur en utilisant une paper-dialog ? Il va falloir se taper le code de la popup. Et débugger au ChromeDevTools[^1]. Envie de faire du databinding magique grâce à iron-ajax ? Dommage, vos données sont uniquement en XML, il va falloit écrire des handlers/callbacks pour les requêtes.

Ah, et une grosse limite : la fragmentation Android, vous connaissez ? Des dizaines de versions d'OS différentes, des implémentations de browser toutes plus bizarres les unes que les autres, des tailles et des formats d'écran dans tous les sens ? Ben vous aurez la même chose si jamais vous vous écartez du chemin d'un millimètre. Mon exemple personnel : les flexbox ne sont pas pareilles sur un Chrome Desktop récent et sur un Android 6.0 Lollipop, je me suis retrouvé à utiliser des positions absolues par endroit, là où flex faisait l'affaire sur desktop mais pas sur mobile ; ou vice-versa.


## Un tooling moyen
Parce que je n'ai pas trouvé de bonne transition pour amener cette partie, voici quelques élements en vrac sur le tooling :

- (+) Bower pour récupérer les Elements : parfait.
- (+) Pas besoin de build son appli, ça marche "out-of-the-box" si on accepte un chargement initial non optimal : excellent idée. Heureusement, d'ailleurs, vu les points négatifs.
- (-) Devoir ajouter à la main des fichiers incantatoires du genre "sw-import.js" : mmmmmmh pas terrible.
- (-) <a href="https://github.com/Polymer/vulcanize" target="_blank">Vulcanize</a>, l'outil qui "compile" l'appli en seul fichier : pas encore ça, notamment avec les problèmes de ServiceWorker, où il faut copier des magic strings et déplacer des dossiers bower...

## Conclusion
J'ai fait des choses très intéressantes avec Polymer. Je me suis arraché les cheveux par moment, mais dans l'ensemble, je me suis beaucoup amusé.

Pour ce qui est des Web Apps en deux clics et 3 lignes de HTML ... D'accord, mais dans un certain format uniquement. Comme toutes les bonnes technos, Polymer est une bonne plateforme pour construire des choses, les premiers pas produisent de jolis résultats et la lecture du code fait progresser à vitesse grand V. Pour le reste, il va falloir se remonter les manches et se salir les mains ! :)



[^1]: Hint : width:500px; postion:absolute; top:0; bottom: 0; left: calc(50vw - 250px - 40px); right: calc(50vw - 250px - 40px); /* Half viewport - (component size/2) - margin */
