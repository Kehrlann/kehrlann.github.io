---
layout: post
title:  "Python, c'est bon"
date:   2015-12-28
categories: tech, python
author: Daniel Garnier-Moiroux
---

Quand je démarre un nouveau projet, que ce soit à partir de zéro ou en reprenant une base existante, je me pose systématiquement la question de la <a href="https://en.wikipedia.org/wiki/Technology_stack" target="_blank">technology stack</a> à utiliser, c'est à dire l'ensemble des composants logiciels (et éventuellement matériels) à mettre en oeuvre. Ce sont les outils à disposition de l'ingénieur pour résoudre un ensemble de problèmes donnés.

C'est un choix important, qui doit être réfléchi, sans quoi le risque est de subir une stack inadaptée, que ça soit à cause de l'habitude ("on a toujours fait comme ça") ou à cause de l'existant ("il y avait déjà deux briques logicielles écrites en Jython#.js"), avec les difficultés de développement, les limitations et les surcoûts qui vont avec.

Ce choix est d'autant plus important que les outils disponibles sont de plus en plus nombreux, et changent de plus en plus rapidement. Grâce à une simple connexion internet, je peux obtenir tous les éléments nécessaires pour faire tourner mon projet, et je peux également me former en ligne grâce à de la documentation, des guides de démarrage rapide, des projets open source dont je peux m'inspirer, ou des sites collaboratifs comme StackOverflow grâce auxquels des utilisateurs de tous les horizons pourront répondre à la moindre de mes questions techniques. 


### Qu'est-ce que la tech stack ?
On parle de tech stack pour designer l'ensemble des composants techniques à mettre en oeuvre. Si le terme de "pile" n'est pas tout à fait correct, il souligne la dépendance des composants entre eux : un code Python doit tourner dans un runtime compatible (2.x, 3.x), lui même sur un certain OS que je choisis (Ubuntu 14.04, Windows Server 2012), éventuellement dans un hyperviseur(KVM, VMWare ESXi), sur un serveur matériel donné (HP, Dell) ou chez un provider IaaS (Amazon AWS, Microsoft Azure).

La stack peut être plus complexe, intégrer des bases de données, des clients/serveurs de différents protocoles (http pour le web, SMTP pour le mail, RTSP pour la vidéo), mais, encore une fois, l'important est l'interdépendance des composants - Microsoft SQL server ne tournera pas sur Linux ; et mes scripts bash de synchro de données ne seront pas utilisables sous Windows.

<div id="cover-pic" class="text-center">
    <img src="/assets/2015-11-15-tech_stack.png" title="Exemple de tech stack" />
    <br>
    <i>Un exemple de tech stack pour une petite appli web</i>
</div>


Vous avez sans doute déjà entendu parler de tech stack dans le cadre des ingénieurs ou développeurs dits "full stack", qui devront être capables de maîtriser l'intégralité des composants mis en oeuvre, par opposition à l'approche plus segmentée, avec des développeurs qui ne font que du code fonctionnel, des DBA qui ne font que de la base de données et des exploitants qui ne font que de l'hébergement / gestion de la production. Dans tous les cas, chacun est responsable d'une partie, plus ou moins importante, des technologies utilisées. Dans la configuration "segmentée", on verra sans doute des architectes chargés de mettre en place une certaine cohérence dans les technologies mises en oeuvre.


### Choisir sa tech stack : décider d'investir ?
Démarrer un nouveau projet est une occasion d'investir -du temps, de l'argent- pour découvrir et mettre en oeuvre des technos non maîtrisées, plus récentes, spécifiques à un type de problème. Si vous faites du .NET depuis 10 ans, vous pouvez profiter d'un démarrage de projet pour vous lancer sur un serveur d'intégration de données et de calcul en Scala, ou bien quitter AngularJS pour faire du React.

Ce qui implique de passer du temps à découvrir et apprivoiser la techno, et probablement de faire quelques essais infructueux avant de comprendre comment organiser son projet / son code. Cette phase d'apprentissage fera monter le coût de développement. Alors que si j'utilisais un environnement dans lequel je sais démarrer un projet, je saurais répondre aux différents challenges techniques et modéliser les informations pour résoudre les problèmes business. Je connaitrais également les limites de mes outils, et donc j'aurais un cadre pour définir le fonctionnel de mon application et je minimiserais le risque de m'engager dans des solutions techniques sans issue.

Il y a toutefois des avantages à mettre en oeuvre une nouvelle techno : l'évaluation de son potentiel à répondre à différent types de problèmes ; la formation sur un outil différent, parfois plus adapté au marché (actuel ou à venir) ; l'expérience pour comprendre l'organisation d'un projet utilisant ces technos, et la découverte de nouveaux patterns de développement applicables dans d'autres environnements techniques (ex : programmation fonctionnelle, asynchrone ...).

L'investissement est vital pour se développer, rester pertinent et ne pas s'enfermer dans ses vieilles habitudes et ses technos vieillissantes. Toutefois, il faut bien évaluer la "surface" des expérimentations qu'on veut faire, pour ne pas faire trop de choses à la fois : peut-être d'abord découvrir un langage de programmation et les serveurs associés avant de se lancer dans un nouveau type de DB. Et il y aura, avec un peu de chance, toujours de nouveaux projets pour expérimenter des nouvelles techniques de redondance ou pour tester un provider PaaS / IaaS différent. Se disperser se fait parfois au détriment de l'approfondissement.

