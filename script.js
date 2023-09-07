// 404 error handler
class LuxioError extends Error {
    constructor(name, message) {
        super(name, message);
        this.name = name;
        this.message = message;
    }
}

let luxioErrorData = {
    name: "File not found",
    id: "404",
    sprites: {
        front_default:
            "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/404.png",
    },
    types: [{ type: { name: "bug" } }, { type: { name: "electric" } }],
    abilities: [
        {
            ability: {
                name: "Error",
            },
        },
    ],
};

function errorData(error) {
    let errorData = {
        name: error.name.toString(),
        id: error.message.toString(),
        sprites: {
            front_default: "./resources/MissingNo.png",
        },
        types: [{ type: { name: "bug" } }, { type: { name: "electric" } }],
        abilities: [
            {
                ability: {
                    name: "Error",
                },
            },
        ],
    };
    return errorData;
}

// Object of types and their associated colours
let typesObject = {
    Normal: {
        typeBgColour: "#A8A878",
        typeBorderColour: "#6D6D4E",
    },
    Fire: {
        typeBgColour: "#F08030",
        typeBorderColour: "#9C531F",
    },
    Fighting: {
        typeBgColour: "#C03028",
        typeBorderColour: "#7D1F1A",
    },
    Flying: {
        typeBgColour: "#A890F0",
        typeBorderColour: "#6D5E9C",
    },
    Water: {
        typeBgColour: "#6890F0",
        typeBorderColour: "#445E9C",
    },
    Grass: {
        typeBgColour: "#78C850",
        typeBorderColour: "#4E8234",
    },
    Poison: {
        typeBgColour: "#A040A0",
        typeBorderColour: "#682A68",
    },
    Electric: {
        typeBgColour: "#F8D030",
        typeBorderColour: "#A1871F",
    },
    Ground: {
        typeBgColour: "#E0C068",
        typeBorderColour: "#927D44",
    },
    Normal: {
        typeBgColour: "#A8A878",
        typeBorderColour: "#6D6D4E",
    },
    Psychic: {
        typeBgColour: "#F85888",
        typeBorderColour: "#A13959",
    },
    Rock: {
        typeBgColour: "#B8A038",
        typeBorderColour: "#786824",
    },
    Ice: {
        typeBgColour: "#98D8D8",
        typeBorderColour: "#638D8D",
    },
    Bug: {
        typeBgColour: "#A8B820",
        typeBorderColour: "#6D7815",
    },
    Dragon: {
        typeBgColour: "#7038F8",
        typeBorderColour: "#4924A1",
    },
    Ghost: {
        typeBgColour: "#705898",
        typeBorderColour: "#493963",
    },
    Dark: {
        typeBgColour: "#705848",
        typeBorderColour: "#49392F",
    },
    Steel: {
        typeBgColour: "#B8B8D0",
        typeBorderColour: "#787887",
    },
    Fairy: {
        typeBgColour: "#EE99AC",
        typeBorderColour: "#9B6470",
    },
};

