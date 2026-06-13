// Globale Variablen
const textContainer = document.getElementById("text-container");
const decisionContainer = document.getElementById("decision-container");
const buttonsAndInputs = document.getElementById("buttons-and-inputs");
const timerContainer = document.getElementById("timer-container");
const storyContainer = document.getElementById("story-container");
const imageContainer = document.getElementById("image-container");
const imageHolder = document.getElementById("story-image");
const startButton = document.getElementById("start-button");
const bottomRectangle = document.getElementById("bottomRectangle");
const nameDiv = document.getElementById("name");

// In dieser Variable wird der Timer gespeichert, damit wir ihn auch wieder löschen können, falls der Benutzer rechtzeitig eine Entscheidung trifft.
let timerVariable;
let timerTime = 30000; // Zeit in Millisekunden, die der Benutzer für eine Entscheidung hat (aktuell 10 Sekunden)

let useTypeWriterEffect = true; // Hier kann eingestellt werden, ob der Type-Writer Effekt verwendet werden soll oder nicht. Falls nicht, wird der Text direkt angezeigt.
let typeWriterSpeed = 5; // Hier kann die Geschwindigkeit des Type-Writer Effekts eingestellt werden (aktuell 3 Millisekunden pro Buchstabe)
let textDelay = 500; // Hier kann die Verzögerung zwischen den Textabschnitten eingestellt werden (aktuell 2000 Millisekunden = 2 Sekunden)

/**
 * Die Story-Datenstruktur
 * Jeder Knoten in der Story ist ein JavaScript Objekt mit den folgenden Eigenschaften: 
 *    id: "Story-Identifier", (der Identifier wird benötigt um den richtig Storyfluss zu gewährleisten)
 *    text: [], (Array von Strings, die nacheinander angezeigt angezeigt werden)
 *    hasTimer: True/False, Falls True, wird ein Timer angezeigt und der Benutzer muss innerhalb der Zeit eine Entscheidung treffen, sonst verliert er das Spiel.
 *    image: "Pfad zum Bild", (optional, falls an diesem Story-Punkt ein Bild angezeigt werden soll)
 *    next: [], (Array von Objekten mit key und label, die die möglichen Entscheidungen des Benutzers darstellen. 
 *              key ist der Identifier der nächsten Story, label ist der Text, der auf dem Button angezeigt wird) 
 *    input: { (optional, falls an diesem Story-Punkt eine Benutzereingabe benötigt wird) }
 */
