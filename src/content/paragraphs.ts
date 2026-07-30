import type { ParagraphCategory, ParagraphEntry, ParagraphMode } from './types';

export interface ParagraphCategoryDetail {
  id: ParagraphMode;
  name: string;
  shortName: string;
  description: string;
  musicName: string;
  musicDescription: string;
}

interface ParagraphDraft {
  text: string;
  sourceReference?: string;
}

const categoryDetails: readonly ParagraphCategoryDetail[] = [
  { id: 'classic', name: 'Clásico', shortName: 'Clásico mixto', description: 'Una mezcla serena de todas las colecciones para acompañar distintos momentos.', musicName: 'Mezcla dinámica', musicDescription: 'La pista toma el color musical de cada colección al cambiar de texto.' },
  { id: 'poetic', name: 'Poético', shortName: 'Poesía', description: 'Versos originales con ecos de formas clásicas y una sensibilidad contemporánea.', musicName: 'Lira de madrugada', musicDescription: 'Piano ligero, campanas de cristal y respiraciones amplias.' },
  { id: 'motivational-literature', name: 'Literatura motivacional', shortName: 'Motivación', description: 'Lecturas originales para recuperar foco, ánimo y sentido de avance.', musicName: 'Paso luminoso', musicDescription: 'Cuerdas cálidas y un pulso discreto para seguir adelante.' },
  { id: 'romanticism', name: 'Romanticismo', shortName: 'Romanticismo', description: 'Palabras para recitar con ternura, cuidado y afecto familiar.', musicName: 'Carta de luna', musicDescription: 'Arpa, pad aterciopelado y un vals lento de fondo.' },
  { id: 'self-improvement', name: 'Autosuperación', shortName: 'Autosuperación', description: 'Recordatorios originales para construir hábitos, paciencia y valentía cotidiana.', musicName: 'Brújula tranquila', musicDescription: 'Marimba suave y acordes que invitan a concentrarse.' },
  { id: 'biblical-self-help', name: 'Autoayuda bíblica', shortName: 'Reflexión bíblica', description: 'Reflexiones originales vinculadas a pasajes conocidos, sin reemplazar la lectura de la Biblia.', musicName: 'Santuario suave', musicDescription: 'Órgano delicado, cuerdas lentas y silencios amplios.' },
  { id: 'constructive-dialogues', name: 'Frases y diálogos constructivos', shortName: 'Diálogos constructivos', description: 'Escenas originales con espíritu de cine, series y aventura animada, sin usar franquicias ajenas.', musicName: 'Viaje de luciérnagas', musicDescription: 'Guitarra limpia, celesta y un ritmo esperanzador.' },
];

export const PARAGRAPH_CATEGORY_DETAILS = Object.freeze(categoryDetails);

export const paragraphCategoryDetail = (mode: ParagraphMode): ParagraphCategoryDetail => (
  PARAGRAPH_CATEGORY_DETAILS.find((detail) => detail.id === mode) ?? PARAGRAPH_CATEGORY_DETAILS[0]
);

