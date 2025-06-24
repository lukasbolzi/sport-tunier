<script>
  import { browser } from "$app/environment";
  
  let teams = getCookie("teams") || [
  { id: 1, name: "" },
  { id: 2, name: "" },
  { id: 3, name: "" },
  { id: 4, name: "" },
  { id: 5, name: "" },
  { id: 6, name: "" },
];

$: setCookie("teams", teams);



function updateTeamName(id, newName) {
  const team = teams.find((t) => t.id === id);
  if (team) {
    team.name = newName;
    teams = [...teams]; // ← trigger reactivity
  }
}



  const cleanRounds = [
    [
      {
        title: "Fußball",
        opponents: [
          { id: 1, goals: "" },
          { id: 2, goals: "" },
        ],
      },
      {
        title: "Tischtennis",
        opponents: [
          { id: 3, goals: "" },
          { id: 4, goals: "" },
        ],
      },
      {
        title: "Boccia",
        opponents: [
          { id: 5, goals: "" },
          { id: 6, goals: "" },
        ],
      },
    ],
    [
      {
        title: "Tischtennis",
        opponents: [
          { id: 1, goals: "" },
          { id: 6, goals: "" },
        ],
      },
      {
        title: "Boccia",
        opponents: [
          { id: 2, goals: "" },
          { id: 3, goals: "" },
        ],
      },
      {
        title: "S., L., V.",
        opponents: [
          { id: 4, goals: "" },
          { id: 5, goals: "" },
        ],
      },
    ],
    [
      {
        title: "Fußball",
        opponents: [
          { id: 3, goals: "" },
          { id: 5, goals: "" },
        ],
      },
      {
        title: "Boccia",
        opponents: [
          { id: 1, goals: "" },
          { id: 4, goals: "" },
        ],
      },
      {
        title: "S., L., V.",
        opponents: [
          { id: 2, goals: "" },
          { id: 6, goals: "" },
        ],
      },
    ],
    [
      {
        title: "Fußball",
        opponents: [
          { id: 4, goals: "" },
          { id: 6, goals: "" },
        ],
      },
      {
        title: "Tischtennis",
        opponents: [
          { id: 2, goals: "" },
          { id: 5, goals: "" },
        ],
      },
      {
        title: "S., L., V.",
        opponents: [
          { id: 1, goals: "" },
          { id: 3, goals: "" },
        ],
      },
    ],
  ];
  // Use this to clear the rounds
  // const rounds = cleanRounds;
  const rounds = getCookie("rounds") || cleanRounds;
  console.log(getCookie("rounds"))

  $: rounds, setCookie("rounds", rounds);

  function getTeamById(_id = 0) {
    return teams.find(({ id }) => id === _id);
  }

  function buildTable(_rounds) {
    const flatRounds = _rounds.flat();
    return teams
      .map((team) => {
        let points = 0;
        let goals = 0;
        let goalsAgainst = 0;
        flatRounds.forEach((round) => {
          const teamSelf = round.opponents.find(({ id }) => id === team.id);
          if (teamSelf) {
            const teamAgainst = round.opponents.find(
              ({ id }) => id !== team.id
            );
            if (
              teamAgainst &&
              teamSelf.goals !== "" &&
              teamAgainst.goals !== ""
            ) {
              goals += parseInt(teamSelf.goals);
              goalsAgainst += parseInt(teamAgainst.goals);
              if (parseInt(teamSelf.goals) === parseInt(teamAgainst.goals)) {
                points += 1;
              } else if (
                parseInt(teamSelf.goals) > parseInt(teamAgainst.goals)
              ) {
                points += 3;
              }
            }
          }
        });
        return { id: team.id, points, goals, goalsAgainst, name: team.name };
      })
      .sort((a, b) =>
        b.points === a.points
          ? b.goals - b.goalsAgainst - (a.goals - a.goalsAgainst)
          : b.points - a.points
      );
  }

  let phase = "q";

  function setCookie(cName, cItem) {
    if (browser) {
      document.cookie = `${cName}=${JSON.stringify(cItem)}; expires= Sun, 30 Nov 2025 12:00:00 UTC`;
    }
  }

  function getCookie(cName) {
    if (browser) {
      let name = cName + "=";
      let decodedCookie = decodeURIComponent(document.cookie);
      let ca = decodedCookie.split(";");
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == " ") {
          c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
          return JSON.parse(c.substring(name.length, c.length));
        }
      }
    }
    return "";
  }