const story = {
    Familienhaus: {
      id: "Familienhaus",
      text: ["Ich habe es so satt und ich halte es einfach nicht mehr aus.",
      ],
      hasTimer: false,
      image: "",
      name: ["Anna"],
      next: [
        { key: "Familienhaus_2", label: "weiter" },
      ]
    },
    Familienhaus_2: {
      id: "Familienhaus_2",
      text: ["Deshalb packe ich die wenigen Sachen, die ich besitze, in meinen Koffer. Ich greife schon nach der Türklinke, als ich spüre, wie sich eine Hand um mein Handgelenk schliesst.",
      ],
      hasTimer: false,
      image: "img/Bild01.png",
      name: ["Anna"],
      next: [
        { key: "Familienhaus_3", label: "weiter" },
      ]
    },
    Familienhaus_3: {
      id: "Familienhaus_3",
      text: ["Ich greife schon nach der Türklinke, als ich spüre, wie sich eine Hand um mein Handgelenk schliesst.Ein Schauer läuft mir über den Rücken, doch ich drehe mich um. ",
      ],
      hasTimer: false,
      image: "img/Bild03.png",
      name: ["Anna"],
      next: [
        { key: "Familienhaus_4", label: "weiter" },
      ]
    },
    Familienhaus_4: {
      id: "Familienhaus_4",
      text: ["Meine Schwester steht vor mir, ihre Augen sind ganz verquollen vom Weinen. Ich ahne, was sie sagen möchte: Ich solle sie nicht verlassen."
      ],
      hasTimer: false,
      image: "img/Bild04.png",
      name: ["Anna"],
      next: [
        { key: "Familienhaus_5", label: "weiter" }
      ]
    },
    Familienhaus_5: {
      id: "Familienhaus_5",
      text: ["Ohne dass sie etwas sagen kann, verlasse ich das Haus. Im Hintergrund ist die schreiende Stimme meiner Mutter immer noch zu hören.",
          "Natürlich habe ich mir nicht überlegt, wo ich als Nächstes hingehen soll. Das kann man auch nicht von einer Dreizehnjährigen erwarten. ",
      ],
      hasTimer: false,
      image: "img/Bild1.png",
      name: ["Anna"],
      next: [
        { key: "Familienhaus_6", label: "weiter" }
      ]
    },
    Familienhaus_6: {
      id: "Familienhaus_6",
      text: ["Doch nun musste ich mich entscheiden, wie es weitergehen soll. ",
          "Soll ich meine alte Freundin aus Berlin, mit der ich schon seit einer Weile keinen Kontakt hatte, anrufen und fragen, ob ich einige Nächte bei ihr übernachten könnte, bis ich selbst wieder auf den Beinen stehe? ",
          "Oder lieber bei der nächstbesten Jugendherberge die Nächte verbringen."
      ],
      hasTimer: false,
      image: "img/Bild1.png",
      name: ["Anna"],
      next: [
        { key: "Berlin", label: "zu deiner Freundin" },
        { key: "Jugendherberge", label: "zur Jugendherberge" }
      ]
    },

    Berlin: {
      id: "Berlin",
      text: ["Ich erreiche meine Freundin, welche drei Jahre älter als ich ist und vor einer Weile eine WG mit zwei anderen Mädchen gegründet hat, telefonisch.",
          "Sie sagt mir, sie freue sich, dass ich mich endlich mal gemeldet habe, und ich könne natürlich einige Nächte bei ihr verbringen.",
      ],
      hasTimer: false,
      image: "img/Bild3.0.png",
      name: ["Anna"],
      next: [
        { key: "Berlin_2", label: "Weiter" }
      ]
    },
    Berlin_2: {
      id: "Berlin_2",
      text: ["Die Google-Maps-Karte weist mich darauf hin, dass sich der Zielort 500 m vor mir befindet, deshalb stecke ich mein Handy weg und richte den Blick geradeaus."
      ],
      hasTimer: false,
      image: "img/Bild3.1.png",
      name: ["Anna"],
      next: [
        { key: "Berlin_3", label: "Weiter" }
      ]
    },
    Berlin_3: {
      id: "Berlin_3",
      text: ["In der Ferne sehe ich eine Gestalt vor der Eingangstür des Wohnungskomplexes stehen. Als ich näherkomme, erkenne ich meine Freundin, die sich aber äußerlich sehr verändert hat, seit ich sie vor 5 Jahren zuletzt gesehen habe.",
          "Sie wirkt glücklich, mich zu sehen und begrüßt mich mit einer Umarmung.",
      ],
      hasTimer: false,
      image: "img/Bild3.2.png",
      name: ["Anna"],
      next: [
        { key: "Berlin_4", label: "Weiter" }
      ]
    },
    Berlin_4: {
      id: "Berlin_4",
      text: ["Als wir oben vor der Tür ankommen, höre ich Musik durch die Tür hindurch. Sobald sie die Klinke herunterdrückt, werde ich mit einer Wolke von Gras begrüßt. Ihre zwei weiteren Freundinnen sitzen im Wohnzimmer und rauchen.",
          "Sie entschuldigt sich dafür und fragt, ob es mir etwas ausmacht, wenn sie sich zu den anderen gesellt.",
          "Ich schüttle den Kopf."
      ],
      hasTimer: false,
      image: "img/Bild3.31.png",
      name: ["Anna"],
      next: [
        { key: "Zuhause", label: "Weiter" }
      ]
    },

   Jugendherberge: {
      id: "Jugendherberge",
      text: ["Die naheliegendste Herberge ist zehn Minuten von mir entfernt, sie hat nicht die besten Google-Rezensionen, doch sie liegt besser in meinem Budget."
      ],
      hasTimer: false,
      image: "img/Bild2.0.png",
      name: ["Anna"],
      next: [
        { key: "Jugendherberge_2", label: "Weiter" }
      ]
    },
    Jugendherberge_2: {
      id: "Jugendherberge_2",
      text: ["Nachdem ich mir ein Zimmer mit vier anderen Leuten ergattert habe, verbringe ich die meiste Zeit faulend auf meinem Bett und lasse den letzten Abend zu Hause Revue passieren. Wie meine Schwester mir flehend in die Augen sah. Wie ich sie einfach zurückliess, ohne die Folgen meiner Tat zu realisieren."
      ],
      hasTimer: false,
      image: "img/Bild2.1.png",
      name: ["Anna"],
      next: [
        { key: "Jugendherberge_3", label: "Weiter" }
      ]
    },
    Jugendherberge_3: {
      id: "Jugendherberge_3",
      text: ["Das Geld, welches schon zu Beginn wenig war, ging mir allmählich aus und ich war gezwungen, meine Freundin aus Berlin zu kontaktieren."
      ],
      hasTimer: false,
      image: "img/Bild2.png",
      name: ["Anna"],
      next: [
        { key: "Berlin", label: "zu deiner Freundin" }
      ]
    },

    Zuhause: {
      id: "Zuhause",
      text: ["Es sind elf Monate vergangen, seit meiner Ankunft, und die Verhältnisse zwischen mir und den zwei weiteren Mädchen der WG haben sich nicht gebessert, aber um ehrlich zu sein, hatte ich auch selbst nicht das Interesse, etwas daran zu ändern, und auch nicht die Zeit.",
      ],
      image: "img/Bild3.4.png",
      hasTimer: false,
      name: ["Anna"],
      next: [
        { key: "Zuhause_2", label: "Weiter" }
      ]
    },
    Zuhause_2: {
      id: "Zuhause_2",
      text: ["Denn mein Leben besteht aus Schule und Arbeit. Für Freizeit habe ich wenig Platz in meinem Alltag und wenn ich Zeit habe, gehe ich gerne joggen, es hilft mir, über Dinge nachzudenken und Dampf abzulassen.",
      ],
      image: "img/Bild3.4.png",
      hasTimer: false,
      name: ["Anna"],
      next: [
        { key: "Zuhause_3", label: "Weiter" }
      ]
    },
    Zuhause_3: {
      id: "Zuhause_3",
      text: ["Meine Freundin von früher ist wie immer sehr freundlich, doch viel unternehmen wir nicht miteinander. Solange ich die WG-Gebühren zahle, ist alles in bester Ordnung.",
      ],
      image: "img/Bild3.4.png",
      hasTimer: false,
      name: ["Anna"],
      next: [
        { key: "entscheidung_Joggen", label: "Weiter" }
      ]
    },
  
    entscheidung_Joggen: {
      id: "entscheidung_Joggen",
      text: ["Wie jeden Freitag gehe ich im Viertel joggen, meist gehe ich vor der Abenddämmerung, weil ich sonst mit der Schule und dem Geldverdienen beschäftigt bin, und hoffe darauf, dass ich heimkomme, bevor es dunkel wird. Doch diesen Abend habe ich ein ungutes Gefühl.",
            "Das Joggen tut mir gut und lässt mir Zeit zum Nachdenken. Soll ich deshalb trotzdem mich auf den Weg nach draußen machen?",
      ],
      hasTimer: false,
      image: "img/Bild3.png",
      name: ["Anna"],
      next: [
        { key: "Joggen", label: "trotzdem joggen gehen" },
        { key: "nicht_Joggen", label: "nicht gehen" }
      ]
    },

    Joggen: {
      id: "Joggen",
      text: ["Ich bin jetzt schon etwas weiter vom Apartmentkomplex entfernt, als ich hinter mir entfernte Schritte wahrnehme. Die Dämmerung ist schneller eingetroffen, als ich vermutet habe. Um ehrlich zu sein, bin ich zu spät losgegangen, denn ich habe mich gescheut, rauszugehen.",
      ],
      hasTimer: false,
      image: "img/Bild5.png",
      name: ["Anna"],
      next: [
        { key: "Joggen_2", label: "Weiter" }
      ]
    },
    Joggen_2: {
      id: "Joggen_2",
      text: ["Die verbleibende Sonne hat das Viertel mit einem goldenen Licht übersät. Bald würden nur die Straßenlaternen die Straße beleuchten.",
            "Die Schritte hinter mir geben nicht nach und bleiben beständig entfernt.",
            "Soll ich einen Blick über meine Schulter erhaschen?"
      ],
      hasTimer: true,
      image: "img/Bild5.0.png",
      name: ["Anna"],
      next: [
        { key: "Blick_erhaschen", label: "Ich möchte es wagen" },
        { key: "Blick_nicht_erhaschen", label: "lieber nicht" }
      ]
    },
  
    Blick_erhaschen: {
      id: "Blick_erhaschen",
      text: ["Als ich mich umdrehe, sehe ich eine Gestalt mehrere Meter hinter mir, ruckartig drehe ich den Kopf wieder zurück, damit ich mich nicht auffällig verhalte. Der Körperbau der Gestalt wirkt männlich und er wirkt ziemlich groß. Falls er näherkäme, weiß ich nicht, ob ich es mit ihm aufnehmen könnte."
      ],
      hasTimer: false,
      image: "img/Bild8.png",
      name: ["Anna"],
      next: [
        { key: "Standort_teilen", label: "Freunden Standort teilen" }
      ]
    },
  
    Blick_nicht_erhaschen: {
      id: "Blick_nicht_erhaschen",
      text: ["Ich entscheide mich, nicht über die Schulter zu schauen. Solange ich die Person hinter mir nicht sehe, ist sie auch nicht wirklich dort.",
              "Obwohl ich versuche, ein optimistisches Mindset beizubehalten, kann ich die Schritte hinter mir nicht ausblenden, und mit der Zeit beunruhigen sie mich sehr. Ich versuche, meine Atmung wieder in den Griff zu kriegen, sonst werde ich ein Stechen in meiner Seite verspüren und dem Verfolger ausgeliefert sein."
      ],
      image: "img/Bild5.png",
      name: ["Anna"],
      hasTimer: false,
      next: [
        { key: "Standort_teilen", label: "Freunden Standort teilen" }
       ]
      }, 
  
    Standort_teilen: {
      id: "Standort_teilen",
      text: ["Ich versuche, mein Tempo zu halten, weder zu schnell noch zu langsam zu werden. Das Sicherste, das ich für den Moment tun kann, ist, meinen Standort an meine Freundin zu senden. Ich versende die Nachricht, und in der rechten Ecke ist nur ein Häkchen abgebildet."
      ],
      image: "img/Bild9 (2).png",
      name: ["Anna"],
      hasTimer: false,
      next: [
        { key: "Standort_teilen_2", label: "weiter" }
      ]
    },

    Standort_teilen_2: {
      id: "Standort_teilen_2",
      text: ["Als ich von meinem Handy aufschaue, sehe ich, dass sich vier Meter vor mir eine Kreuzung erstreckt.",
            "In welche Richtung soll ich gehen?"
      ],
      image: "img/Bild10.png",
      name: ["Anna"],
      hasTimer: false,
      next: [
        { key: "Rechts_abbiegen", label: "rechts" },
        { key: "Links_abbiegen", label: "links" },
        { key: "Direkt_nach_Hause", label: "geradeaus nach Hause" }
      ]
    },

    Rechts_abbiegen: {
      id: "Rechts_abbiegen",
      text: ["Aus der rechten Verzweigung höre ich schon Stimmen. Als ich einbiege, bemerke ich, warum in dieser Gasse mehr los ist als in der vorherigen."
      ],
      image: "img/Bild10.1.png",
      hasTimer: false,
      name: ["Anna"],
      next: [
        { key: "Rechts_abbiegen_2", label: "Weiter" }
      ]
    },
    Rechts_abbiegen_2: {
      id: "Rechts_abbiegen_2",
      text: ["Vor der Bar haben sich an Stehtischen Leute versammelt und unterhalten sich gelassen. Ich jogge an ihnen vorbei und höre hinter mir immer noch die Schritte, doch jetzt sind sie sogar noch näher, obwohl wir an einem belebteren Straßenrand sind.",
            "Soll ich mich umdrehen?"
      ],
      image: "img/Bild11.png",
      hasTimer: false,
      name: ["Anna"],
      next: [
        { key: "Umdrehen", label: "ja" },
        { key: "Nicht_Umdrehen", label: "nein" }
      ]
    },

    Umdrehen: {
      id: "Umdrehen",
      text: ["Ich drehe mich um und erstarre sogleich. Denn nun kann ich sein Gesicht in vollen Zügen erkennen, weil er direkt unter einer Straßenlaterne stehen geblieben ist. In seinem Gesicht spiegelt sich eine Art von Verwirrung, die ich nicht ganz deuten kann."
      ],
      image: "img/Bild13.png",
      hasTimer: false,
      name: ["Anna"],
      next: [
        { key: "POV_Mann", label: "Weiter" }
      ]
    },
    
    Nicht_Umdrehen: {
      id: "Nicht_Umdrehen",
      text: ["Ich gehe weiter und muss gleich die Straßenseite wechseln, um zur Wohnung zu gelangen. Damit ich nicht von einem Auto überrollt werde, blicke ich über die linke Schulter und halte in der Bewegung inne. Ist das mein Verfolger, der verwirrt zurückstarrt?"
      ],
      hasTimer: false,
      image: "img/Bild13.png",
      name: ["Anna"],
      next: [
        { key: "POV_Mann", label: "Weiter" }
      ]
    },
    
    POV_Mann: {
      id: "POV_Mann",
      text: ["Sie steht versteinert da, ihre Augen sind ganz geweitet vor Schreck. Ich selbst bewege mich auch kein Stück."
      ],
      hasTimer: false,
      image: "img/Bild15.png",
      name: ["Mann"],
      next: [
        { key: "POV_Mann_2", label: "Weiter" }
      ]
    },
    POV_Mann_2: {
      id: "POV_Mann_2",
      text: ["Bevor ich auch nur den Mund öffnen kann, springt sie davon. Da war meine Chance auch schon vertan. Ihr Anblick hatte mich so unerwartet getroffen, dass ich nicht rechtzeitig reagieren konnte."
      ],
      hasTimer: false,
      image: "img/Bild10.1.png",
      name: ["Mann"],
      next: [
        { key: "POV_Mann_3", label: "Weiter" }
      ]
    },
    POV_Mann_3: {
      id: "POV_Mann_3",
      text: ["Ich hatte sie beim Vorbeijoggen gesehen und konnte meinen Augen nicht trauen. Ich brauchte einen zweiten Blick und begann, ihr hinterherzujoggen. Nicht gerade unauffällig, wie es scheint…"
      ],
      hasTimer: false,
      image: "img/Bild13.png",
      name: ["Mann"],
      next: [
        { key: "In_der_Wohnung_Freundin_Joggen", label: "Weiter" }
      ]
    },

    Links_abbiegen: {
      id: "Links_abbiegen",
      text: ["Ich nehme die linke Verzweigung, damit ich die Chance habe, ihn abzuhängen. Doch dadurch entferne ich mich nur noch mehr von meiner ursprünglichen Route und dementsprechend von der Wohnung."
      ],
      image: "img/Bild10.1.png",
      hasTimer: false,
      name: ["Anna"],
      next: [
        { key: "Links_abbiegen_2", label: "Weiter" }
      ]
    },
    Links_abbiegen_2: {
      id: "Links_abbiegen_2",
      text: ["Als ich weiterjogge, fällt mir ein, dass es eine Gasse zwischen zwei Gebäuden gibt, die in der Nähe meiner Wohnung endet. Ich nutze diese Gasse meist, wenn ich spät dran bin, aber nur tagsüber, denn am Abend ist sie spärlich beleuchtet. Es bietet die besten Voraussetzungen, um ein junges Mädchen ohne jegliches Aufsehen mitzunehmen.",
        "Soll ich die Abkürzung nutzen?"
      ],
      image: "img/Bild12.png",
      hasTimer: false,
      name: ["Anna"],
      next: [
        { key: "Abkürzung_nutzen", label: "ja" },
        { key: "Abkürzung_nicht_nutzen", label: "nein" }
      ]
    },

    Abkürzung_nutzen: {
      id: "Abkürzung_nutzen",
      text: ["Als ich in die Gasse einbiege, hören die Schritte plötzlich auf. Ich denke, ich habe ihn erfolgreich abgeschüttelt – oder er hat sich besonnen – und hoffe somit, dass er nicht weiß, wo ich wohne, sodass es später auch nicht zu unerwarteten Besuchen mitten in der Nacht kommt."
      ],
      image: "img/Bild10.1.png",
      hasTimer: false,
      name: ["Anna"],
      next: [
        { key: "In_der_Wohnung_Freundin_Joggen", label: "Weiter" }
      ]
    },

    Abkürzung_nicht_nutzen: {
      id: "Abkürzung_nicht_nutzen",
      text: ["Ich gehe weiter geradeaus, versuche aber, zügiger zu werden, ohne dass er es merkt. Ich spüre, wie sich ein Seitenstechen langsam entwickelt, und ich bin mir sicher, dass ich ihn nicht noch länger auf Trab halten kann. Deshalb fange ich so schnell, wie ich nur kann, an zu rennen.",
            "Dabei nehme ich die nächste rechte Verzweigung, um wieder etwas näher an unserem Wohnungskomplex zu sein."
      ],
      image: "img/Bild10.1.png",
      hasTimer: false,
      name: ["Anna"],
      next: [
        { key: "Abkürzung_nicht_nutzen_2", label: "Weiter" }
      ]
    },

    Abkürzung_nicht_nutzen_2: {
      id: "Abkürzung_nicht_nutzen_2",
      text: ["Nachdem ich rechts eingebogen bin, nehme ich eine große Mülltonne ins Visier, die mich vollständig verdecken könnte, wenn ich dahinterkauere. Rasch bewege ich mich in Richtung Tonne und hocke mich hin."
      ],
      image: "img/Bild12.1.png",
      hasTimer: false,
      name: ["Anna"],
      next: [
        { key: "Abkürzung_nicht_nutzen_3", label: "Weiter" }
      ]
    },

    Abkürzung_nicht_nutzen_3: {
      id: "Abkürzung_nicht_nutzen_3",
      text: ["Noch bevor ich ganz auf den Knien bin, presse ich meine zittrige Hand auf den Mund, in der Hoffnung, dass mein hektisches Atmen mich nicht verrät.",
            "Doch es waren keine Schritte seinerseits zu vernehmen. Sicherheitshalber hocke ich noch eine Weile da, um erstens sicher zu sein, dass er doch nicht kommen würde, und um meinen Atem wieder in den Griff zu bekommen.",
            "Sobald ich sicher war, dass er nicht mehr kommen würde, machte ich mich auch schon auf den Weg nach Hause."
      ],
      image: "img/Bild12.3.png",
      hasTimer: false,
      name: ["Anna"],
      next: [
        { key: "In_der_Wohnung_Freundin_Joggen", label: "Weiter" }
      ]
    },

    Direkt_nach_Hause: {
      id: "Direkt_nach_Hause",
      text: ["Ohne dass ich mich mit weiteren Gedanken herumschlage, mache ich mich auf direktem Weg nach Hause. Das ist zwar sehr riskant, denn nun weiß mein Verfolger, wo ich wohne, aber wenigstens kann er mich, wenn er das möchte, in meinem schönen Heim abmurksen und nicht auf der Straße."
      ],
      image: "img/Bild10.1.png",
      hasTimer: false,
      name: ["Anna"],
      next: [
        { key: "Direkt_nach_Hause_2", label: "Weiter" }
      ]
    },
    Direkt_nach_Hause_2: {
      id: "Direkt_nach_Hause_2",
      text: ["Spaß beiseite, über so etwas sollte ich keine Witze machen, und ich weiß auch nicht so recht, ob ich den Mädchen in der WG etwas davon erzählen soll, aber ich möchte sie auch nicht beunruhigen, und sie sind sowieso nicht sehr begeistert von mir, das würde die Situation nur noch verschlimmern."
      ],
      image: "img/Bild14.jpg",
      hasTimer: false,
      name: ["Anna"],
      next: [
        { key: "In_der_Wohnung_Freundin_Joggen", label: "Weiter" }
      ]
    },

    nicht_Joggen: {
      id: "nicht_Joggen",
      text: ["Für heute Abend lasse ich es sein und lege mich direkt schlafen. Früh am Morgen mache ich mich auf den Weg für die wöchentlichen Einkäufe, für die ich diese Woche zuständig bin."
      ],
      image: "img/Bild15.1.png",
      hasTimer: false,
      name: ["Anna"],
      next: [
        { key: "nicht_Joggen_2", label: "Weiter" }
      ]
    },
    nicht_Joggen_2: {
      id: "nicht_Joggen_2",
      text: ["Während ich mich auf dem Weg zum Supermarkt befinde, fühle ich mich beobachtet, und auch im Supermarkt gibt es einen Mann, der sich ständig im selben Abteil befindet.",
            "Es wirkt so, als würde er mich durch den ganzen Laden verfolgen, und dies lässt mir kalten Schweiß den Nacken herunterlaufen.",
            "Soll ich ihn konfrontieren oder schauen, dass ich zügig den Einkaufsladen verlassen kann?"
      ],
      image: "img/Bild4.png",
      hasTimer: false,
      name: ["Anna"],
      next: [
        { key: "konfrontieren", label: "konfrontieren" },
        { key: "nicht_konfrontieren", label: "ignorieren" }
      ]
    },

    konfrontieren: {
      id: "konfrontieren",
      text: ["Ich drehe mich um, damit ich ihn zur Rede stellen kann, doch sobald ich mich in seine Richtung gedreht habe, war er auch schon weg. Ich habe mir das nicht in meinem Kopf eingebildet, auf jeden Fall wurde ich vorhin von diesem Mann, wo auch immer er jetzt ist, verfolgt."
      ],
      image: "img/Bild6.png",
      hasTimer: false,
      name: ["Anna"],
      next: [
        { key: "In_der_Wohnung_Freundin_Einkaufen", label: "Weiter" }
      ]
    },

    nicht_konfrontieren: {
      id: "nicht_konfrontieren",
      text: ["Ich ignoriere ihn weiterhin und versuche dabei, keines der Produkte, die auf meiner Liste stehen, zu vergessen. Nach einer Weile höre ich, wie sich Schritte von mir wegbewegen, "
      ],
      image: "img/Bild7.png",
      hasTimer: false,
      name: ["Anna"],
      next: [
        { key: "nicht_konfrontieren_2", label: "Weiter" }
      ]
    },
    nicht_konfrontieren_2: {
      id: "nicht_konfrontieren_2",
      text: ["deshalb drehe ich mich um und werfe einen Blick auf seinen Einkaufskorb, der lediglich mit einer Flasche Wasser und einer Packung Kaugummi gefüllt ist."
      ],
      image: "img/Bild7.png",
      hasTimer: false,
      name: ["Anna"],
      next: [
        { key: "In_der_Wohnung_Freundin_Einkaufen", label: "Weiter" }
      ]
    },
    In_der_Wohnung_Freundin_Einkaufen: {
      id: "In_der_Wohnung_Freundin_Einkaufen",
      text: ["Als Anna vom Einkaufen zurückkommt, wirkt sie regelrecht beängstigt und auf der Hut, dabei erzählt sie von sich aus nicht, was passiert ist. Obwohl sie schon eine Weile mit uns zusammenlebt, ist sie immer noch sehr verschlossen und wird sich auch bald nicht öffnen, obwohl ich mir das von ihr wünschen würde."
      ],
      image: "img/Bild15.2.png",
      hasTimer: false,
      name: ["Freundin"],
      next: [
        { key: "In_der_Wohnung_Freundin_Einkaufen_2", label: "Weiter" }
      ]
    },
    In_der_Wohnung_Freundin_Einkaufen_2: {
      id: "In_der_Wohnung_Freundin_Einkaufen_2",
      text: ["Denn ich weiß von früher, bevor ihre Mutter und ihr Stiefvater vor fünf Jahren weggezogen sind, wie schwierig ihre Kindheit gewesen war, und wünsche mir von ganzem Herzen, dass es ihr jetzt besser geht."
      ],
      image: "img/Bild15.3.png",
      hasTimer: false,
      name: ["Freundin"],
      next: [
        { key: "Auf_dem_Sofa", label: "Weiter" }
      ]
    },
    In_der_Wohnung_Freundin_Joggen: {
      id: "In_der_Wohnung_Freundin_Joggen",
      text: ["Als Anna vom Joggen zurückkommt, wirkt sie regelrecht beängstigt und auf der Hut, dabei erzählt sie von sich aus nicht, was passiert ist. Obwohl sie schon eine Weile mit uns zusammenlebt, ist sie immer noch sehr verschlossen und wird sich auch bald nicht öffnen, obwohl ich mir das von ihr wünschen würde."
      ],
      image: "img/Bild15.2.png",
      hasTimer: false,
      name: ["Freundin"],
      next: [
        { key: "In_der_Wohnung_Freundin_Joggen_2", label: "Weiter" }
      ]
    },
    In_der_Wohnung_Freundin_Joggen_2: {
      id: "In_der_Wohnung_Freundin_Joggen_2",
      text: ["Denn ich weiß von früher, bevor ihre Mutter und ihr Stiefvater vor fünf Jahren weggezogen sind, wie schwierig ihre Kindheit gewesen war, und wünsche mir von ganzem Herzen, dass es ihr jetzt besser geht."
      ],
      image: "img/Bild15.3.png",
      hasTimer: false,
      name: ["Freundin"],
      next: [
        { key: "Auf_dem_Sofa", label: "Weiter" }
      ]
    },
    Auf_dem_Sofa: {
      id: "Auf_dem_Sofa",
      text: ["Bislang vertraut Anna sich mir nicht an, und ich will sie auch nicht dazu drängen. Ich überlege mir, dass wir zusammen ein paar Folgen Gossip Girl schauen könnten, als kleine Ablenkung. Wir haben es uns bereits auf dem Sofa gemütlich gemacht, als Annas Handy klingelt.",
            "Anna erschrickt so sehr, dass einige Popcornstücke aus dem Behälter fliegen."
      ],
      image: "img/Bild15.4.png",
      hasTimer: false,
      name: ["Freundin"],
      next: [
        { key: "Auf_dem_Sofa_2", label: "Weiter" }
      ]
    },
    
    Auf_dem_Sofa_2: {
      id: "Auf_dem_Sofa_2",
      text: ["Ich werfe einen Blick auf ihr Handy auf dem Kaffeetisch. Es ist eine unbekannte Nummer.",
            "Ich nehme ihr das Popcorn aus der Hand und sage: „Geh ran, es könnte wichtig sein.“"
      ],
      image: "img/Bild16.png",
      hasTimer: false,
      name: ["Freundin"],
      next: [
        { key: "Anna_geht_ran", label: "Weiter" }
      ]
    },
    Anna_geht_ran: {
      id: "Anna_geht_ran",
      text: ["Anna streckt ihre Hand nach ihrem iPhone aus und drückt auf Annehmen. Sie hält sich ihr Handy zögerlich ans Ohr und lauscht, ohne eine Begrüßung auszusprechen.",
            "In ihren Augen spiegelt sich Sorge, sie wirkt sehr erschrocken, zwar nicht so sehr wie vor einigen Tagen."
      ],
      image: "img/Bild17.png",
      hasTimer: false,
      name: ["Freundin"],
      next: [
        { key: "Anna_geht_ran_2", label: "Weiter" }
      ]
    },
    Anna_geht_ran_2: {
      id: "Anna_geht_ran_2",
      text: ["Als die Stimme in ihrem iPhone aufhört zu sprechen, beruhigt sie sich, und die Sorge in ihren Augen erlischt. Ich bemerke, dass ein Stein von ihrer Schulter gefallen ist, doch was genau war dieser Stein gewesen?",
            "Einige Minuten später höre ich auch schon, wie sich Anna verabschiedet; das einzige, was Anna während des ganzen Anrufs erwidert hat, waren zustimmendes „mhm“ und „ich texte dir meine Adresse“. Was genau meint sie mit Adresse? Wie kann es sein, dass sie zu Beginn des Anrufs so verängstigt war und jetzt auf einmal unsere Adresse preisgibt?"
      ],
      image: "img/Bild15.5.png",
      hasTimer: false,
      name: ["Freundin"],
      next: [
        { key: "Anna_läuft_weg", label: "Weiter" }
      ]
    },
    Anna_läuft_weg: {
      id: "Anna_läuft_weg",
      text: ["Als ich immer noch gedankenversunken versuche herauszufinden, was gerade passiert ist, steht Anna schweigsam auf und macht sich auf den Weg zu ihrem Zimmer.",
            "Das kann doch nicht ihr Ernst sein",
            "Soll ich Anna über den Anruf ausfragen?"
      ],
      image: "img/Bild15.6.png",
      hasTimer: false,
      name: ["Freundin"],
      next: [
        { key: "Anna_fragen", label: "Anna fragen" },
        { key: "Anna_nicht_fragen", label: "Anna nicht fragen" }
      ]
    },
    Anna_fragen: {
      id: "Anna_fragen",
      text: ["Sie kann das alles nicht im leeren Raum stehen lassen, deshalb frage ich sie, wer das am anderen Ende des Telefons war.",
            "Anna schaut nicht einmal zurück zu mir, als sie erwidert, es sei niemand gewesen – klar war es niemand gewesen, denn heutzutage führt man Selbstgespräche über das Telefon."
      ],
      image: "img/Bild15.6.png",
      hasTimer: false,
      name: ["Freundin"],
      next: [
        { key: "Mann_kommt", label: "Weiter" }
      ]
    },
    Anna_nicht_fragen: {
      id: "Anna_nicht_fragen",
      text: ["Ich bin immer noch überzeugt, dass Anna sich mir gegenüber öffnen wird, sobald sie bereit dazu ist. Aus diesem Grund lasse ich sie in ihr Zimmer zurückkehren und lasse mich ins Sofa zurückplumpsen. Dann schaue ich halt allein fern."
      ],
      image: "img/Bild15.6.png",
      hasTimer: false,
      name: ["Freundin"],
      next: [
        { key: "Mann_kommt", label: "Weiter" }
      ]
    },
    Mann_kommt:{
      id: "Mann_kommt",
      text: [""
      ],
      image: "img/Bild15.6.png",
      hasTimer: false,
      name: ["Freundin"],
      next: [
        { key: "", label: "Weiter" }
     ]
    },





    verloren: {
      id: "verloren",
      text: ["Weil ich mit den Gedanken irgendwo anders bin, stolppere ich. Ich spüre wie die Perosn näher kommt, doch anstatt mich zu greifen, berührt er mich an der Schulter. Sofort springe ich auf und renne weg."
      ],
      image: "img/weihnachtsbaumBild.jpg",
      hasTimer: false,
      next: [
        { key: "In_der_Wohnung_Freundin", label: "Direkt nach Hause" }
      ]
    },

    
    TextEingabeBsp: {
      id: "TextEingabeBsp",
      text: ["Direkt als du andere Schülerinnen und Schüler fragen willst, ob sie eine Jazz-Band gründen wollen, wirst du abgelenkt.",
        "Zu einer Runde Brawl Stars kannst du kaum Nein sagen.",
        "Wie heisst nochmals die In-Game-Währung, mit der man neue Brawler freischalten kann?",
        "Deine Mitschülerinnen und Mitschüler warten auf deine Antwort:", 
        "Wenn sie richtig ist, gehst du zur Lehrperson und fragst nach Tipps zur Gründung einer Jazz-Band.",
      ],
      image: "img/brawlStars.jpg",
      hasTimer: true,
      // Hier definieren wir die Benutzereingabe, die an diesem Story-Punkt benötigt wird.
      // Der SuccessKey enthält der Identifier des Story-Objekts, welches als nächstes ausgeführt werden soll
      // Der FailureKey enthält der Identifier des Story-Objekts, welches als nächstes ausgeführt werden soll, falls die Benutzereingabe falsch ist.
      // Die answer ist die richtige Antwort, die mit der Benutzereingabe verglichen wird.
      // Das Label ist der Text, der im Input-Feld als Platzhalter angezeigt wird.
      input: {  
        type: "text",
        label: "Gib hier deine Antwort ein:",
        answer: "Credits",
        successKey: "bandGruenden",
        failureKey: "brawlStarsVerlieren"
      }
    },
}

    