const POETIC: readonly ParagraphDraft[] = [
  { text: 'La mañana cose un hilo dorado entre las ventanas y cada respiración aprende a llamarse comienzo.' },
  { text: 'En la taza de té cabe una pequeña constelación si miras el vapor con paciencia y corazón despierto.' },
  { text: 'La lluvia no pregunta por qué cae: dibuja círculos en el suelo y deja que la calle recuerde cantar.' },
  { text: 'Guarda una palabra amable en el bolsillo; a veces una sílaba tibia cambia la estación de una tarde.' },
  { text: 'El cielo se hizo ancho para que tus dudas tuvieran sitio y aun así quedara espacio para la esperanza.' },
  { text: 'Una hoja gira en el aire sin prisa, como si supiera que llegar al suelo también puede ser una danza.' },
  { text: 'Cuando el río baja sereno, las piedras no desaparecen: aprenden a brillar debajo de la corriente.' },
  { text: 'La noche enciende una lámpara diminuta en cada estrella para que nadie confunda silencio con soledad.' },
  { text: 'Hay jardines que nacen primero en la mirada; por eso cuida lo que imaginas mientras riegas lo posible.' },
  { text: 'El viento dejó una carta en la cortina y decía que la ternura también sabe cruzar grandes distancias.' },
  { text: 'La luna practica su luz sobre el agua y el agua la devuelve como si ambas estuvieran aprendiendo a confiar.' },
  { text: 'Un poema puede empezar con una puerta abierta, una silla vacía y el deseo humilde de volver a hablar.' },
  { text: 'Las montañas no levantan la voz para ser firmes; sostienen el horizonte con una calma que se contagia.' },
  { text: 'Poner nombre a una alegría es como encender una vela: no vence toda la noche, pero acompaña el camino.' },
  { text: 'La brisa ordenó los pétalos del patio y por un instante el mundo pareció una libreta recién estrenada.' },
  { text: 'Tu paso deja una música breve sobre el pasillo; escucha cómo la casa celebra que hayas llegado.' },
  { text: 'El amanecer no compite con la oscuridad: simplemente abre los ojos y ofrece su color más amable.' },
  { text: 'Hay una campana secreta en las cosas pequeñas que suena cuando alguien decide mirar con gratitud.' },
  { text: 'La nube viaja sin equipaje, pero lleva sombra, lluvia y descanso para quien necesite una pausa.' },
  { text: 'Escribir despacio puede ser una forma de escuchar: cada letra aprende dónde quiere descansar el corazón.' },
];

const MOTIVATIONAL_LITERATURE: readonly ParagraphDraft[] = [
  { text: 'No necesitas resolver toda la semana hoy; elige la siguiente acción amable y deja que el avance haga su trabajo.' },
  { text: 'La constancia no siempre se siente heroica: a veces es beber agua, volver al cuaderno y cumplir una promesa pequeña.' },
  { text: 'Cuando algo cuesta, no significa que seas incapaz; puede significar que estás aprendiendo una ruta que antes no existía.' },
  { text: 'Tu ritmo merece respeto. Compararte apaga señales útiles; observarte con honestidad te ayuda a elegir mejor.' },
  { text: 'Un tropiezo es información, no identidad. Mira qué falló, ajusta una pieza y vuelve a intentarlo con curiosidad.' },
  { text: 'La motivación visita y se va; los acuerdos que haces contigo son el puente que mantiene encendida la marcha.' },
  { text: 'Hay días de sembrar y días de ver brotes. Ambos cuentan, aunque el segundo sea el que recibe aplausos.' },
  { text: 'Pedir ayuda no reduce tu fuerza; le da dirección y compañía a una fuerza que ya estaba en ti.' },
  { text: 'Haz espacio para el descanso sin llamarlo derrota. Una mente cuidada vuelve con mejores preguntas y más claridad.' },
  { text: 'La versión valiente de ti no vive lejos: aparece cada vez que eliges una tarea posible en lugar de rendirte.' },
  { text: 'No esperes sentirte listo para empezar. Empieza con respeto, aprende en movimiento y deja que la práctica te alcance.' },
  { text: 'Una meta grande se vuelve cercana cuando la divides en gestos repetibles y celebras cada uno sin exagerarlo.' },
  { text: 'Tu atención es un jardín limitado; riega una prioridad antes de abrir diez puertas que no podrás cuidar.' },
  { text: 'La disciplina amable no castiga: prepara el entorno, reduce obstáculos y recuerda por qué elegiste avanzar.' },
  { text: 'Si hoy solo puedes hacer poco, haz ese poco con presencia. El progreso también reconoce las jornadas silenciosas.' },
  { text: 'El miedo puede viajar contigo sin conducir el vehículo. Nómbralo, ajusta el cinturón y continúa despacio.' },
  { text: 'Cambiar de plan no borra lo aprendido. A veces la inteligencia consiste en elegir un camino más sostenible.' },
  { text: 'Cada habilidad empieza torpe porque tu cerebro está dibujando un mapa nuevo. La repetición convierte líneas en caminos.' },
  { text: 'La pregunta útil no es si todo saldrá perfecto, sino qué apoyo necesitas para dar el siguiente paso con dignidad.' },
  { text: 'Cuida tus palabras internas como cuidarías a un amigo: firmes cuando haga falta y siempre libres de crueldad.' },
];

