// Globale Variablen
const textContainer = document.getElementById("text-container");
const decisionContainer = document.getElementById("decision-container");
const buttonsAndInputs = document.getElementById("buttons-and-inputs");
const timerContainer = document.getElementById("timer-container");
const imageHolder = document.getElementById("story-image");
const startButton = document.getElementById("start-button");

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
    introduction: {
      id: "introduction",
      text: [
        "Du hast dich entschieden dem Mann weiter zufolgen. Er lauft gelassen, den gering belechteten Waldweg entlang, dabei wechselt er kein Wort mit dir."
      ],
      hasTimer: false,
      image: "img/Gassi mit Hund.jpg",
      next: [
        { key: "grosserTrakt", label: "Weiter" }
      ]
    },
  
    eingangKantiOlten: {
      id: "eingangKantiOlten",
      text: [
        "Ist es heute an der Zeit eine Band zu gründen?",
        "Du bist dir nicht ganz sicher, und überlegst ob du erstmal in den grossen oder kleinen Trakt gehen sollst."
      ],
      hasTimer: true,
      image: "img/Gassi mit Hund.jpg",
      next: [
        { key: "grosserTrakt", label: "In den grossen Trakt" },
        { key: "kleinerTrakt", label: "In den kleinen Trakt" }
      ]
    },
  
    grosserTrakt: {
      id: "grosserTrakt",
      text: ["Unruhig läufst du hinter ihm her. Willst du ihn etwas versuchen zu fragen?"],
      image: "img/Gassi mit Hund.jpg",
      hasTimer: true,
      next: [
        { key: "bandGruenden", label: "Mathelehrperson fragen" },
        { key: "logarithmusGleichungen", label: "Logarithmus-Gleichungen lösen" },
        { key: "brawlStarsSpielen", label: "Brawlstars spielen gehen" }
      ]
    },
  
    kleinerTrakt: {
      id: "kleinerTrakt",
      text: ["Der kleine Trakt ist dir allein schon wegen der Treppenanzahl sympathischer als der grosse Trakt.",
        "Wie haben eigentlich die Beatles ihre Band gegründet?",
        "Ist ja eigentlich egal, du könntest hier einfach mal herumfragen und deine Jazz-Band gründen.",
        "Oder willst du alternativ deine Geschichtslehrerin fragen, ob sie jemanden kennt?"
      ],
      hasTimer: true,
      image: "img/kleinerTrakt.jpg",
      next: [
        { key: "bandGruenden", label: "Geschichtslehrperson fragen" },
        { key: "brawlStarsSpielen", label: "Herumfragen" }
      ]
    },

    bandGruenden: {
      id: "bandGruenden",
      text: ["Yes! Die Lehrperson konnte dir gleich 3 weitere Schülerinnen und Schüler vermitteln, die ebenfalls eine Jazz-Band gründen wollen.",
        "Wie toll ist es jetzt, dass du Last Christmas endlich in einer Jazz Version spielen kannst?",
        "Ihr macht gleicht jeden Tag zur Probe ab und dürft sogar an der Weihnachtsfeier spielen!.",
        "Frohe Weihnachten und viel Spass mit deiner neuen Jazz-Band!"
      ],
      hasTimer: false,
      image: "img/christmasBand.jpeg",
      next: [
        { key: "schluss", label: "Spiel abschliessen" }
      ]
    },
  
    logarithmusGleichungen: {
      id: "logarithmusGleichungen",
      text: ["Logarithmus-Gleichungen haben es in sich. Die Substitutions-Methode war dir nicht mehr vertraut, und kommt nächste Woche bei der Prüfung.",
        "Sehr gut, dass du dich entschieden hast, konzentriert mitzuarbeiten.",
        "Du entscheidest dich dafür, noch ein Jahr mit dem Projekt Jazz-Band zu warten."
      ],
      hasTimer: false,
      image: "img/logarithmusGleichung.png",
      next: [
        { key: "schluss", label: "Spiel abschliessen" }
      ]
    },
  
    brawlStarsSpielen: {
      id: "brawlStarsSpielen",
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
  
    brawlStarsVerlieren: {
      id: "brawlStarsVerlieren",
      text: ["Oh nein! Du hast die Runde verloren, weil du die In-Game-Währung nicht kanntest.",
        "Vielleicht hättest du doch lieber nach einer Jazz-Band fragen sollen.",
        "Naja, nächstes Jahr versuchst du es wieder."
      ],
      hasTimer: false,
      next: [
        { key: "schluss", label: "Spiel abschliessen" }
      ]
    },

    schluss: {
      id: "schluss",
      text: ["Vielen Dank fürs Spielen! Ich hoffe, dir hat die Geschichte gefallen.",
        "Frohe Weihnachten und bis zum nächsten Mal!"
      ],
      image: "img/weihnachtsbaumBild.jpg",
      hasTimer: false,
      next: [
        { key: "introduction", label: "Spiel neu starten. :)" }
      ]
    },

    verloren: {
      id: "verloren",
      text: ["Leider hast du das Spiel nicht zur richtigen Zeitpunkt weitergespielt.",
        "Frohe Weihnachten trotzdem. Viel Glück beim nächstem Mal!"
      ],
      image: "img/weihnachtsbaumBild.jpg",
      hasTimer: false,
      next: [
        { key: "introduction", label: "Spiel neu starten. :)" }
      ]
    } 
};

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
        imageHolder.style.opacity = 0;       

        // Animation um Bild einblenden zu lassen
        setTimeout(() => {
            imageHolder.src = node.image;             
            imageHolder.style.opacity = 1; 
        }, 300); 
    } else {
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


/**
 * Diese Funktion wird zum Start ausgeführt
 */
startButton.addEventListener("click", function(){
  console.log("StartButton Click wurde ausgeführt!")


    // Der Inhalt mit dem Start Button soll verschwinden
    document.getElementById("start-button-holder").style.display = "none";

    // Die Geschichte beginnt
    nextStory("bintroduction");
});