Une autre considération importante est la connaissance du problème fonctionnel : s'il y a tout à découvrir, parfois mieux vaut utiliser des technos maîtrisées, qui permettent de se concentrer sur la modélisation des enjeux business. Vous pouvez sans trop de souci vous lancer dans la réalisation d'un n-ième CMS en Rust, mais vous devriez peut-être éviter d'essayer de comprendre à la fois Nim et l'organisation de la paye de tous les fonctionnaires français.


### Considérations techniques et business
Dans tech stack, il y a "tech". Je prends en considération un certain nombre d'aspects techniques quand je choisis ma stack. Un peu dans le désordre :

- Adéquation avec le problème business posé : les caractéristiques du problème fonctionnel sont un des premiers critères de choix. Il s'agit avant tout de choisir les bons outils pour le job. Est-ce que le soft devra supporter 100,000 utilisateurs simultanés ? Est-ce qu'il existe des librairies/DSL[^1] pour modéliser le problème ? Est-ce que le soft est critique et doit tourner en 99,99% ?
- Facilité d'utilisation : les technos trop lourdes ou complexes à mettre en oeuvre sont un frein qui rendent le développement plus long et plus coûteux, donc à éviter.
- Compatibilité / interopérabilité des composants : parce que vouloir faire tourner SQL Server sur FreeBSD, c'est mal barré. Mieux vaut choisir une stack un peu solide, dont les composants sont connus pour interagir ensemble. C'est particulièrement valable pour les reprises de projet : on évitera d'accumuler des couches et des couches toujours un peu plus incohérentes et inmaintenables.
- Maturité / stabilité / adoption de la techno : la stabilité de la techno doit correspondre au type de projet. Plus le projet est gros et destiné à tourner longtemps, plus on privilégiera un socle stable, pas trop buggué, qui ne change pas tous les 6 mois. Un autre aspect important est l'existence d'une "communauté" d'utilisateurs, qui, en l'utilisant, vont la tester, la pousser dans ses retranchements, et donc donner davantage de confiance en sa stabilité. Et, en bonus, faire foisonner les questions / réponses sur StackOverflow. Je miserais plutôt sur Java et ses <a href="https://stackoverflow.com/questions/tagged/java" target="_blank">plus de 900,000 questions</a> que sur WinDev et ses ... <a href="https://stackoverflow.com/questions/tagged/windev" target="_blank">24 questions</a>.
- Déploiement / intégration continue : pour pouvoir livrer des versions le plus fréquemment possible, pour pouvoir mettre à jour sans y passer 3h à chaque fois, je trouve essentiel d'automatiser le déploiement de mes applis. L'idéal est de faire tout en un seul clic, malheureusement c'est parfois impossible. Il faut surtout définir un temps qui vous semble acceptable pour déployer une version. Disons... 15 minutes ? Une bonne méthode d'évaluation consiste à estimer combien coûte un déploiement en fonction de votre taux horaire. À 100€ de l'heure, ça chiffre très vite, surtout si vous en faites 1 par jour...


Il y a bien sûr beaucoup d'autres critères d'évaluation de sa stack, qui vont être plus ou moins importants en fonction du projet. Par exemple, on peut penser aux licences (à ce qu'elles permettent ou interdisent, leur coût), à l'accès au code source, voire à l'éditeur / à l'équipe de maintainers si open-source, etc.



### Considérations humaines
Il ne faut pas oublier la  dimension humaine des projets : on est quasiment toujours amenés à travailler avec d'autres bipèdes, avec leurs forces et leurs points faibles. Et la technologie peut être un levier formidable pour réaliser de grandes choses à plusieurs... Ou pour détruire un ouvrage de qualité en moins de temps qu'il ne faut pour dire "Larry Ellison m'a tuer".

Une caractéristique que j'apprécie est la capacité d'un outil à faire converger le projet, à canaliser les développeurs dans une direction commune, sans avoir deux personnes à plein temps pour intégrer les travaux de trois autres personnes. Les outils ou techniques qui facilitent la communication ou la descriptiion des interfaces utilisées par les développeurs sont à étudier. Personnellement, je raffole des outils qui facilitent la doc des interfaces au sein du code, par exemple [Swagger](http://swagger.io) pour des APIs REST.

Dans tous les cas, il est important de prendre en considération ce qui se fait et s'utilise dans l'équipe/l'entreprise : le maître-mot est cohérence. Coller du .NET dans une boutique 100% JavaScript ou du FreeBSD dans une équipe "Microsoft ou rien", c'est contre-productif. Personne ne va vouloir travailler sur le projet ; toute nouvelle personne intégrée à l'équipe aura besoin d'une formation importante ; et si vous vous faites renverser par un bus, le projet sera difficilement maintenable par vos collègues. Je ne dis pas qu'il faut choisir une techno et s'y tenir pour la vie... Il faut entretenir son jardin [^2].

Enfin, n'oubliez pas que peut-être, un jour, vous quitterez le projet pour un autre, pour un nouveau poste, ou même aller élever des lamas au Pérou. Alors, en préparation de ce jour, pensez à ceux qui passeront derrière vous. Pensez à toutes ces fois où vous avez repris un projet dans technos obscures ou inadaptées. Et épargnez ça à vos successeurs :)



[^1]: DSL, "Domain Specific Language" : language de programmation dédié à un type de problème précis, plus détails sur <a href="https://fr.wikipedia.org/wiki/Langage_d%C3%A9di%C3%A9" target="_blank">Wikipédia</a>.

[^2]: Un excellent article de Peter Siebel, sur la diversité technologique chez Twitter : <a href="http://www.gigamonkeys.com/flowers/" target="_blank">Laissez fleurir 1000 fleurs, puis déracinez-en 999</a>.