const ROMANTICISM: readonly ParagraphDraft[] = [
  { text: 'La luna dejó una carta plateada sobre el río y la nube la leyó con una sonrisa pequeña.' },
  { text: 'Tu nombre suena como lluvia suave cuando el jardín todavía guarda sueño.' },
  { text: 'Dos tazas de té esperaban junto a la ventana mientras el atardecer pintaba duraznos.' },
  { text: 'El corazón del cielo hizo espacio para una estrella más cuando llegaste a mirar.' },
  { text: 'Un pétalo viajó con el viento para decirte que hoy también eres una alegría.' },
  { text: 'En la libreta azul escribimos promesas sencillas: reír, cuidar y volver a intentar.' },
  { text: 'La tarde olía a pan dulce y a una aventura que todavía no tenía final.' },
  { text: 'Cada luciérnaga encendió una luz para que el camino a casa se sintiera especial.' },
  { text: 'La brisa acomodó el lazo de su cabello y el mundo pareció hablar más despacio.' },
  { text: 'Una canción bajita convirtió el silencio en un lugar cálido para compartir.' },
  { text: 'El sol se escondió con timidez detrás de las montañas, pero dejó colores para nosotros.' },
  { text: 'Guardé una flor entre las páginas para recordar que los días suaves también cuentan.' },
  { text: 'La estación estaba tranquila y el tren de las nubes llegó justo a tiempo para soñar.' },
  { text: 'Una nota con forma de corazón decía: mañana podemos empezar de nuevo, sin prisa.' },
  { text: 'El lago guardaba el reflejo de dos sonrisas y ninguna quería irse todavía.' },
  { text: 'La lluvia tocó el tejado como un piano y la casa se llenó de calma.' },
  { text: 'Quererte bien es recordar tu descanso, escuchar tus límites y celebrar contigo lo que te hace florecer.' },
  { text: 'Te invito a caminar despacio: no para detener el tiempo, sino para que la tarde alcance a abrazarnos.' },
  { text: 'La ternura no necesita discursos enormes; se reconoce en una pregunta honesta y una silla acercada a tiempo.' },
  { text: 'Si el día se nubla, guardemos una lámpara encendida para recordarnos que el cariño también sabe orientar.' },
];

const SELF_IMPROVEMENT: readonly ParagraphDraft[] = [
  { text: 'Respira lento: el cielo no tiene prisa y el río siempre encuentra una curva amable.' },
  { text: 'Una taza tibia entre las manos puede convertir una mañana sencilla en un refugio.' },
  { text: 'Las hojas se mueven sin competir y por eso el bosque sabe escuchar.' },
  { text: 'Hoy basta con una tarea pequeña, una respiración profunda y un poco de paciencia.' },
  { text: 'El amanecer acomoda sus colores uno por uno, como si estuviera preparando un regalo.' },
  { text: 'Una melodía tranquila puede hacer que hasta los pensamientos caminen con zapatos suaves.' },
  { text: 'El jardín crece a su ritmo y cada brote celebra haber encontrado su propia luz.' },
  { text: 'Mira cómo la nube cambia de forma: no necesita ser perfecta para ser bonita.' },
  { text: 'Cuando la tarde se vuelve lenta, una ventana abierta puede traer una idea luminosa.' },
  { text: 'El sonido de la lluvia recuerda que descansar también es una forma de avanzar.' },
  { text: 'Cada paso tranquilo deja espacio para notar las cosas pequeñas que hacen bien.' },
  { text: 'Una estrella no ilumina todo el cielo, pero acompaña muy bien a quien mira arriba.' },
  { text: 'El vapor del té dibujó una nube y por un momento la cocina pareció un cuento.' },
  { text: 'La noche guardó silencio para que cada grillo pudiera terminar su canción favorita.' },
  { text: 'Una manta, una lámpara y un libro pueden ser un universo completo para esta noche.' },
  { text: 'Antes de dormir, el río dejó un destello en la orilla para decir que mañana también llega.' },
  { text: 'Ser constante no exige dureza: prepara una versión fácil de la tarea para los días en que la energía baja.' },
  { text: 'Tu límite no es una puerta cerrada; es un aviso útil para cambiar de ritmo, pedir apoyo o descansar.' },
  { text: 'Aprender a decir todavía no abre espacio para practicar, en vez de convertir cada dificultad en una sentencia.' },
  { text: 'La autoestima se entrena con evidencia: registra lo que sí hiciste y permite que tus esfuerzos te hablen.' },
];

