##Install:

    yarn install
    npm install

##To run the app:
    npm start

##To run test:

    npm test

## TODO-list
[ ] velocidad de respuesta, acierto o fallo

[ ] Si acierto pregunta en menos de 2 segundos (inclusive) - sumo 2 puntos

(0 puntos, pregunta correcta, 1 segundo) -> 2 puntos
(1 punto, correcta, 1 segundo) -> 3 puntos
[ ] Si acierto pregunta entre 3 y 10 segundos (inclusive) - sumo 1 punto

(1 punto, correcta, 5 segundos) -> 2 puntos
(1 punto, correcta, 3 segundos) -> 2 puntos
[ ]Si acierto y tardo mas de 11 segundos (inclusive) - 0 puntos

(1 punto, correcta, 11 segundos) -> 1 punto
(5 punto, correcta, 18 segundos) -> 5 punto
[ ] Si fallo pregunta en mas de 11 segundos (inclusive) - resto 2 puntos

(2 puntos, incorrecta, 11 segundos) -> 0 puntos
(0 puntos, incorrecta, 18 segundos) -> -2 puntos
[ ] Si fallo antes de 10 segundos (inclusive) - resto 1 punto

(1 punto, incorrecta, 3 segundos) -> 0 puntos
(10 punto, incorrecta, 10 segundos) -> 9 puntos
[ ] Si en 20 segundos no has respondido , pasa a siguiente pregunta y pierdes 3 punto

(3 puntos, noContesta, 21) -> 0 puntos
[ ] No se puede pasar sin responder: si en 20 segundos no ha respondido, pierde 3 puntos

(3 puntos) -> 0