/**
 * Diese Funktion zeigt den Text normal an, ohne Type-Writer Effekt.
 */
async function displayTextNormally(text, isLastText){
    const p = document.createElement("p");
    p.innerText = text;
    textContainer.appendChild(p);

    // Falls der letzte Textabschnitt erreicht ist, soll kein Platzhalter mehr angezeigt werden und die Funktion soll direkt "beendet" werden, damit die nächsten Schritte (Buttons anzeigen, etc.) ausgeführt werden können.
    if(isLastText){
        return;
    }

    const placeHolder = document.createElement("p");
    placeHolder.innerText = "...";
    textContainer.appendChild(placeHolder);

    // Wir geben ein Versprechen (Promise) zurück, das nach X Millisekunden eingelöst wird
    return new Promise((resolve) => {
        setTimeout(() => { 
          resolve();
          placeHolder.remove();
        }, textDelay);
    });
}

/**
 * Diese Funktion wird als Type-Writer Effekt verwendet
 * Wir 
 * @param {*} text: Der Text der geschrieben wird
 * @return Promise: Ein "Verpsrechen", dass diese Funktion auch einmal "Fertig sein wird". Dort wo sie aber ausgeführt wird, soll auf 
 * die Funktion "gewartet" werden.
 */
function displayTextWithTypeWriter(text){

    return new Promise((resolve) => {

        // Neues Text-Element wird zum Phone hinzugefügt
        let newTextElement = document.createElement("p");

        // Das Element kommt in das Phone-Display
        textContainer.appendChild(newTextElement);

        // Diese Variable speichert den aktuellen Buchstaben (wir starten mit dem Buchstaben 0)
        let charIdx = 0;

        // Wir definieren eine Funktion, die den nächsten Buchstaben zum Text hinzugefügt wird
        function typeNextChar() {
            if (charIdx < text.length) {
                // Neuer Buchstabe wird hinzugefügt
                newTextElement.textContent += text.charAt(charIdx);
                // Buchstabennummer erhöhen
                charIdx++;
                // Nach 50 MS wird die Funktion wieder ausgeführt.
                setTimeout(typeNextChar, typeWriterSpeed); 
            } else {
                // Falls kein Buchstabe mehr vorhanden ist, wird das "Versprechen" erfüllt und die Funktion ist "beendet"
                resolve(); 
            }
        }

        // Die Funktion muss ausgeführt werden.
        typeNextChar();
    });
}

