import React, { useEffect, useState, useCallback } from "react";

import MoviesList from "./components/MoviesList";
import "./App.css";
import AddMovie from "./components/AddMovie";

function App() {
  const [Movies, setMovie] = useState([]);
  const [isLoding, setLoding] = useState(false);
  const [error, setError] = useState(null);

  //usecallback ka yaad rakhiyo
  const fatchHanadelar = useCallback(async () => {
    setLoding(true);
    setError(null);
    try {
      const Response = await fetch(
        "https://react-test-8e172-default-rtdb.firebaseio.com/movies.json"
      );
      if (!Response.ok) {
        throw new Error("something going wrong");
      }
      const data = await Response.json();
      const loadMovie = [];
      for (const key in data) {
        loadMovie.push({
          id: key,
          title: data[key].title,
          openingText: data[key].openingText,
          releaseDate: data[key].releaseDate
        });
      }

      setMovie(loadMovie);
    } catch (error) {
      setError(error.message);
    }
    setLoding(false);
  }, []);
  useEffect(() => {
    fatchHanadelar();
  }, [fatchHanadelar]);
  async function addMovieHandler(movie) {
    const Response = await fetch(
      "https://react-test-8e172-default-rtdb.firebaseio.com/movies.json",
      {
        method: "POST",
        body: JSON.stringify(movie),
        headers: {
          "Content-type": "application/json"
        }
      }
    );
    const data = await Response.json();

    console.log(data);
  }
  let content = <p>No movies Found.</p>;
  if (Movies.length > 0) {
    content = <MoviesList movies={Movies} />;
  }
  if (error) {
    content = <p>{error}</p>;
  }
  if (isLoding) {
    content = <p>Loding...</p>;
  }

  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fatchHanadelar}>Fetch Movies</button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
