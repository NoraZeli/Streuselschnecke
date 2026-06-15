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
const audioPlayer = new Audio();

// In dieser Variable wird der Timer gespeichert, damit wir ihn auch wieder löschen können, falls der Benutzer rechtzeitig eine Entscheidung trifft.
let timerVariable;
let timerTime = 30000; // Zeit in Millisekunden, die der Benutzer für eine Entscheidung hat (aktuell 10 Sekunden)

let useTypeWriterEffect = true; // Hier kann eingestellt werden, ob der Type-Writer Effekt verwendet werden soll oder nicht. Falls nicht, wird der Text direkt angezeigt.
let typeWriterSpeed = 7; // Hier kann die Geschwindigkeit des Type-Writer Effekts eingestellt werden (aktuell 3 Millisekunden pro Buchstabe)
let textDelay = 2000; // Hier kann die Verzögerung zwischen den Textabschnitten eingestellt werden

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
      image: "img/Bild1.1.png",
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
        { key: "Zuhause", label: "Elf Monate später" }
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
      image: "img/Bild3.5.png",
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
        { key: "Links_abbiegen", label: "links" },
        { key: "Direkt_nach_Hause", label: "geradeaus nach Hause" },
        { key: "Rechts_abbiegen", label: "rechts" }
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
      image: "img/Bild7.1.png",
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
      audio: "img/Telefon.mp3",
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
      continueAudio: true,
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
      continueAudio: true,
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
      text: ["Anna hat sich so lange im Zimmer verkrochen, dass sogar Kim und Hannah von ihren Grasbesorgungen zurückgekommen sind. Die beiden gesellen sich zu mir auf die Couch, doch ich muss langsam das Abendessen für uns vier vorbereiten und begebe mich in die Küchennische."
      ],
      image: "img/Bild15.7.png",
      hasTimer: false,
      name: ["Freundin"],
      next: [
        { key: "Mann_kommt_2", label: "Weiter" }
     ]
    },
    Mann_kommt_2:{
      id: "Mann_kommt_2",
      text: ["Als ich gerade den Kühlschrank öffne, klingelt es an der Tür. Ich sehe zu Kim und Hannah rüber, die genauso verwirrt sind wie ich, denn wir haben niemanden heute Abend erwartet."
      ],
      image: "img/Bild15.8.png",
      hasTimer: false,
      name: ["Freundin"],
      next: [
        { key: "Mann_kommt_3", label: "Weiter" }
     ]
    },
    Mann_kommt_3:{
      id: "Mann_kommt_3",
      text: ["Bis mir der Anruf von Anna in den Sinn kommt, und sogleich kommt auch schon Anna, geschminkt und aufgebrezelt, aus ihrem Versteck heraus.",
            "Man kann ihr anmerken, dass sie aus irgendeinem Grund nervös ist, denn sie kaut auf ihrer Unterlippe und spielt mit dem Ärmel ihres Oberteils."
      ],
      image: "img/Bild15.9.png",
      hasTimer: false,
      name: ["Freundin"],
      next: [
        { key: "Mann_kommt_4", label: "Weiter" }
     ]
    },
    Mann_kommt_4:{
      id: "Mann_kommt_4",
      text: ["Sie öffnet die Tür, und ein schüchterner, zurückhaltender Mann mit Jeans und T-Shirt steht ihr gegenüber. Wie ich von der Küche aus sehen kann, spielt sich ein Lächeln um seine Lippen, als er etwas sagt und hinter sich deutet. Anna nickt und folgt ihm nach draußen.",
            "Ich hätte nie gedacht, dass Anna auf ältere Männer steht, aber es gibt für alles ein erstes Mal, und wir haben außerdem nie über Jungs geredet oder sonst viel über irgendetwas anderes."
      ],
      image: "img/Bild19.png",
      hasTimer: false,
      name: ["Freundin"],
      next: [
        { key: "Auto", label: "Weiter" }
     ]
    },

    Auto:{
      id: "Auto",
      text: ["Beim Anruf hatte er mir seinen Namen genannt und gestanden, dass er derjenige gewesen war, der mich vor ein paar Tagen verfolgt hatte. Daraufhin hatte er mich gefragt, ob er mich kennenlernen dürfe. Ich hatte zwar schon viel über solche Treffen gehört und mir oft vorgestellt, wie so etwas wäre."
      ],
      image: "img/Bild20.png",
      hasTimer: false,
      name: ["Anna"],
      next: [
        { key: "Auto_2", label: "Weiter" }
     ]
    },
    Auto_2:{
      id: "Auto_2",
      text: ["Ich weiß immer noch nicht, was ich von dieser Situation halten soll, und es schwirren sehr viele Fragen in meinem Kopf herum.",
            "Soll ich ihn fragen, wie er meine Nummer ausfindig machen konnte?"
      ],
      image: "img/Bild20.png",
      hasTimer: false,
      name: ["Anna"],
      next: [
        { key: "Auto_ja", label: "Ja" },
        { key: "Auto_nein", label: "Nein" }
     ]
    },
    Auto_ja:{
      id: "Auto_ja",
      text: ["Als ich die Frage stelle, wird er zögerlich, und nach einer Weile antwortet er: „Ich habe Isabel danach gefragt.“",
            "Sobald er ihren Namen gesagt hat, kehrt die Stille im Auto zurück."
      ],
      image: "img/Bild21.png",
      hasTimer: false,
      name: ["Anna"],
      next: [
        { key: "nächsterTag", label: "Nächster Tag" }
     ]
    },
    Auto_nein:{
      id: "Auto_nein",
      text: ["Ich entscheide mich, die Frage nicht zu stellen, da ich schon eine Vermutung habe, was seine Antwort darauf sein wird.",
            "Die restliche Autofahrt bleibt still, da keiner von uns etwas sagt."
      ],
      image: "img/Bild20.png",
      hasTimer: false,
      name: ["Anna"],
      next: [
        { key: "nächsterTag", label: "Nächster Tag" }
     ]
    },

    nächsterTag:{
      id: "nächsterTag",
      text: ["An dem darauffolgenden Tag der Verabredung entscheide ich mich, meine Schwester mal wieder anzurufen, um mich zu vergewissern, dass es ihr gut geht.",
            "Ich wähle ihre Nummer, und mein Handy kann nicht einmal einige piepende Töne von sich geben, als ich ihre Stimme aus dem Lautsprecher wahrnehme."
      ],
      image: "img/Bild22.0.png",
      hasTimer: false,
      name: ["Anna"],
      next: [
        { key: "nächsterTag_2", label: "Weiter" }
     ]
    },
    nächsterTag_2:{
      id: "nächsterTag_2",
      text: ["Sie fragt, wie es mir gehe und was ich in der letzten Zeit getrieben habe.",
            "Soll ich die Verabredung ihr gegenüber erwähnen?"
      ],
      image: "img/Bild22.png",
      hasTimer: false,
      name: ["Anna"],
      input: {
        type: "text",
        label: "Gib hier deine Antwort ein: ja oder nein",
        answer: "ja",
        successKey: "nächsterTag_ja",
        failureKey: "nächsterTag_nein"
      }
    },
    nächsterTag_ja:{
      id: "nächsterTag_ja",
      text: ["Ich sage: „Ich bin gestern mit einem Mann ausgegangen.“",
            "Daraufhin antwortet sie: „Uh… mit einem Mann?“"
      ],
      image: "img/Bild22.3.png",
      hasTimer: false,
      name: ["Anna"],
      next: [
        { key: "nächsterTag_ja2", label: "Weiter"}
     ]
    },
    nächsterTag_ja2:{
      id: "nächsterTag_ja2",
      text: ["„Ja, ein Mann… er hatte mich zum Café Richter mitgenommen, danach waren wir im Kino, es war ein Film von Rohmer. Zum Schluss nahm er mich ins Restaurant und stellte mich seinen Freunden vor“, erwidere ich.",
            "„Er stellte dich schon seinen Freunden vor, beim ersten Date?“, schreit sie, ohne jegliches Mitleid mit meinem Trommelfell zu haben."
      ],
      image: "img/Bild22.3.png",
      hasTimer: false,
      name: ["Anna"],
      next: [
        { key: "nächsterTag_ja3", label: "Weiter"}
     ]
    },
    nächsterTag_ja3:{
      id: "nächsterTag_ja3",
      text: ["„Mhm…“",
            "Einige andere Dinge, die ich während der Verabredung erfahren habe, möchte ich zurzeit für mich behalten und sie damit nicht noch mehr belasten."
      ],
      image: "img/Bild23.png",
      hasTimer: false,
      name: ["Anna"],
      next: [
        { key: "nächsterTag_3", label: "Weiter"}
     ]
    },

    nächsterTag_nein:{
      id: "nächsterTag_nein",
      text: ["Ich fühle mich sehr schuldig, dass ich ihr diese Information vorenthalte, denn ich verheimliche ihr ungern Dinge.",
            "Trotzdem antworte ich lediglich mit: „nichts Besonderes“."
      ],
      image: "img/Bild23.png",
      hasTimer: false,
      name: ["Anna"],
      next: [
        { key: "nächsterTag_3", label: "Weiter"}
     ]
    },
    nächsterTag_3:{
      id: "nächsterTag_3",
      text: ["Ich frage sie, wie es ihr momentan geht, und daraufhin antwortet sie: „Es geht mir gut.“",
            "Soll ich sie noch etwas anderes fragen?"
      ],
      image: "img/Bild24.png",
      hasTimer: false,
      name: ["Anna"],
      next: [
        { key: "situation_fragen", label: "Ist die Situation zuhause besser geworden?"},
        { key: "ImmerNochDa_fragen", label: "Ist er immer noch da?"},
        { key: "EtwasZsmUnternehmen", label: "Wollen wir mal wieder etwas zusammen unternehmen?"}

     ]
    },
    situation_fragen:{
      id: "situation_fragen",
      text: ["Eine lange Funkstille ist eingetreten, nachdem ich sie das gefragt habe. Ich weiß, dass ich eine wunde Stelle bei ihr getroffen habe, denn ich hätte genau gleich wie sie mit Schweigen geantwortet.",
        "Doch dann antwortet sie trotzdem: „Ja, es hat sich um einiges gebessert, denn Mama trinkt jetzt etwas weniger, seitdem du gegangen bist. Im Übrigen vermissen wir dich alle sehr.“"
      ],
      image: "img/Bild24.png",
      hasTimer: false,
      name: ["Anna"],
      next: [
        { key: "situation_fragen2", label: "Weiter"}
     ]
    },
    situation_fragen2:{
      id: "situation_fragen2",
      text: ["Jaaa, klar vermissen mich alle, der Mann von Mama macht sicher Freudentänze, seitdem ich weg bin, denn jetzt kann er tun und lassen, was er will mit meiner Schwester, ohne dass ich ihm die Stirn biete."
      ],
      image: "img/Bild24.png",
      hasTimer: false,
      name: ["Anna"],
      next: [
        { key: "situation_S", label: "Weiter"}
     ]
    },
    situation_S:{
      id: "situation_S",
      text: ["Wenn ich ehrlich bin, hat sich nichts verbessert, und Mama vermisst Anna gar nicht mal, oder sie lässt es sich nicht anmerken. Über unseren Stiefvater muss ich gar nicht reden, denn dem geht’s blendend, seitdem Anna nicht mehr hier ist. Seit sie weg ist, gibt es niemanden mehr, der ihm die Stirn bietet. Ich selbst kann dafür keinen Mut aufbringen. Denn Mama schläft meistens nach der Arbeit aufgrund all des Biers und jeglicher anderen Spirituosen, die sie in sich hineinkippt, ein."
      ],
      image: "img/Bild25.png",
      hasTimer: false,
      name: ["Schwester"],
      next: [
        { key: "situation_S2", label: "Weiter"}
     ]
    },
    situation_S2:{
      id: "situation_S2",
      text: ["Manchmal genügte auch ein umgekipptes Glas oder ein falsch gedeckter Tisch, damit die Stimmung unseres Stiefvaters kippte.",
        "Ohne Anna war es zuhause einfach nicht dasselbe, aber ich bin froh, dass wenigstens sie entkommen konnte."
      ],
      image: "img/Bild25.png",
      hasTimer: false,
      name: ["Schwester"],
      next: [
        { key: "situation_S3", label: "Weiter"}
     ]
    },
    situation_S3:{
      id: "situation_S3",
      text: ["„Ich schwöre dir, ich werde genügend Geld auftreiben, sodass ich dich von ihnen befreien kann. Du musst nur noch etwas aushalten“, sagte Anna mit bebender Stimme.",
        "Aus diesem Grund wollte ich ihr nicht die Wahrheit über die Lage zuhause preisgeben, denn ich kenne sie gut und weiß, dass es sie auffressen würde und sie sich nur selbst die Schuld an allem geben würde."
      ],
      image: "img/Bild25.png",
      hasTimer: false,
      name: ["Schwester"],
      next: [
        { key: "unterhalten", label: "Weiter"}
     ]
    },

    ImmerNochDa_fragen:{
      id: "ImmerNochDa_fragen",
      text: ["Nachdem ich die Frage an meine Schwester gestellt habe, kommt eine Weile lang keine Antwort, und ich habe schon befürchtet, dass sie aufgelegt hat, als aus dem Hörer ein knappes „Ja“ zu hören ist.",
        "Ich wollte sie nicht zu mehr drängen und finde, ich habe auch nicht das Recht dazu, denn ich lebe schon seit einem Jahr nicht mehr unter dem Einfluss der beiden."
      ],
      image: "img/Bild24.png",
      hasTimer: false,
      name: ["Anna"],
      next: [
        { key: "ImmerNochDa_S", label: "Weiter"}
     ]
    },
    ImmerNochDa_S:{
      id: "ImmerNochDa_S",
      text: ["Klar gefällt es mir nicht, meine Schwester anzulügen, doch ich möchte nicht, dass sie sich die Schuld für Dinge gibt, für die eigentlich unsere Mutter verantwortlich ist.",
        "Deshalb antworte ich nur mit einem knappen „Ja“, obwohl sich zu Hause überhaupt nichts verändert hat. "
      ],
      image: "img/Bild24.png",
      hasTimer: false,
      name: ["Schwester"],
      next: [
        { key: "ImmerNochDa_S2", label: "Weiter"}
     ]
    },
    ImmerNochDa_S2:{
      id: "ImmerNochDa_S2",
      text: ["Unser Stiefvater ist noch immer da, und Mama wird sich wohl auch nicht so schnell von ihm trennen. Er bringt zusätzliches Geld ins Haus und hält uns finanziell über Wasser. Dadurch bleibt ihr sogar noch etwas mehr von ihrem Lohn übrig, das sie für Bier und andere Spirituosen ausgeben kann."
      ],
      image: "img/Bild25.png",
      hasTimer: false,
      name: ["Schwester"],
      next: [
        { key: "ImmerNochDa_S3", label: "Weiter"}
     ]
    },
    ImmerNochDa_S3:{
      id: "ImmerNochDa_S3",
      text: ["Mama will bis heute nicht einsehen, dass sie Mitschuld daran trägt, dass Anna gegangen ist. Sie hat nichts an ihrem Leben geändert, damit ich nicht irgendwann denselben Entschluss fasse.",
        "Und er ist kein Stück besser. Früher ließ er seinen Frust an Anna aus, heute trifft es meistens mich."
      ],
      image: "img/Bild25.png",
      hasTimer: false,
      name: ["Schwester"],
      next: [
        { key: "unterhalten", label: "Weiter"}
     ]
    },

    unterhalten:{
      id: "unterhalten",
      text: ["Nach unserem holprigen Start und dem langen Schweigen, weil wir beide in Gedanken versunken sind, wechseln wir langsam das Thema und unterhalten uns eine Weile. Wir verabreden uns für nächste Woche, denn in naher Zukunft werden wir uns wieder daran gewöhnen müssen, zusammenzuleben."
      ],
      image: "img/Bild25.1.png",
      hasTimer: false,
      name: ["Anna"],
      next: [
        { key: "Besuch_bei_Arbeit", label: "Ihn besuchen gehen" }
     ]
    },
    EtwasZsmUnternehmen:{
      id: "EtwasZsmUnternehmen",
      text: ["„Ich weiß nicht, ob ich dir das schon mal erzählt habe, aber als du etwa vier Jahre alt warst, sind Mama, du und ich zusammen einkaufen gegangen. Du hast vorne im Einkaufswagen gesessen. Als wir zur Kasse kamen, hat die Kassiererin dich angeschaut und gemeint, du seist süß.",
            "Du hast in der Nase gepopelt und sie stolz mit ausgestreckter Hand gefragt: «Hier. Willst du einen Popel?»"
      ],
      image: "img/Bild25.2.png",
      hasTimer: false,
      name: ["Anna"],
      next: [
        { key: "EtwasZsmUnternehmen_2", label: "Weiter"}
     ]
    },
    EtwasZsmUnternehmen_2:{
      id: "EtwasZsmUnternehmen_2",
      text: ["Meine Schwester fing laut an zu lachen. „Igitt, wie eklig!“, rief sie dazwischen, während sie kaum noch Luft bekam. Ich konnte mir richtig vorstellen, wie ihre Wangen rot wurden und sie versuchte, die Tränen vor Lachen zurückzuhalten. Sie so lachen zu hören, entfachte eine Wärme in meiner Brust, und ich wünschte mir, sie würde öfter so lachen.",
            "„Ja, schäm dich“, sagte ich mit einem Grinsen."
      ],
      image: "img/Bild25.1.png",
      hasTimer: false,
      name: ["Anna"],
      next: [
        { key: "EtwasZsmUnternehmen_3", label: "Weiter"}
     ]
    },
    EtwasZsmUnternehmen_3:{
      id: "EtwasZsmUnternehmen_3",
      text: ["„Du darfst das niemandem erzählen. Was wäre das für eine Blamage, wenn jeder wüsste, dass ich Popel wie Geschenke verteilt habe“, sagte sie, während sie noch immer versuchte, ihr Lachen zu unterdrücken.",
            "„Hast du Lust, nächste Woche bowlen zu gehen?“, fragte ich, nachdem ich merkte, dass sie sich beruhigt hatte.",
            "Ihre Antwort war ein fröhliches: „Finde ich mega!“"
      ],
      image: "img/Bild25.3.png",
      hasTimer: false,
      name: ["Anna"],
      next: [
        { key: "Besuch_bei_Arbeit", label: "Ihn Besuchen gehen" }
     ]
    },
    Besuch_bei_Arbeit:{
      id: "Besuch_bei_Arbeit",
      text: ["Einige Tage später besuche ich den Mann bei der Arbeit, wo er als Drehbuchautor arbeitet und Regie bei Filmen führt."
      ],
      image: "img/Bild26.png",
      hasTimer: false,
      name: ["Anna"],
      next: [
        { key: "Besuch_bei_Arbeit_2", label: "Weiter"}
     ]
    },
    Besuch_bei_Arbeit_2:{
      id: "Besuch_bei_Arbeit_2",
      text: ["Sein Büro ist ordentlich aufgeräumt und er besitzt einige Auszeichnungen an den Wänden, die ich mir noch nicht so genau aus der Nähe betrachten konnte. Wie es scheint, ist er nicht schlecht in dem, was er tut.",
            "Während unserer Treffen hatte ich mich schon mehrmals gefragt, ob er mir Geld dafür geben würde, dass wir uns treffen. Doch er gab mir keins.",
            "Soll ich ihn darum bitten?"
      ],
      image: "img/Bild27.png",
      hasTimer: false,
      name: ["Anna"],
      next: [
        { key: "Geld_bitten", label: "Geld bitten"},
        { key: "Geld_nicht_bitten", label: "Geld nicht bitten"}
     ]
    },
    Geld_bitten:{
      id: "Geld_bitten",
      text: ["Ich schulde anderen normalerweise ungern etwas und bin nicht begeistert, wenn ich von jemandem abhängig bin. Doch es würde mein Leben immerhin vereinfachen.",
            "Deshalb fasse ich mir Mut und frage ihn."
      ],
      image: "img/Bild 27.1.png",
      hasTimer: false,
      name: ["Anna"],
      next: [
        { key: "Geld_bitten_2", label: "Weiter"},
     ]
    },
    Geld_bitten_2:{
      id: "Geld_bitten_2",
      text: ["Er kratzt sich am Kopf und wirkt dabei verlegen. Ich sehe, wie bei ihm die Zahnräder im Kopf arbeiten.",
            "Dann antwortet er: „Äh… ich… dachte, du wärst schon versorgt.“",
            "Eine kurze Pause.",
            "„Entschuldige… das hätte ich nicht annehmen sollen. Wenn du Hilfe brauchst, könnte ich dir etwas geben.“"
      ],
      image: "img/Bild29.png",
      hasTimer: false,
      name: ["Anna"],
      next: [
        { key: "Geld_bitten_3", label: "Weiter"},
     ]
    },
    Geld_bitten_3:{
      id: "Geld_bitten_3",
      text: ["Ruckartig schüttle ich den Kopf. Peinlich berührt von seiner Antwort merke ich, wie ich wahrscheinlich knallrot werde. Das hätte ich nicht fragen sollen — was für ein Dussel bin ich nur.",
            "Ich brauche seine Hilfe nicht. Ich kann gut für mich allein sorgen. Es ist nicht ohne Grund, dass ich neben der Schule putze und Kinder hüte. Bald werde ich sowieso alt genug sein, um als Kellnerin zu arbeiten, und vielleicht wird ja irgendwann noch etwas Richtiges aus mir."
      ],
      image: "img/Bild28.1.png",
      hasTimer: false,
      name: ["Anna"],
      next: [
        { key: "Geld_bitten_4", label: "Weiter"},
     ]
    },
    Geld_bitten_4:{
      id: "Geld_bitten_4",
      text: ["Ich werde aus meinen Gedanken gerissen, als er stolz verkündet, er würde schnell sein bestes Drehbuch holen, um es mir zu zeigen.",
            "Bevor ich auch nur eine Zustimmung erwidern kann, verlässt er den Raum."
      ],
      image: "img/Bild28.png",
      hasTimer: false,
      name: ["Anna"],
      next: [
        { key: "Bilderrahmen", label: "Weiter"},
     ]
    },
    Geld_nicht_bitten:{
      id: "Geld_nicht_bitten",
      text: ["Ich unterlasse es, ihn nach Geld zu fragen, denn eigentlich kann ich mich auch gut selbst versorgen. Ein Jahr lang konnte ich mich selbst über Wasser halten mit Putzen und Kinder hüten, während ich noch immer in die Schule gehe, und bald kann ich auch als Kellnerin arbeiten gehen."
      ],
      image: "img/Bild31.png",
      hasTimer: false,
      name: ["Anna"],
      next: [
        { key: "Geld_nicht_bitten_2", label: "Weiter"},
     ]
    },
    Geld_nicht_bitten_2:{
      id: "Geld_nicht_bitten_2",
      text: ["Mit halber Aufmerksamkeit nehme ich wahr, dass der Mann eines seiner Drehbücher holen will, damit er es mir zeigen kann."
      ],
      image: "img/Bild32.png",
      hasTimer: false,
      name: ["Anna"],
      next: [
        { key: "Bilderrahmen", label: "Weiter"},
     ]
    },
    Bilderrahmen:{
      id: "Bilderrahmen",
      text: ["Während er abwesend ist, nehme ich mir die Zeit, um in seinem Büro umherzugehen."
      ],
      image: "img/Bild33.png",
      hasTimer: false,
      name: ["Anna"],
      next: [
        { key: "Bilderrahmen_2", label: "Weiter"},
     ]
    },
    Bilderrahmen_2:{
      id: "Bilderrahmen_2",
      text: ["Dabei schaue ich mir die Auszeichnungen, die an der Wand hängen, etwas genauer an. Eines davon ist ein Zertifikat der Lola und darunter die dazugehörige goldene Statuette. Von der Lola habe ich im Fernsehen schon einiges gehört, aber ich verfolge solche Filmpreisverleihungen nicht wirklich."
      ],
      image: "img/Bild33.1.png",
      hasTimer: false,
      name: ["Anna"],
      next: [
        { key: "Bilderrahmen_3", label: "Weiter"},
     ]
    },
    Bilderrahmen_3:{
      id: "Bilderrahmen_3",
      text: ["Mein Blick wandert weiter zu seinem Schreibtisch, auf dem ein umgedrehter Bilderrahmen steht.",
            "Soll ich den Rahmen umdrehen?"
      ],
      image: "img/Bild35.png",
      hasTimer: false,
      name: ["Anna"],
      next: [
        { key: "Bilderrahmen_umdrehen", label: "Ja" },
        { key: "Bilderrahmen_nicht_umdrehen", label: "Nein" }
     ]
    },
    Bilderrahmen_umdrehen:{
      id: "Bilderrahmen_umdrehen",
      text: ["Ich bin nun mal neugierig und gebe, ohne weiter nachzudenken, nach. Als ich das Bild umdrehe, lächelt mir ein junger Mann entgegen. Auf seinem Schoß sitzt ein kleines Mädchen, sicher zwei oder drei Jahre alt. Sie hat die Finger im Mund."
      ],
      image: "img/Bild38.png",
      hasTimer: false,
      name: ["Anna"],
      next: [
        { key: "Bilderrahmen_umdrehen_2", label: "Weiter"},
     ]
    },
    Bilderrahmen_umdrehen_2:{
      id: "Bilderrahmen_umdrehen_2",
      text: ["Der Anblick dieses Bildes weckt eine Erinnerung in mir. Wie ich zusammengekauert unter der Bettdecke liege und versuche einzuschlafen, doch der Streit von Mama und Papa dringt ganz leicht durch meine Zimmertür hindurch. Ich kann mich noch erinnern, dass im Streit Worte wie Karriere, Chancen und Träume gefallen sind."
      ],
      image: "img/Bild39.png",
      hasTimer: false,
      name: ["Anna"],
      next: [
        { key: "Bilderrahmen_umdrehen_3", label: "Weiter"},
     ]
    },
    Bilderrahmen_umdrehen_3:{
      id: "Bilderrahmen_umdrehen_3",
      text: ["Lange kann ich nicht über diese Erinnerung nachdenken, denn ich höre ihn schon kommen, und bevor er mich erwischen kann, drehe ich den Rahmen wieder um."
      ],
        image: "img/Bild36.png",
      hasTimer: false,
      name: ["Anna"],
      next: [
        { key: "Bilderrahmen_umdrehen_4", label: "Weiter"},
     ]
    },
     Bilderrahmen_umdrehen_4:{
      id: "Bilderrahmen_umdrehen_4",
      text: ["Als er an der Tür ankommt, kreuzen sich unsere Blicke, und er fragt, ob es mir gut gehe, denn ich sehe etwas bestürzt aus.",
            "Daraufhin antworte ich, dass ich auch selbst hoffe, einmal so erfolgreich zu werden wie er. Dabei zeige ich auf die goldene Lola-Statuette."
      ],
        image: "img/Bild37.png",
      hasTimer: false,
      name: ["Anna"],
      next: [
        { key: "Bilderrahmen_umdrehen_5", label: "Weiter"},
     ],
    },
    Bilderrahmen_umdrehen_5:{
      id: "Bilderrahmen_umdrehen_5",
      text: ["Sein Mund verzieht sich zu einem traurigen Lächeln, und er winkt mich zu sich herbei.",
            "„Komm, ich zeige dir, wie ein Drehbuch aufgebaut ist.“"
      ],
        image: "img/Bild37.1.png",
      hasTimer: false,
      name: ["Anna"],
      next: [
        { key: "Zwei_Jahre_später", label: "Zwei Jahre später"},
     ],
    },
    Bilderrahmen_nicht_umdrehen:{
      id: "Bilderrahmen_nicht_umdrehen",
      text: ["Mein Blick bleibt kurz an dem Bilderrahmen hängen, doch ich entscheide mich, ihn nicht umzudrehen. Denn ich möchte seine Privatsphäre respektieren, und so gut kennen wir uns auch nicht, dass ich einfach in seinen Sachen herumschnüffeln kann."
      ],
        image: "img/Bild36.png",
      hasTimer: false,
      name: ["Anna"],
      next: [
        { key: "Bilderrahmen_nicht_umdrehen_2", label: "Weiter"},
     ],
    },
    Bilderrahmen_nicht_umdrehen_2:{
      id: "Bilderrahmen_nicht_umdrehen_2",
      text: ["Deshalb drehe ich mich um und lasse den Blick ein letztes Mal durch den Raum schweifen, bevor er seinen Kopf durch den Türrahmen steckt. Sein Mund ist zu einem Lächeln verzogen, und er hält mir das Drehbuch entgegen.",
            "Dabei sagt er: „Hab’s gefunden!“"
      ],
        image: "img/Bild37.png",
      hasTimer: false,
      name: ["Anna"],
      next: [
        { key: "Zwei_Jahre_später", label: "Zwei Jahre später"},
     ],
    },
    Zwei_Jahre_später:{
      id: "Zwei_Jahre_später",
      text: ["Zwei Jahre nach unserem ersten Treffen sagt er mir, dass er krank ist. Obwohl wir in diesen zwei Jahren sehr viel Zeit miteinander verbracht haben, sind wir uns immer noch etwas fremd.",
            "Doch ich besuche ihn so oft, wie ich nur kann. Er hat auch meine Schwester kennengelernt, und die beiden verstehen sich sehr gut, da sie genauso interessiert an Filmen ist wie er selbst."
      ],
        image: "img/Bild40.1.png",
      hasTimer: false,
      name: ["Anna"],
      next: [
        { key: "Zwei_Jahre_später_2", label: "Weiter"},
     ],
    },
    Zwei_Jahre_später_2:{
      id: "Zwei_Jahre_später_2",
      text: ["Als ich ihn zum dritten Mal in dieser Woche besuche, fragt er mich, ob ich ihm Morphium besorgen könnte, weil er Angst vor dem Tod hat und es schnell hinter sich bringen will.",
            "Ich entscheide mich, ihm keines zu bringen. Stattdessen frage ich ihn, ob er etwas anderes möchte.",
            "Hustend antwortet er: „Ich hätte gerne Streuselschnecken.“"
      ],
        image: "img/Bild40.2.png",
      hasTimer: false,
      name: ["Anna"],
      next: [
        { key: "Streuselschnecken_bringen", label: "Weiter"},
     ],
    },
    Streuselschnecken_bringen:{
      id: "Streuselschnecken_bringen",
      text: ["Bei meinem nächsten Besuch bringe ich ihm diese, sogar zwei Bleche davon. Ich lege die Streuselschnecken auf die Fensterbank.",
            "Soll ich ihm noch einige Fragen stellen, weil seine Zeit begrenzt ist und er sonst so wenig über sich und die Vergangenheit spricht?"
      ],
        image: "img/Bild41.png",
      hasTimer: false,
      name: ["Anna"],
      input: {
          type: "text",
          label: "Gib hier deine Antwort ein: ja oder nein",
          answer: "ja",
          successKey: "Fragen_stellen",
          failureKey: "Streuselschnecke_essen"
        }
    },
    Fragen_stellen:{
      id: "Fragen_stellen",
      text: ["Ich gehe auf ihn zu und setze mich neben ihn.",
            "„Weshalb hast du dir Streuselschnecken gewünscht?“, frage ich ihn."
      ],
        image: "img/Bild43.png",
      hasTimer: false,
      name: ["Anna"],
      next: [
        { key: "Rückblick_Isabel", label: "Weiter"},
     ],
    },
    Rückblick_Isabel:{
      id: "Rückblick_Isabel",
      text: ["Daraufhin antwortet er: „Isabel backte früher immer die köstlichsten Streuselschnecken, bevor unsere Beziehung den Bach runterging. Bevor ich immer länger von zu Hause weg war, um meine Träume als Drehbuchautor und Regisseur zu verwirklichen. Bevor wir anfingen zu streiten und bevor ich euch mit ihr allein ließ.“"
      ],
        image: "img/Bild42.png",
      hasTimer: false,
      name: ["Anna"],
      next: [
        { key: "Fragen_stellen_2", label: "Weiter"},
     ],
    },
    Fragen_stellen_2:{
      id: "Fragen_stellen_2",
      text: ["Seine Aussage ließ meine Augen nass werden. Ehe ich es verhindern konnte, rollen Tränen über meine Wangen.",
          "Ich möchte noch mehr Gewissheit erlangen und ihm auch die Chance geben, sich zu erklären.",
          "Soll ich ihm noch eine Frage stellen?"
      ],
        image: "img/Bild43.png",
      hasTimer: false,
      name: ["Anna"],
      next: [
        { key: "weitere_Fragen_stellen", label: "Noch eine Frage stellen" },
        { key: "Streuselschnecke_essen", label: "Keine weiteren Fragen stellen" }
     ],
    },
    weitere_Fragen_stellen:{
      id: "weitere_Fragen_stellen",
      text: ["Ohne dass ich ihn noch länger warten lasse, frage ich ihn: „Warum hast du mich erst vor 3 Jahren kontaktiert, warum nicht früher?“"
      ],
        image: "img/Bild43.png",
      hasTimer: false,
      name: ["Anna"],
      next: [
        { key: "weitere_Fragen_stellen_2", label: "Weiter" },
     ],
    },
    weitere_Fragen_stellen_2:{
      id: "weitere_Fragen_stellen_2",
      text: ["Er muss einige Minuten darüber nachdenken und wirkt auf einmal trauriger als vorher. Ich hätte das nicht fragen sollen. Doch ich kann nun mal nicht zurücknehmen, was ich gesagt habe."
      ],
        image: "img/Bild44.png",
      hasTimer: false,
      name: ["Anna"],
      next: [
        { key: "weitere_Fragen_stellen_3", label: "Weiter" },
     ],
    },
    weitere_Fragen_stellen_3:{
      id: "weitere_Fragen_stellen_3",
      text: ["„Ich dachte, du könntest mir nicht verzeihen, nachdem ich euch verlassen habe, denn ich konnte es mir selbst auch nicht verzeihen. Ich war jung und realisierte nicht, welche Folgen meine Abwesenheit für euch hätte. Ich hatte nur an mich selbst gedacht“, erwidert er ganz aufgewühlt und den Tränen nahe."
      ],
        image: "img/Bild44.1.png",
      hasTimer: false,
      name: ["Anna"],
      next: [
        { key: "Streuselschnecke_essen", label: "Weiter" },
     ],
    },
    Streuselschnecke_essen:{
      id: "Streuselschnecke_essen",
      text: ["Ich wollte ihn nicht noch mehr mit meinen Fragen löchern, sodass er seine Streuselschnecke in Ruhe essen kann."
      ],
        image: "img/Bild45.png",
      hasTimer: false,
      name: ["Anna"],
      next: [
        { key: "Streuselschnecke_essen_2", label: "Weiter" },
     ],
    },
    Streuselschnecke_essen_2:{
      id: "Streuselschnecke_essen_2",
      text: ["Nachdem er sich mit einem schwachen Lächeln die Finger sauberleckt – obwohl er nur zwei kleine Bisse von seiner Streuselschnecke genommen hatte –, sagt er: „Ich hätte gerne mit dir und deiner Schwester zusammengelebt und dachte, ich hätte noch Zeit.“"
      ],
        image: "img/Bild47.png",
      hasTimer: false,
      name: ["Anna"],
      next: [
        { key: "Streuselschnecke_essen_3", label: "Weiter" },
     ],
    },
    Streuselschnecke_essen_3:{
      id: "Streuselschnecke_essen_3",
      text: ["Seine Augen fallen zu, sein Atem wird immer unregelmäßiger und flacher. "
      ],
        image: "img/Bild48.png",
      hasTimer: false,
      name: ["Anna"],
      next: [
        { key: "Streuselschnecke_essen_4", label: "Weiter" },
     ],
    },
    Streuselschnecke_essen_4:{
      id: "Streuselschnecke_essen_4",
      text: ["Doch er murmelt noch: „Es tut mir leid“, bevor er seinen letzten Atemzug nimmt und der durchgehende Alarmton des Monitors den Raum erfüllt."
      ],
        image: "img/Bild49.png",
      hasTimer: false,
      name: ["Anna"],
      next: [
        { key: "Beerdigung", label: "Fünf Tage später" },
     ],
    },
  

    Beerdigung:{
      id: "Beerdigung",
      text: ["Fünf Tage später gehen meine Schwester und ich zu seiner Beerdigung, doch unsere Mutter kommt nicht, denn sie ist mit anderem beschäftigt; "
      ],
        image: "img/Bild50.png",
      hasTimer: false,
      name: ["Anna"],
      next: [
        { key: "Beerdigung_2", label: "Weiter" },
     ],
    },
    Beerdigung_2:{
      id: "Beerdigung_2",
      text: ["außerdem hatte sie unseren Vater zu wenig gekannt und nicht geliebt."
      ],
        image: "img/Bild51.png",
      hasTimer: false,
      name: ["Anna"],
      next: [
        { key: "Ende", label: "The End" },
     ],
    },
    Ende:{
      id: "Ende",
      text: ["Nun hast du das Ende der Geschichte erreicht.",
            "Vielen Dank für das Spielen! :)"
      ],
        image: "",
      hasTimer: false,
      name: ["- Leonora & Lisa"],
      next: [
        { key: "Familienhaus", label: "Wiederholen" },
     ],
    },





    verloren: {
      id: "verloren",
      text: ["Weil ich mit den Gedanken irgendwo anders bin, stolppere ich. Ich spüre wie die Perosn näher kommt, doch anstatt mich zu greifen, berührt er mich an der Schulter. Sofort springe ich auf und renne weg."
      ],
      image: "img/Bild_Verloren.png",
      hasTimer: false,
      next: [
        { key: "In_der_Wohnung_Freundin", label: "Direkt nach Hause" }
      ]
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

    // Altes Audio stoppen
    if (!node.continueAudio) {
      audioPlayer.pause();
      audioPlayer.currentTime = 0;  
    }

    // Audio abspielen
    if (node.audio){
        audioPlayer.src = node.audio;
        audioPlayer.play();
    }


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