/**
 * Jede Story hat unter "next" mehrere Entscheidungen, die der Benutzer treffen kann.
 * Diese Funktion zeigt die Buttons für diese Entscheidungen an.
 * Bsp.: [{key: "bahnhof", label: "Weiter"}]
 * 
 * -> Ein Button mit dem Text "Weiter" wird angezeigt. 
 * Wenn der Benutzer darauf klickt, wird die Story mit dem Key "bahnhof" geladen.
 * 
 * Bsp.: [{key: "berg", label: "Auf den Berg"}, {key: "see", label: "Zum See"}]
 * 
 * -> Zwei Buttons mit den Texten "Auf den Berg" und "Zum See" werden angezeigt. 
 * Wenn der Benutzer aus "Auf den Berg" klickt, wird die Story mit dem Key "berg" geladen.
 * @param {*} buttonList 
 */
function displayDecisionButtons(buttonList){

  console.log("Display Decision Buttons wurde ausgeführt!")


    // Alle Buttons sollen angezeigt werden
    for(const button of buttonList){

        // Neuer Button mit dem Label wird erstellt
        let newButton = document.createElement("button");
        newButton.textContent = button.label;

        // Die Funktion, die ausgeführt wird, wenn der Button geklickt wird
        newButton.addEventListener("click", function(){
            // Der nächste Story-Punkt wird geladen
            nextStory(button.key);
        });

        buttonsAndInputs.appendChild(newButton);
    }
}

