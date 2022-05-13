# CABIFY: back-end bootcamp challenge


## Eaters
- Muestra todos los eaters
- Permite añadir nuevos eaters, siempre y cuando:
    - Todos los inputs estén completos (name + email)
    - El email no esté ya registrado
- Permite borrar todos los registros (eaters + restaurants)


## Restaurants
- Muestra todos los restaurants
- Permite añadir nuevos restaurants, siempre y cuando:
    - Todos los inputs estén completos (name + adress)
    - El name no esté ya registrado

** Permite borrar los registros de restaurants - sólo es necesario para correr determinados tests, y no para el flujo normal de la app


## Groups

Para gestionar la información de los grupos, he visto necesario hacer dos modelos: subgroups y groups. 

El primero, sería relativo a cada mini grupo, con su leader, eater y restaurant.
El segundo, almacena conjuntamente todos los subgrupos que se generan cada vez que se organiza un plan.

### 1. Subgroups

En esta ruta, se crean los subgrupos necesarios a partir del número máx de personas por grupo, y sabiendo que la diferencia solo puede ser de +/- 1

· He priorizado que los grupos sean lo más grandes posibles, en lugar de que tengan la misma longuitud y sean más pequeños.

· Dos subgrupos no pueden ir al mismo restaurante. Si no hay registros de restaurantes suficientes como para todos los grupos de personas creados, entonces salta en aviso.

· No permite re-crear nuevos subgrupos para los mismos registros de eaters y restaurants. El flujo sería:

<img src="https://res.cloudinary.com/clarapardo/image/upload/v1652426557/Untitled_Workspace_fqnorl.png" alt="Flow diagram"/>


** Me pareción interesante guardar los eaters y restaurantes como objetos dentro de la estructura de subgrupos, para que tuviesen la máx info posible con la que jugar (_id, fecha y hora, email, name, adress) de cara a añadir funcionalidades extra que había pensado... pero no dió tiempo al final

** No está acabada la función que analiza si alguién ya fue líder en el último grupo creado para impedir que se repita. En el doc de utils lo hace bien, pero después no retorna bien el valor al doc de la ruta. (Está comentado en el código)

### 2. Groups

Envía el último conjunto de subgrupos creados, y reindexa la información para mandar un json con sólo el name de los inputs y no el objeto completo.



## TESTS

He tenido problemas a la hora de entender la asincronía de los test. He llegado a la conclusión de que al ejecutarse todos a la vez, interfieren entre ellos y salen mal (ej.: para un test necesitas que no haya restaurantes disponibles, pero al mismo tiempo se está ejecutando otro test que los está creando, entonces el primero de ellos no se está testeando en las condiciones en las que lo tiene que hacer y sale mal).
No he conseguido averiguar como hacer que se ejecuten de manera individual uno por uno, pero he encontrado el método skip...

Para que no haya conflictos, se tendrían que ejecutar de la siguiente manera: 
- Test de eater y restaurants activos - y test de subgroups en .skip
- Testar UNO A UNO todos los test de subgroups - y los test de eater y restaurants en .skip

(Los test de groups se pueden ejecutar en todo momento y no hay conflicto)
