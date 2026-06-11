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
      text: ["Ich habe es so satt und ich halte es einfach nicht mehr aus. Deshalb packe ich die wenigen Sachen, die ich besitze, in meinen Koffer. Ich greife schon nach der Türklinke, als ich spüre, wie sich eine Hand um mein Handgelenk schliesst.",
      ],
      hasTimer: false,
      image: "img/Bild1.png",
      name: ["Anna"],
      next: [
        { key: "Familienhaus_2", label: "weiter" },
      ]
    },
  Familienhaus_2: {
      id: "Familienhaus_2",
      text: ["Ein Schauer läuft mir über den Rücken, doch ich drehe mich um. Meine Schwester steht vor mir, ihre Augen sind ganz verquollen vom Weinen. Ich ahne, was sie sagen möchte: Ich solle sie nicht verlassen.", 
          "Ohne dass sie etwas sagen kann, verlasse ich das Haus. Im Hintergrund ist die schreiende Stimme meiner Mutter immer noch zu hören.",
          "Natürlich habe ich mir nicht überlegt, wo ich als Nächstes hingehen soll. Das kann man auch nicht von einer Dreizehnjährigen erwarten. ",
          "Doch nun musste ich mich entscheiden, wie es weitergehen soll. ",
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
          "Die Google-Maps-Karte weist mich darauf hin, dass sich der Zielort 500 m vor mir befindet, deshalb stecke ich mein Handy weg und richte den Blick geradeaus. In der Ferne sehe ich eine Gestalt vor der Eingangstür des Wohnungskomplexes stehen. Als ich näherkomme, erkenne ich meine Freundin, die sich aber äußerlich sehr verändert hat, seit ich sie vor 5 Jahren zuletzt gesehen habe.",
          "Sie wirkt glücklich, mich zu sehen und begrüßt mich mit einer Umarmung.",
          "Als wir oben vor der Tür ankommen, höre ich Musik durch die Tür hindurch. Sobald sie die Klinke herunterdrückt, werde ich mit einer Wolke von Gras begrüßt. Ihre zwei weiteren Freundinnen sitzen im Wohnzimmer und rauchen.",
          "Sie entschuldigt sich dafür und fragt, ob es mir etwas ausmacht, wenn sie sich zu den anderen gesellt.",
          "Ich schüttle den Kopf."
      ],
    
      hasTimer: false,
      image: "img/Gassi mit Hund.jpg",
      name: ["Anna"],
      next: [
        { key: "Zuhause", label: "Weiter" }
      ]
    },

   Jugendherberge: {
      id: "Jugendherberge",
      text: ["Die naheliegendste Herberge ist zehn Minuten von mir entfernt, sie hat nicht die besten Google-Rezensionen, doch sie liegt besser in meinem Budget.",
            "Nachdem ich mir ein Zimmer mit vier anderen Leuten ergattert habe, verbringe ich die meiste Zeit faulend auf meinem Bett und lasse den letzten Abend zu Hause Revue passieren. Wie meine Schwester mir flehend in die Augen sah. Wie ich sie einfach zurückliess, ohne die Folgen meiner Tat zu realisieren. Das Geld, welches schon zu Beginn wenig war, ging mir allmählich aus und ich war gezwungen, meine Freundin aus Berlin zu kontaktieren."
      ],
      hasTimer: false,
      image: "img/Gassi mit Hund.jpg",
      name: ["Anna"],
      next: [
        { key: "Berlin", label: "zu deiner Freundin" }
      ]
    },

    Zuhause: {
      id: "Zuhause",
      text: ["Es sind elf Monate vergangen, seit meiner Ankunft, und die Verhältnisse zwischen mir und den zwei weiteren Mädchen der WG haben sich nicht gebessert, aber um ehrlich zu sein, hatte ich auch selbst nicht das Interesse, etwas daran zu ändern, und auch nicht die Zeit.",
            "Denn mein Leben besteht aus Schule und Arbeit. Für Freizeit habe ich wenig Platz in meinem Alltag und wenn ich Zeit habe, gehe ich gerne joggen, es hilft mir, über Dinge nachzudenken und Dampf abzulassen.",
            "Meine Freundin von früher ist wie immer sehr freundlich, doch viel unternehmen wir nicht miteinander. Solange ich die WG-Gebühren zahle, ist alles in bester Ordnung.",
       
      ],
      image: "img/Gassi mit Hund.jpg",
      hasTimer: true,
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
      hasTimer: true,
      image: "img/kleinerTrakt.jpg",
      name: ["Anna"],
      next: [
        { key: "Joggen", label: "trotzdem joggen gehen" },
        { key: "nicht_Joggen", label: "nicht gehen" }
      ]
    },

    Joggen: {
      id: "Joggen",
      text: ["Ich bin jetzt schon etwas weiter vom Apartmentkomplex entfernt, als ich hinter mir entfernte Schritte wahrnehme. Die Dämmerung ist schneller eingetroffen, als ich vermutet habe. Um ehrlich zu sein, bin ich zu spät losgegangen, denn ich habe mich gescheut, rauszugehen.",
            "Die verbleibende Sonne hat das Viertel mit einem goldenen Licht übersät. Bald würden nur die Straßenlaternen die Straße beleuchten.",
            "Die Schritte hinter mir geben nicht nach und bleiben beständig entfernt.",
            "Soll ich einen Blick über meine Schulter erhaschen?"

      ],
      hasTimer: false,
      image: "img/christmasBand.jpeg",
      name: ["Anna"],
      next: [
        { key: "Blick_erhaschen", label: "Ich möchte es Wagen" },
        { key: "Blick_nicht_erhaschen", label: "lieber nicht" }
      ]
    },
  
    Blick_erhaschen: {
      id: "Blick_erhaschen",
      text: ["Als ich mich umdrehe, sehe ich eine Gestalt mehrere Meter hinter mir, ruckartig drehe ich den Kopf wieder zurück, damit ich mich nicht auffällig verhalte. Der Körperbau der Gestalt wirkt männlich und er wirkt ziemlich groß. Falls er näherkäme, weiß ich nicht, ob ich es mit ihm aufnehmen könnte."
      ],
      hasTimer: false,
      image: "img/logarithmusGleichung.png",
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
      image: "img/brawlStars.jpg",
      name: ["Anna"],
      hasTimer: true,
      next: [
        { key: "Standort_teilen", label: "Freunden Standort teilen" }
       ]
      }, 
  
    Standort_teilen: {
      id: "Standort_teilen",
      text: ["Ich versuche, mein Tempo zu halten, weder zu schnell noch zu langsam zu werden. Das Sicherste, das ich für den Moment tun kann, ist, meinen Standort an meine Freundin zu senden. Ich versende die Nachricht, und in der rechten Ecke ist nur ein Häkchen abgebildet. Als ich von meinem Handy aufschaue, sehe ich, dass sich vier Meter vor mir eine Kreuzung erstreckt.",
            "In welche Richtung soll ich gehen?"
      ],
      image: "img/brawlStars.jpg",
      name: ["Anna"],
      hasTimer: false,
      next: [
        { key: "Rechts_abbiegen", label: "rechts" }
      ]
    },

    Rechts_abbiegen: {
      id: "Rechts_abbiegen",
      text: ["Vielen Dank fürs Spielen! Ich hoffe, dir hat die Geschichte gefallen.",
        "Frohe Weihnachten und bis zum nächsten Mal!"
      ],
      image: "img/weihnachtsbaumBild.jpg",
      hasTimer: false,
      name: ["Anna"],
      next: [
        { key: "Umdrehen", label: "ja" },
        { key: "Nicht_Umdrehen", label: "nein" }
      ]
    },
    
    Nicht_Umdrehen: {
      id: "Nicht_Umdrehen",
      text: ["Als ich mich umdrehe, sehe ich eine Gestalt mehrere Meter hinter mir, ruckartig drehe ich den Kopf wieder zurück, damit ich mich nicht auffällig verhalte. Der Körperbau der Gestalt wirkt männlich und er wirkt ziemlich groß. Falls er näherkäme, weiß ich nicht, ob ich es mit ihm aufnehmen könnte."
      ],
      hasTimer: false,
      image: "img/logarithmusGleichung.png",
      name: ["Anna"],
      next: [
        { key: "Standort_teilen", label: "Freunden Standort teilen" }
      ]
    },
    
    Blick_erhaschen: {
      id: "Blick_erhaschen",
      text: ["Als ich mich umdrehe, sehe ich eine Gestalt mehrere Meter hinter mir, ruckartig drehe ich den Kopf wieder zurück, damit ich mich nicht auffällig verhalte. Der Körperbau der Gestalt wirkt männlich und er wirkt ziemlich groß. Falls er näherkäme, weiß ich nicht, ob ich es mit ihm aufnehmen könnte."
      ],
      hasTimer: false,
      image: "img/logarithmusGleichung.png",
      name: ["Anna"],
      next: [
        { key: "Standort_teilen", label: "Freunden Standort teilen" }
      ]
    },
    
    Blick_erhaschen: {
      id: "Blick_erhaschen",
      text: ["Als ich mich umdrehe, sehe ich eine Gestalt mehrere Meter hinter mir, ruckartig drehe ich den Kopf wieder zurück, damit ich mich nicht auffällig verhalte. Der Körperbau der Gestalt wirkt männlich und er wirkt ziemlich groß. Falls er näherkäme, weiß ich nicht, ob ich es mit ihm aufnehmen könnte."
      ],
      hasTimer: false,
      image: "img/logarithmusGleichung.png",
      name: ["Anna"],
      next: [
        { key: "Standort_teilen", label: "Freunden Standort teilen" }
      ]
    },
    
    Blick_erhaschen: {
      id: "Blick_erhaschen",
      text: ["Als ich mich umdrehe, sehe ich eine Gestalt mehrere Meter hinter mir, ruckartig drehe ich den Kopf wieder zurück, damit ich mich nicht auffällig verhalte. Der Körperbau der Gestalt wirkt männlich und er wirkt ziemlich groß. Falls er näherkäme, weiß ich nicht, ob ich es mit ihm aufnehmen könnte."
      ],
      hasTimer: false,
      image: "img/logarithmusGleichung.png",
      name: ["Anna"],
      next: [
        { key: "Standort_teilen", label: "Freunden Standort teilen" }
      ]
    },
    
    Blick_erhaschen: {
      id: "Blick_erhaschen",
      text: ["Als ich mich umdrehe, sehe ich eine Gestalt mehrere Meter hinter mir, ruckartig drehe ich den Kopf wieder zurück, damit ich mich nicht auffällig verhalte. Der Körperbau der Gestalt wirkt männlich und er wirkt ziemlich groß. Falls er näherkäme, weiß ich nicht, ob ich es mit ihm aufnehmen könnte."
      ],
      hasTimer: false,
      image: "img/logarithmusGleichung.png",
      name: ["Anna"],
      next: [
        { key: "Standort_teilen", label: "Freunden Standort teilen" }
      ]
    },
    
    Blick_erhaschen: {
      id: "Blick_erhaschen",
      text: ["Als ich mich umdrehe, sehe ich eine Gestalt mehrere Meter hinter mir, ruckartig drehe ich den Kopf wieder zurück, damit ich mich nicht auffällig verhalte. Der Körperbau der Gestalt wirkt männlich und er wirkt ziemlich groß. Falls er näherkäme, weiß ich nicht, ob ich es mit ihm aufnehmen könnte."
      ],
      hasTimer: false,
      image: "img/logarithmusGleichung.png",
      name: ["Anna"],
      next: [
        { key: "Standort_teilen", label: "Freunden Standort teilen" }
      ]
    },
    
    Blick_erhaschen: {
      id: "Blick_erhaschen",
      text: ["Als ich mich umdrehe, sehe ich eine Gestalt mehrere Meter hinter mir, ruckartig drehe ich den Kopf wieder zurück, damit ich mich nicht auffällig verhalte. Der Körperbau der Gestalt wirkt männlich und er wirkt ziemlich groß. Falls er näherkäme, weiß ich nicht, ob ich es mit ihm aufnehmen könnte."
      ],
      hasTimer: false,
      image: "img/logarithmusGleichung.png",
      name: ["Anna"],
      next: [
        { key: "Standort_teilen", label: "Freunden Standort teilen" }
      ]
    },
    
    Blick_erhaschen: {
      id: "Blick_erhaschen",
      text: ["Als ich mich umdrehe, sehe ich eine Gestalt mehrere Meter hinter mir, ruckartig drehe ich den Kopf wieder zurück, damit ich mich nicht auffällig verhalte. Der Körperbau der Gestalt wirkt männlich und er wirkt ziemlich groß. Falls er näherkäme, weiß ich nicht, ob ich es mit ihm aufnehmen könnte."
      ],
      hasTimer: false,
      image: "img/logarithmusGleichung.png",
      name: ["Anna"],
      next: [
        { key: "Standort_teilen", label: "Freunden Standort teilen" }
      ]
    },
    
    Blick_erhaschen: {
      id: "Blick_erhaschen",
      text: ["Als ich mich umdrehe, sehe ich eine Gestalt mehrere Meter hinter mir, ruckartig drehe ich den Kopf wieder zurück, damit ich mich nicht auffällig verhalte. Der Körperbau der Gestalt wirkt männlich und er wirkt ziemlich groß. Falls er näherkäme, weiß ich nicht, ob ich es mit ihm aufnehmen könnte."
      ],
      hasTimer: false,
      image: "img/logarithmusGleichung.png",
      name: ["Anna"],
      next: [
        { key: "Standort_teilen", label: "Freunden Standort teilen" }
      ]
    },
    
    Blick_erhaschen: {
      id: "Blick_erhaschen",
      text: ["Als ich mich umdrehe, sehe ich eine Gestalt mehrere Meter hinter mir, ruckartig drehe ich den Kopf wieder zurück, damit ich mich nicht auffällig verhalte. Der Körperbau der Gestalt wirkt männlich und er wirkt ziemlich groß. Falls er näherkäme, weiß ich nicht, ob ich es mit ihm aufnehmen könnte."
      ],
      hasTimer: false,
      image: "img/logarithmusGleichung.png",
      name: ["Anna"],
      next: [
        { key: "Standort_teilen", label: "Freunden Standort teilen" }
      ]
    },
    
    Blick_erhaschen: {
      id: "Blick_erhaschen",
      text: ["Als ich mich umdrehe, sehe ich eine Gestalt mehrere Meter hinter mir, ruckartig drehe ich den Kopf wieder zurück, damit ich mich nicht auffällig verhalte. Der Körperbau der Gestalt wirkt männlich und er wirkt ziemlich groß. Falls er näherkäme, weiß ich nicht, ob ich es mit ihm aufnehmen könnte."
      ],
      hasTimer: false,
      image: "img/logarithmusGleichung.png",
      name: ["Anna"],
      next: [
        { key: "Standort_teilen", label: "Freunden Standort teilen" }
      ]
    },
    
    Blick_erhaschen: {
      id: "Blick_erhaschen",
      text: ["Als ich mich umdrehe, sehe ich eine Gestalt mehrere Meter hinter mir, ruckartig drehe ich den Kopf wieder zurück, damit ich mich nicht auffällig verhalte. Der Körperbau der Gestalt wirkt männlich und er wirkt ziemlich groß. Falls er näherkäme, weiß ich nicht, ob ich es mit ihm aufnehmen könnte."
      ],
      hasTimer: false,
      image: "img/logarithmusGleichung.png",
      name: ["Anna"],
      next: [
        { key: "Standort_teilen", label: "Freunden Standort teilen" }
      ]
    },
    
    Blick_erhaschen: {
      id: "Blick_erhaschen",
      text: ["Als ich mich umdrehe, sehe ich eine Gestalt mehrere Meter hinter mir, ruckartig drehe ich den Kopf wieder zurück, damit ich mich nicht auffällig verhalte. Der Körperbau der Gestalt wirkt männlich und er wirkt ziemlich groß. Falls er näherkäme, weiß ich nicht, ob ich es mit ihm aufnehmen könnte."
      ],
      hasTimer: false,
      image: "img/logarithmusGleichung.png",
      name: ["Anna"],
      next: [
        { key: "Standort_teilen", label: "Freunden Standort teilen" }
      ]
    },
    
    Blick_erhaschen: {
      id: "Blick_erhaschen",
      text: ["Als ich mich umdrehe, sehe ich eine Gestalt mehrere Meter hinter mir, ruckartig drehe ich den Kopf wieder zurück, damit ich mich nicht auffällig verhalte. Der Körperbau der Gestalt wirkt männlich und er wirkt ziemlich groß. Falls er näherkäme, weiß ich nicht, ob ich es mit ihm aufnehmen könnte."
      ],
      hasTimer: false,
      image: "img/logarithmusGleichung.png",
      name: ["Anna"],
      next: [
        { key: "Standort_teilen", label: "Freunden Standort teilen" }
      ]
    },
    
    Blick_erhaschen: {
      id: "Blick_erhaschen",
      text: ["Als ich mich umdrehe, sehe ich eine Gestalt mehrere Meter hinter mir, ruckartig drehe ich den Kopf wieder zurück, damit ich mich nicht auffällig verhalte. Der Körperbau der Gestalt wirkt männlich und er wirkt ziemlich groß. Falls er näherkäme, weiß ich nicht, ob ich es mit ihm aufnehmen könnte."
      ],
      hasTimer: false,
      image: "img/logarithmusGleichung.png",
      name: ["Anna"],
      next: [
        { key: "Standort_teilen", label: "Freunden Standort teilen" }
      ]
    },
    
    Blick_erhaschen: {
      id: "Blick_erhaschen",
      text: ["Als ich mich umdrehe, sehe ich eine Gestalt mehrere Meter hinter mir, ruckartig drehe ich den Kopf wieder zurück, damit ich mich nicht auffällig verhalte. Der Körperbau der Gestalt wirkt männlich und er wirkt ziemlich groß. Falls er näherkäme, weiß ich nicht, ob ich es mit ihm aufnehmen könnte."
      ],
      hasTimer: false,
      image: "img/logarithmusGleichung.png",
      name: ["Anna"],
      next: [
        { key: "Standort_teilen", label: "Freunden Standort teilen" }
      ]
    },

    verloren: {
      id: "verloren",
      text: ["Weil ich mit den Gedanken irgendwo anders bin, stolppere ich. Ich spüre wie die Perosn näher kommt, doch anstatt mich zu greifen, berührt er mich an der Schulter. Sofort springe ich auf und renne weg."
      ],
      image: "img/weihnachtsbaumBild.jpg",
      hasTimer: false,
      next: [
        { key: "In_der_Wohnung(F)", label: "Direkt nach Hause" }
      ]
    },
    BLABLA: {
      id: "BLABLA",
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