/**
 * Diese Funktion wird verwendet um eine Eingabe anzuzeigen
 * @param {*} inputConfig 
 */
function showInput(inputConfig){

    // Neues Input-Element wird erstellt
    let inputElement = document.createElement("input");
    inputElement.type = inputConfig.type;
    inputElement.placeholder = inputConfig.label;
    buttonsAndInputs.appendChild(inputElement);

    // Neuer Button zum Absenden der Eingabe
    let submitButton = document.createElement("button");
    submitButton.textContent = "Absenden";
    buttonsAndInputs.appendChild(submitButton);

    // Der EventLIstener auf dem Button, der geklickt wird wenn die Eingabe abgeschickt wird
    submitButton.addEventListener("click", function(){
        const userInput = inputElement.value;
        if (userInput.toLowerCase() === inputConfig.answer.toLowerCase()) {
            alert("Die Antwort " + userInput + " ist richtig! :)")
            nextStory(inputConfig.successKey);  
        } else {
            nextStory(inputConfig.failureKey);    
        } 

    });
}

/**
 * Diese Funktion zeigt einen Timer an, der herunterzählt. 
 * Wenn der Timer abläuft, ohne dass der Benutzer eine Entscheidung trifft, verliert er das Spiel.
 */
function displayTimer(){
    const timerBar = document.createElement("div");
    timerBar.classList.add("timer-bar");
    timerContainer.appendChild(timerBar);

    timerBar.style.animation = `countdown ${timerTime/1000}s linear forwards`;

    timerVariable = setTimeout(() => {
      timerBar.remove();
      nextStory("verloren");    
    }, timerTime); 
}

