"use client"
import React, { useState, useEffect } from 'react';


interface Movie {
  id: number;
  // Add other properties as needed
}


function RandomIdGenerator() {
  const [movieData, setMovieData] = useState<Movie[]>([]);
  const [randomMovie, setRandomMovie] = useState<number | null>(null);

  useEffect(() => {
    // Fetch the JSONL file
    fetch('./movie_ids_04_24_2024.json')
      .then(response => response.text())
      .then(data => {
        // Split the text into lines
        const lines = data.trim().split('\n');
        // Parse each line as JSON and store in state
        const movies = lines.map(line => JSON.parse(line));
        setMovieData(movies.map(movie => movie.id));
        
      })
      .catch(error => console.error('Error fetching JSONL:', error));
  }, []);

  const generateRandomMovie = () => {
    
      // Select a random movie
      const randomIndex = Math.floor(Math.random() * movieData.length);
      const randomMovie = movieData[randomIndex];
      setRandomMovie(randomMovie.id);
      console.log(randomMovie.id);
    
  };

  return (
    <div className='ml-[16rem]'>
      <button onClick={generateRandomMovie}>Generate Random Movie</button>
      {randomMovie !== null && (
        <div>
          <p>Random Movie ID: {randomMovie}</p>
        </div>
      )}
    </div>
  );
}
export default RandomIdGenerator;