const BIBLICAL_SELF_HELP: readonly ParagraphDraft[] = [
  { text: 'Cuando el camino parezca incierto, recuerda que confiar paso a paso puede ordenar decisiones que hoy se ven confusas.', sourceReference: 'Proverbios 3:5–6' },
  { text: 'Puedes respirar y soltar la urgencia: la paz también crece cuando entregas una preocupación que ya pesa demasiado.', sourceReference: 'Filipenses 4:6–7' },
  { text: 'En un día difícil, busca una compañía fiel y un lugar seguro; no tienes que sostener todo sin apoyo.', sourceReference: 'Salmo 46:1' },
  { text: 'La esperanza puede empezar como una chispa humilde y aun así alumbrar una decisión importante.', sourceReference: 'Hebreos 11:1' },
  { text: 'Si la tristeza visita tu corazón, trata tu dolor con delicadeza y permite que el consuelo llegue a su ritmo.', sourceReference: 'Salmo 34:18' },
  { text: 'Hay fuerzas que regresan después del descanso. Hoy puedes avanzar sin negar que necesitas renovar el ánimo.', sourceReference: 'Isaías 40:31' },
  { text: 'No confundas valentía con ausencia de temor: la valentía elige hacer el bien aun cuando las manos tiemblan.', sourceReference: 'Josué 1:9' },
  { text: 'Una mañana nueva puede ser una oportunidad real para volver a empezar con misericordia hacia ti mismo.', sourceReference: 'Lamentaciones 3:22–23' },
  { text: 'Cuando no sepas qué decir, una oración breve y sincera puede ser el primer descanso de la mente.', sourceReference: '1 Pedro 5:7' },
  { text: 'No todo resultado se entiende de inmediato; sigue cuidando lo correcto y deja espacio para que el sentido madure.', sourceReference: 'Romanos 8:28' },
  { text: 'Tu trabajo merece intención, pero también humildad: encomienda lo que haces y revisa el camino con serenidad.', sourceReference: 'Proverbios 16:3' },
  { text: 'La paz no siempre cambia el entorno al instante; a veces protege el interior mientras encuentras el próximo paso.', sourceReference: 'Juan 14:27' },
  { text: 'En tiempos de escasez emocional, recuerda los recursos que ya tienes: personas, memoria, fe y la posibilidad de pedir ayuda.', sourceReference: 'Salmo 23:1–4' },
  { text: 'Mira arriba cuando te sientas pequeño, no para negar el problema, sino para recordar que la ayuda puede llegar.', sourceReference: 'Salmo 121:1–2' },
  { text: 'Persevera sin convertirte en una máquina. Hacer el bien también incluye atender tu cuerpo y tu descanso.', sourceReference: 'Gálatas 6:9' },
  { text: 'Tu espíritu puede aprender firmeza, amor y dominio propio mediante decisiones pequeñas repetidas con paciencia.', sourceReference: '2 Timoteo 1:7' },
  { text: 'Hay planes que todavía no ves completos. Conserva la esperanza mientras construyes con responsabilidad el día presente.', sourceReference: 'Jeremías 29:11' },
  { text: 'Acércate al descanso cuando estés cansado; recuperar fuerzas no es abandonar tus responsabilidades.', sourceReference: 'Mateo 11:28–30' },
  { text: 'La luz que necesitas hoy puede ser una palabra clara para el siguiente paso, no necesariamente todo el mapa.', sourceReference: 'Salmo 119:105' },
  { text: 'El amor paciente empieza por hablarte con compasión y extender esa compasión a quienes comparten tu camino.', sourceReference: '1 Corintios 13:4–7' },
];

