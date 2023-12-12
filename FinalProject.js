class Horse {
  constructor(name, wins = 0, hasWonThisRace = false) {
    this.name = name;
    this.wins = wins;
    this.hasWonThisRace = hasWonThisRace;
  }

  static resetWins(horses) {
    horses.forEach((horse) => {
      horse.wins = 0;
    });
  }
}

const horses = [
  new Horse("Dasher"),
  new Horse("Comet"),
  new Horse("Rudolph"),
];

const horseSelect = document.getElementById("horseSelect");
const startRaceButton = document.getElementById("startRaceButton");
const scoreboard = document.getElementById("scoreboard");

let raceCounter = 0;
let raceInProgress = false;


const defaultOption = document.createElement("option");
defaultOption.value = "";
horseSelect.appendChild(defaultOption);

horses.forEach(horse => {
  const option = document.createElement("option");
  option.value = horse.name;
  option.text = horse.name;
  horseSelect.appendChild(option);
});

function enableStartRaceButton() {
  startRaceButton.disabled = !horseSelect.value || raceInProgress;
}

horseSelect.addEventListener("change", enableStartRaceButton);

startRaceButton.addEventListener("click", startRace);

function startRace() {
  if (!horseSelect.value) {
    alert("Please select a Reindeer to race with.");
    return;
  }

  if (raceCounter >= 5) {
    alert(
      "The horses are tired. Please reload the page to let them rest before starting a new race."
    );
    return;
  }

  raceInProgress = true;
  raceCounter++;

  horses.forEach((horse) => {
    horse.hasWonThisRace = false;
  });

  resetRaceTrack();
  
  const selectedHorse = horses.find((horse) => horse.name === horseSelect.value);
  
  const remainingHorses = horses.filter((horse) => horse !== selectedHorse);

  const raceParticipants = [];
  for (let i = 0; i < Math.min(3, remainingHorses.length); i++) {
    const randomHorse = remainingHorses[i];
    const randomSpeed = getRandomNumber(0.8, 1.2);
    raceParticipants.push({
      horse: randomHorse,
      speed: randomSpeed,
    });
  }

  const selectedHorseSpeed = getRandomNumber(0.8, 1.2);
  raceParticipants.unshift({
    horse: selectedHorse,
    speed: selectedHorseSpeed,
  }); 

  raceParticipants.forEach((participant, index) => {
    const horseElement = document.getElementById(`horse${index + 1}`);
    horseElement.textContent = participant.horse.name;
    horseElement.style.top = `${index * 40 + 10}px`;
    horseElement.style.animationName = "horseRace";
    horseElement.style.animationDuration = `${getRandomNumber(4, 6)}s`;

    horseElement.addEventListener("animationend",() => 
      handleRaceFinish(participant),
      { once: true }
    );
  });

  function handleRaceFinish(selectedParticipant) {
    if (!selectedParticipant.horse.hasWonThisRace) {
      selectedParticipant.horse.hasWonThisRace = true;
      const winnerHorse = selectedParticipant.horse;

      winnerHorse.wins++;

      updateScoreboard();

      raceParticipants.forEach((participant) => {
        const horseElement = document.getElementById(`horse${participant.horse.name}`);
        if (horseElement &&typeof handleRaceFinish === "function") {
          horseElement.removeEventListener("animationend",() => handleRaceFinish(participant));
        }
      });

      startRaceButton.disabled = false;

      resetRaceTrack();

      if (raceCounter > 5) {
        alert("The horses are tired. Please reload the page to let them rest before starting a new race.");
      }

      raceInProgress = false;
    }
  }

  function updateScoreboard() {
    scoreboard.innerHTML = "<h2>Race Results</h2>";
    horses.forEach((horse) => {
      const listItem = document.createElement("li");
      listItem.textContent = `${horse.name} - Wins: ${horse.wins}`;
      scoreboard.appendChild(listItem);
    });

    localStorage.setItem("raceResults", JSON.stringify(horses));

    const selectedHorse = horses.find((horse) => horse.name === horseSelect.value);

    if (selectedHorse && selectedHorse.hasWonThisRace) {
      alert("Congratulations! Your Reindeer Won!");
    }
  }
}

function resetRaceTrack() {
  document.querySelectorAll(".horse").forEach((horse) => {
    horse.style.left = "0";
    horse.style.animationName = "";
  });
}

function getRandomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

document.addEventListener("DOMContentLoaded", () => {
  const storedResults = localStorage.getItem("raceResults");
  if (storedResults) {
    const storedHorses = JSON.parse(storedResults);
    horses.forEach((horse, index) => {
      horse.wins = storedHorses[index].wins;
    });
    updateScoreboard();
  }
});