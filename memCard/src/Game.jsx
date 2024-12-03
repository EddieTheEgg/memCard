import { useState, useEffect } from 'react';
import './Game.css';

function Game() {
  const [data, setData] = useState([]);
  const [pokemonClicked, setPokemonClicked] = useState([]); 
  const [currScore, setCurrScore] = useState(0); 
  const [bestScore, setBestScore] = useState(0);
  const [endGame, setEndGame] = useState(false);

  // Fetch Pokémon data
  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/pokemon?offset=0&limit=10") //offset=what pokemon index to start at, limit=max amount of pokemon fetched
      .then((response) => response.json()) 
      .then((result) => {
        //result format: https://pokeapi.co/api/v2/pokemon?offset=0&limit=10
        const fetchDetails = result.results.map((pokemon) =>
          fetch(pokemon.url).then((response) => response.json())
        );
        // Wait for all detailed data to resolve, then for each pokemon detail we format to only require name and image
        Promise.all(fetchDetails).then((pokemonDetails) => {
          const formattedData = pokemonDetails.map((pokemon) => ({
            name: pokemon.name,
            image: pokemon.sprites.front_default,
          }));
          setData(formattedData);                                                                                                                                
        });
      })
      .catch((error) => {
        console.error("Error fetching Pokémon data:", error);
      });
  }, []);

  
  // Function to handle the whether the game should continue after a card has been clickeds
  function changeScore(pokemonName) {
    if (pokemonClicked.includes(pokemonName)) {
      bestScoreCheck(currScore); 
      setEndGame(true); 
    } else {
      setPokemonClicked((prevPokemonClicked) => [...prevPokemonClicked, pokemonName]);
      setCurrScore((prevCurrScore) => prevCurrScore + 1);
    }
    shuffleData();
  }

  // Function to handle the best score
  function bestScoreCheck(score) {
    if (score > bestScore) {
      setBestScore(score);
    }
  }

  function shuffleData() {//fischer swap, just grabs a random index (within list range) and swaps the cards around
    setData((prevData) => {
      const shuffled = [...prevData]; //avoid mutating the data state directly

      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); 
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled; 
    });
  }

  function restartGame(){
    setEndGame(false);
    setCurrScore(0);
    setPokemonClicked([]);
  }
  

  return (
    <>
    <section className="web-layout">
      <h1>Pokemon Flashcard Game</h1>
      {endGame ? (
        <section className="endGame-layout">
          <h3>Game Ended!</h3>
          <div>Your best score: {bestScore}</div>
          <div>Score of this round: {currScore}</div>
          <button onClick={() => restartGame()} className="start-game-button">
            Restart?
          </button>
        </section>
      ):(
      <div className="flashcard-layout">
        <ul className="pokemon-grid">
          {data.map((pokemon, index) => (
            <button onClick={() => changeScore(pokemon.name)} key={index} className="pokemon-item">
              <h3>{pokemon.name}</h3>
              <img src={pokemon.image} alt={pokemon.name} />
            </button>))}
        </ul>
        <section className= "score-display">
            <div><strong>Best Score:</strong> {bestScore}</div>
            <div><strong>Current Score:</strong> {currScore}</div>
        </section>
      </div>
      )}
    </section>
    </>
    
  );
}

export default Game;