/**
 * Diese Funktion lädt den nächsten Story-Punkt
 * @param {*} key Der Key des nächsten Story-Punkts
 */
async function nextStory(key) {   
  
    // In der Variable "node" wird der aktuelle Story-Punkt gespeichert, damit wir einfacher darauf zugreifen können.
    // Bsp: key = "bahnhof" -> node = story["bahnhof"] -> node.text, node.image, node.next, etc. werden vom Bahnhof geladen
    const node = story[key];

    // Hier werden alle HTML-Elemnte zurückgesetzt, damit der neue Story-Punkt geladen werden kann.
    // Text und Entscheidungs-Container sollen leer sein
    textContainer.innerHTML = "";
    buttonsAndInputs.innerHTML = "";
    timerContainer.innerHTML = "";
    clearTimeout(timerVariable);



    // 1. Bild anzeigen
    if (node.image){
        imageContainer.style.display = "block";
        imageHolder.style.opacity = 0;       

        // Animation um Bild einblenden zu lassen
        setTimeout(() => {
            imageHolder.src = node.image;             
            imageHolder.style.opacity = 1; 
        }, 300); 
    } else {
        imageContainer.style.display = "none";
        imageHolder.src = "";
    }

    // 5. NAME??
    if (node.name) {
        nameDiv.textContent = node.name.join(" ");
    }
    
    // 2. Text schreiben
    for (let textIdx in node.text) {
        const text = node.text[textIdx];
        if(useTypeWriterEffect){
            await displayTextWithTypeWriter(text);
        } else {
            await displayTextNormally(text, textIdx == node.text.length-1);
        }
    }

    // 3. Benutzereingabe?
    if (node.input) {
        showInput(node.input);

        if(node.hasTimer){
            displayTimer();
        }
    }

    // 4. Normale Entscheidungen anzeigen
    if (node.next) {
        displayDecisionButtons(node.next);

        if(node.hasTimer){
            displayTimer();
        }
        
    }
}