// Capitalises first char of string
function capitalise(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

// Calls to PokeAPI by name -> returns pokemon data
function getPokemonData(name) {
    return new Promise((resolve, reject) => {
        console.log("Now searching");
        resolve(fetch("https://pokeapi.co/api/v2/pokemon/" + name));
    });
}

// Asynchronously runs the getPokemonData function, converts result to JSON
async function retrieveData(name) {
    // doesn't call if no data entered
    if (!name) {
        return;
    }
    let rawData = await getPokemonData(name);
    if (rawData.status == "404") {
        throw new LuxioError("404", "Pokemon not found");
    }
    let dataJSON = await rawData.json();
    return dataJSON;
}

// builds picture element
function constructSprite(data) {
    let sprite = document.createElement("img");
    sprite.src = data.sprites.front_default;
    sprite.style.float = "left";
    return sprite;
}

// Builds Name element
function constructName(data) {
    let name = document.createElement("h1");
    name.innerText = `Name: ${capitalise(data.name)}`;
    name.style.whiteSpace = "nowrap";
    return name;
}

// Builds ID element
function constructID(data) {
    let id = document.createElement("h3");
    id.innerText = `ID: ${data.id}`;
    return id;
}

// Builds types element
function constructTypes(data) {
    let types = document.createElement("h2");
    types.innerText = `Type(s): `;
    types.style.whiteSpace = "nowrap";

    // Pokemon can have 1 or 2 types
    for (type of data.types) {
        // Creates a span
        let typeSpan = document.createElement("span");
        typeSpan.classList.add("type");

        // Capitalises type from json, adds to innerText of span
        let typeName = capitalise(type.type.name);
        typeSpan.innerText += typeName;

        // Styles span with appropriate colour theme from typesObject
        for (const variable of Object.keys(typesObject[typeName])) {
            typeSpan.style.setProperty(
                `--${variable}`,
                typesObject[typeName][variable]
            );
        }
        // typeSpan.style.setProperty;
        types.appendChild(typeSpan);
    }
    return types;
}

function constructAbilitiesList(data) {
    let abilitiesList = document.createElement("ul");
    for (ability of data.abilities) {
        let newListItem = document.createElement("li");
        if (ability.is_hidden == true) {
            newListItem.innerText = "Hidden Ability: ";
        }
        newListItem.innerText += capitalise(ability.ability.name);
        abilitiesList.appendChild(newListItem);
    }
    return abilitiesList;
}

function constructMovesList(data) {
    let movesList = document.createElement("table");
}

function buildResult(data) {
    console.log(data);
    let resultsDiv = document.getElementById("searchResult");
    resultsDiv.innerHTML = "";
    resultsDiv.style.textAlign = "center";
    resultsDiv.style.width = "fit-content";
    resultsDiv.style.margin = "auto";

    // constructs each element 
    let sprite = constructSprite(data);

    let name = constructName(data);

    let id = constructID(data);

    let types = constructTypes(data);

    let abilitiesTitle = document.createElement("h2");
    abilitiesTitle.innerText = `Abilities:`;

    let abilitiesList = constructAbilitiesList(data);

    // This list format makes it easier to add new elements in the future
    let childrenToAppend = [
        sprite,
        name,
        id,
        types,
        abilitiesTitle,
        abilitiesList,
    ];

    // appends all elements in above list as children of resultsDiv node
    for (element of childrenToAppend) {
        resultsDiv.appendChild(element);
    }
}

let submitButton = document.getElementById("nameSearchSubmit");
submitButton.addEventListener("click", (event) => {

    // prevents refresh
    event.preventDefault();

    // gets elements used later
    let nameField = document.getElementById("nameSearch");
    let nameSearched = nameField.value.toLowerCase();
    let errorMessage = document.getElementById("errorMessage");

    // displays "searching..." while making API call
    errorMessage.innerText = "Searching...";
    errorMessage.style.display = "inherit";

    // calls API
    retrieveData(nameSearched)
        .then((data) => {
            // Builds result
            buildResult(data);
            // Hides "searching..."
            errorMessage.style.display = "none";
        })
        .catch((error) => {
            let errorMessage = document.getElementById("errorMessage");
            // This occurs when user enters no data to search
            if (error.message == "data is undefined") {
                errorMessage.innerText = "Please enter a pokemon's name or ID";
                // Stops escalation when user enters no data. I.E does not build an error result.
                return;
            }
            // Displays error
            errorMessage.innerText =
                "An error has occurred: " + error.name + " \n" + error.message;

            // Real ones get it
            if (error.name == "404") {
                buildResult(luxioErrorData);
            } else {
                // Returns funny little result with missingno sprite and Name: error.name
                buildResult(errorData(error));
            }

            // also logs error to console.
            console.log(
                Error(
                    "An error has occurred: " +
                        error.name +
                        " \n" +
                        error.message
                )
            );
        });
});
