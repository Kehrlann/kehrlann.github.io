---
layout: post
title:  "Faire passer un entretien technique"
date:   2017-02-15
categories: [tech, recrutement]
author: Daniel Garnier-Moiroux
---

Il y a quelques semaines, j'ai eu l'occasion de faire passer un entretien technique,
chez un client. Ils recherchaient un profil technique, senior et plutôt autonome.
Le candidat devrait travailler sur des sujets *legacy* assez compliqués, tout en
s'interfaçant avec l'équipe.

Comme je maîtrisais bien les sujets en question, mon client m'a demandé de mener
l'entretien. Spoiler alert : ça n'a pas été une franche réussite, mais c'est une
bonne occasion d'en tirer quelques réflexions.


### Toujours prêt !
J'ai été prévenu un peu au pied levé, le matin pour l'après-midi. J'ai survolé le
CV du candidat, sans vraiment y prêter attention. Première erreur ! Dans tous les
cas, il faut venir préparé. Si on veut rater un entretien, voire faire mauvaise
impression à un candidat prometteur, rien de pire que d'arriver les mains dans les
poches. D'ailleurs, qu'est-ce que vous penseriez, vous, d'un candidat qui arrive
les mains dans les poches ? Donc, dans un premier temps, il faut se renseigner sur
le parcours du candidat, et le CV est un bon point de départ. Il permet évenutellement
de travailler sur la trajectoire du candidat, pourquoi il répond à cette offre
d'emploi, est-ce que c'est cohérent, etc.


Ca peut évident, mais l'étape la plus cruciale de la préparation, c'est de définir
les objectifs de l'entretien. Qu'est-ce que l'entreprise attend de cette rencontre ?
Qu'est-ce qu'on cherche à savoir ?

- La capacité technique du candidat sur des sujets précis
- S'il est autonome
- S'il est capable de reconnaître les difficultés et poser des questions
- Sa capacité à communiquer
- ...

Avec une meilleure idée des attentes, on peut commencer à construire un entretien
structuré, en plusieurs partie, par exemple :
1. Présentation de l'entreprise
2. Le candidat présente son parcours
3. Discussion autour du parcours du candidat
4. Questions / exercices techniques
5. Feedback de la part du candidat
6. Feedback de la part des employés faisant passer l'entretien,

Une fois le programme mis en place, il est non négligeable de timeboxer les étapes,
pour équilibrer l'entretien et ne pas arriver le faire durer plus que nécessaire.
En plus, ca donne une indication au candidat sur ce qui est attendu de lui.


### Relations avec le candidat
Le candidat qui arrive en entretien vous rencontre pour la première fois, ne connait
pas les codes de l'entreprise, et, fréquemment, est assez stressé. Il peut donc gaffer,
ne pas comprendre les attendus, rater des points cruciaux dans la culture ou dans
la façon de travailler. Le but étant d'embaucher les bons profils, il faut créer
des conditions où les points forts peuvent pleinement s'exprimer.

Pour briser un peu la glace, faire parler le candidat lui permet de "s'échauffer"
avant les sujets difficiles. Lui faire présenter rapidement son parcours est un bon
moyen de se lancer, en maîtrisant le sujet, il est sûr qu'il n'y a pas de piège.

Ensuite, afin d'éviter au maximum toute incompréhension, il faut être explicite
sur les attentes. Par exemple, on avant un exercice de code, on peut dire "le but
de l'exercice est de tester un peu la logique, de voir l'aspect itératif de la
construction du code, et de voir comment vous réflechissez". Ou bien, à l'inverse,
"le but de l'exercice est de mesurer votre connaissance des aspects asynchrones de
.NET".

Vous pouvez être amené à demander un livrable à réaliser après l'entretien. Dans
le cas du profil senior présenté, on lui a demandé de rédiger une petite synthèse
des sujets techniques abordés pendant l'entretien, et de proposer une ou des approches.
Il faut prévenir *avant* l'entretien, pour que le candidat soit dans le bon état
d'esprit, prenne des notes, etc.


### Technique
Si vous recrutez un profil technique, je recommande vivement de faire un exercice
technique. En fonction du poste à pourvoir, ça peut être un exercice de conception,
d'architecture, de code, de bugfix. Mais il faut tester les candidats. Vous seriez
surpris de voir combien sont incapables de faire un simple <a href ="https://en.wikipedia.org/wiki/Fizz_buzz#Programming_interviews" target="_blank">FizzBuzz</a>.
Pourtant les règles sont triviales :
- pour tous les entiers i entre 1 et 100,
- si i est divisble par 3, afficher "Fizz",
- si il est divisible par 5, afficher "Buzz",
- si il est divisible par 3 et 5, afficher "FizzBuzz",
- et dans tous les autres cas, afficher i.

Un développeur normal devrait pouvoir faire l'exercice en une minute.
Essayez, vous serez surpris - <a href ="https://blog.codinghorror.com/why-cant-programmers-program/" target="_blank">et vous ne serez pas les seuls</a>.

Prévoyez des exercices suffisamment souples pour vous permettre d'explorer des sujets
différents, et des niveaux de difficulté différents, adaptés au candidat. Le but
est de voir comment il travaille, comment il se/vous pose des questions, comment il
fait des essais/erreurs, etc.

J'aime bien l'idée d'autoriser l'accès à Internet pendant l'entretien - après tout,
c'est une partie intégrante de notre travail quotidien, et voir le candidat faire
des recherches est très instructif. Quels sont ses réflexes ? Ses sites de référence
? Est-ce qu'il sait formuler ses questions pour un moteur de recherche ?


### Clôturer l'entretien
Forcer des questions de la part du candidat à la fin
"comment vous vous êtes trouvé"


### Divers

J'ai également été amené à faire passer des entretiens à des profils plus juniors,
qui présentent des problématiques différentes : en général, le candidat a assez peu
de compétences techniques, on va plutôt