async function startStory(key) {   
  
    // In der Variable "node" wird der aktuelle Story-Punkt gespeichert, damit wir einfacher darauf zugreifen können.
    // Bsp: key = "bahnhof" -> node = story["bahnhof"] -> node.text, node.image, node.next, etc. werden vom Bahnhof geladen
    const node = story["Familienhaus"];
    

    if (node.image){
        imageContainer.style.display = "block";
        imageHolder.style.opacity = 0;       

        // Animation um Bild einblenden zu lassen
        setTimeout(() => {
            imageHolder.src = node.image;             
            imageHolder.style.opacity = 1; 
        }, 300); 
    } else {
        imageContainer.style.display = "none";
        imageHolder.src = "";
    }


    // 5. NAME??
    if (node.name) {
        nameDiv.textContent = node.name.join(" ");
    }

    // 2. Text schreiben
    for (let textIdx in node.text) {
        const text = node.text[textIdx];
        if(useTypeWriterEffect){
            await displayTextWithTypeWriter(text);
        } else {
            await displayTextNormally(text, textIdx == node.text.length-1);
        }
    }

    // 3. Benutzereingabe?
    if (node.input) {
        showInput(node.input);

        if(node.hasTimer){
            displayTimer();
        }
    }

    // 4. Normale Entscheidungen anzeigen
    if (node.next) {
        displayDecisionButtons(node.next);

        if(node.hasTimer){
            displayTimer();
        }
        
    }
}
/**
 * Diese Funktion wird zum Start ausgeführt
 */
startButton.addEventListener("click", function(){
  console.log("StartButton Click wurde ausgeführt!")


    // Der Inhalt mit dem Start Button soll verschwinden
    document.getElementById("start-button-holder").style.display = "none";
    document.getElementById("main-title").style.display = "none";
    document.getElementById("SchneckeTitelbild").style.display = "none";
    document.getElementById("bottomRectangle").style.display = "none";

    document.body.classList.toggle("black-bg");

    // Die Geschichte beginnt
    storyContainer.style.display = "flex";
    startStory("Familienhaus");

  }); 