const CONSTRUCTIVE_DIALOGUES: readonly ParagraphDraft[] = [
  { text: 'Nubi preguntó: ¿y si no puedo? Canela respondió: entonces empezamos con una cosa pequeña y la hacemos juntos.' },
  { text: 'La capitana dijo: no necesito que todos sepan el camino; necesito que nadie se quede solo mientras lo buscamos.' },
  { text: 'Misu miró el mapa y susurró: equivocarnos no borra la misión. Solo nos enseña dónde no estaba la puerta.' },
  { text: 'Pipo dejó los auriculares y dijo: escuchar de verdad es una aventura; primero baja el ruido para oír a tu equipo.' },
  { text: 'La heroína guardó su espada y eligió conversar. A veces la decisión más valiente es proteger la paz que construimos.' },
  { text: 'Mochi dijo: tengo miedo de fallar. Foca Pompón contestó: yo también, por eso ensayamos antes de saltar.' },
  { text: 'En la estación vacía, una amiga dijo: no sé qué hacer. La otra respondió: empecemos por sentarnos y respirar.' },
  { text: 'El inventor celebró el prototipo roto: ahora sabemos una manera menos de hacerlo y una razón más para ajustar.' },
  { text: 'La directora del club explicó: aquí no gana quien habla más fuerte, sino quien ayuda a que todos puedan participar.' },
  { text: 'Nubi vio la lluvia y preguntó si el paseo se arruinó. Canela señaló los charcos: quizá cambió de forma, no de valor.' },
  { text: 'El joven viajero dijo: necesito ser perfecto. Su maestra respondió: necesitas ser atento, honesto y dispuesto a aprender.' },
  { text: 'Misu ofreció una linterna y dijo: no ilumina todo el bosque, pero alcanza para que demos el siguiente paso.' },
  { text: 'La banda perdió el ensayo, pero no la amistad. Decidieron escuchar el error, reír un poco y tocar otra vez.' },
  { text: 'Pipo escribió en la pizarra: pedir perdón abre una puerta. Reparar con hechos nos enseña a cruzarla.' },
  { text: 'La exploradora encontró un puente roto y dijo: no es el final. Reunamos materiales, ideas y tiempo para repararlo.' },
  { text: 'Foca Pompón dijo: no tengo tu ritmo. Mochi sonrió: no lo necesitas; caminemos al ritmo que nos permita hablar.' },
  { text: 'El personaje tímido levantó la mano. Su equipo esperó en silencio y descubrió que su idea era la pieza que faltaba.' },
  { text: 'La abuela de la historia dijo: una casa fuerte no evita toda tormenta; aprende a encender luces cuando llega la noche.' },
  { text: 'Nubi miró su dibujo imperfecto y Misu respondió: se nota que lo hiciste con cuidado. Ahora cuéntame qué querías decir.' },
  { text: 'Al final del episodio, todos entendieron que la verdadera victoria fue volver por quien se había quedado atrás.' },
];

const buildEntries = (category: ParagraphCategory, drafts: readonly ParagraphDraft[]): readonly ParagraphEntry[] => drafts.map((draft, index) => ({
  id: `paragraph-${category}-${String(index + 1).padStart(2, '0')}`,
  text: draft.text,
  category,
  origin: draft.sourceReference ? 'scripture-reflection' : 'typingroll-original',
  ...(draft.sourceReference ? { sourceReference: draft.sourceReference } : {}),
  isSafe: true,
}));

export const PARAGRAPH_CATALOG: readonly ParagraphEntry[] = Object.freeze([
  ...buildEntries('poetic', POETIC),
  ...buildEntries('motivational-literature', MOTIVATIONAL_LITERATURE),
  ...buildEntries('romanticism', ROMANTICISM),
  ...buildEntries('self-improvement', SELF_IMPROVEMENT),
  ...buildEntries('biblical-self-help', BIBLICAL_SELF_HELP),
  ...buildEntries('constructive-dialogues', CONSTRUCTIVE_DIALOGUES),
]);

export const paragraphsForMode = (mode: ParagraphMode): readonly ParagraphEntry[] => (
  mode === 'classic' ? PARAGRAPH_CATALOG : PARAGRAPH_CATALOG.filter((entry) => entry.category === mode)
);