</script>

<svelte:head>
  <title>Spielplan</title>
  <meta name="description" content="Spielplan Jugendfreizeit" />
</svelte:head>

<section>
  <h1>Sporttunier 2024</h1>

  <div class="flex">
    <div class="flex-right">
      <div id="table" class:transparent={phase !== "q"}>
        <h1>Tabelle</h1>
        <table>
          <tr><td></td><td>Team</td><td>P</td><td>D</td></tr>
          {#each buildTable(rounds) as team, idx}
            <tr>
              <td>{idx + 1}.</td>
              <!-- <td class="team">{team.name || team.id}</td> -->
              <td class="team">
                <input
                  type="text"
                  bind:value={team.name}
                  placeholder={team.id}
                  on:input={() => updateTeamName(team.id, team.name)}
                />
              </td>
              
              <td>{team.points}</td>
              <td>{team.goals - team.goalsAgainst}</td>
            </tr>
          {/each}
        </table>
      </div>

      <div id="finals" class:transparent={phase !== "f"}>
        <h1 on:click={() => (phase = "f")}>Finals</h1>
        <table>
          {#each [[4, 5], [2, 3], [0, 1]] as pair}
            <div><b>Spiel um Platz {pair[1]}</b></div>
            <tr>
              <td id="opponent0" class="opponent"
                >{buildTable(rounds)[pair[0]].name ||
                  buildTable(rounds)[pair[0]].id}
              </td>
              <td><input /></td>
              <td>:</td>
              <td><input /></td>
              <td id="opponent1" class="opponent"
                >{buildTable(rounds)[pair[1]].name ||
                  buildTable(rounds)[pair[1]].id}</td
              >
            </tr>
          {/each}
        </table>
      </div>
    </div>

    <div class="flex-left">
      <div id="qualification" class:transparent={phase !== "q"}>
        <h1 on:click={() => (phase = "q")}>Qualifikation</h1>
        {#each rounds as round, idx}
          <h3>Runde {idx + 1}</h3>
          <table>
            {#each round as match}
              <tr>
                <td class="title"><b>{match.title}</b></td>
                <td id="opponent0" class="opponent"
                  >{getTeamById(match.opponents[0].id)?.name ||
                    match.opponents[0].id}</td
                >
                <td><input bind:value={match.opponents[0].goals} /></td>
                <td>:</td>
                <td><input bind:value={match.opponents[1].goals} /></td>
                <td id="opponent1" class="opponent"
                  >{getTeamById(match.opponents[1].id)?.name ||
                    match.opponents[1].id}</td
                >
              </tr>
            {/each}
          </table>
        {/each}
      </div>
    </div>
  </div>
</section>

<style>
  section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: 0.6;
  }

  .transparent {
    opacity: 30%;
  }

  h1 {
    width: 100%;
  }

  .flex {
    display: flex;
    gap: 20px;
    justify-content: space-between;
    align-items: flex-start;
  }
  .flex-left {
    order: 0;
  }
  .flex-right {
    order: 1;
  }

  #table h1 {
    margin-bottom: 1.9em;
  }

  #qualification table {
    border-spacing: 0 2px;
  }

  #qualification .title {
    width: 150px;
  }

  #qualification input,
  #finals input {
    width: 25px;
    text-align: center;
    background: none;
    border: none;
    border-bottom: 2px solid rgb(148, 148, 148);
    font-weight: bold;
  }
  #table input {
    background: none;
    border: none;
    font-size: .9em;
    font-weight: bold;
    &::placeholder {
      opacity: 1;
      color: black;
      font-weight: 300;
    }
  }

  .opponent {
    width: 300px;
    overflow: ellipse;
    padding: 0 5px;
  }
  #opponent0 {
    text-align: right;
  }

  tr {
    background-color: rgba(255, 72, 188, 0.094);
  }

  tr:nth-child(odd) {
    background-color: rgba(72, 72, 255, 0.094);
  }
</style>
