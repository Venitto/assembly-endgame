import React from "react";
import { languages } from "./languages";
import {getFarewellText, getRandomWord} from "./utils";
import { fetchRandomWord } from "./word";
export default function App() {
  
  // const word = String(fetchRandomWord());
  // console.log(typeof(word));
  // console.log(word);
  // const [currentWord, setCurrentWord] = React.useState(() => getRandomWord())

  // const [currentWord, setCurrentWord] = React.useState(() => word)
  const [currentWord, setCurrentWord] = React.useState("");
  const [loadingWord, setLoadingWord] = React.useState(true);
  React.useEffect(() => {
    let mounted = true;
    async function loadWord() {
      const w = await fetchRandomWord();
      if (!mounted) return;
      setCurrentWord(String(w || ""));
      setLoadingWord(false);
    }
    loadWord();
    return () => { mounted = false; };
  }, []);


  const [guessedLetters, setGuessedLetters] = React.useState([])

  

  const wrongGuessCount = guessedLetters.filter(letter => 
    !currentWord.includes(letter)
  ).length
  

  const languageElements = languages.map((lang, index) => {
    
    const isLanguageLost = index < wrongGuessCount
    
    const styles = {
      backgroundColor: lang.backgroundColor, 
      color: lang.color 

    }
    return (
      <span 
        key={lang.name} 
        className={`chips ${isLanguageLost ? "lost" : ""}`} 
        style={styles}
      >
        {lang.name}
      </span>
    )
  }
    
  )

  const isGameLost = wrongGuessCount == languageElements.length
  const isGameWon = currentWord.split("").every(letter => 
    guessedLetters.includes(letter)
  )
  const isGameOver = isGameLost || isGameWon

  const lastGuessedLetter = guessedLetters[guessedLetters.length - 1]

  const isLastGuessIncorrect = lastGuessedLetter && !currentWord.includes(lastGuessedLetter)

  const gameStatusClass = isGameWon ? "won" : isGameLost ? "lost" : !isGameOver && isLastGuessIncorrect ? "farewell" : ""

    const alphabets = "abcdefghijklmnopqrstuvwxyz"
    const keyboardElements = alphabets.split("").map(letter => {
    const isGuessed = guessedLetters.includes(letter)
    const isCorrect = isGuessed && currentWord.includes(letter)
    const isWrong = isGuessed && !currentWord.includes(letter)

    const className = isCorrect
      ? "correct"
      : isWrong
      ? "wrong"
      : ""
    return (
      <button className={className} 
        key={letter} 
        disabled={isGameOver}
        onClick={() => addGuessedLetter(letter)}>
        {letter.toUpperCase()}
      </button>
    )
  })

  function addGuessedLetter(letter) {
    setGuessedLetters(prev => 
      prev.includes(letter) ? 
      prev : [...prev, letter]
    )
  }

  const letterElements = currentWord.split("").map((letter,index) => {

    const shouldRevealLetter = isGameLost || guessedLetters.includes(letter)
    const letterClassName = isGameLost && !guessedLetters.includes(letter) ? "missed-letter" : ""
    return ( 
      <span key={index} className={letterClassName}> {
        shouldRevealLetter ? letter.toUpperCase() : "" 
        }
      </span>
    )
  } )

  

  function renderGameStatus() {
    if (!isGameOver && isLastGuessIncorrect) {
      return <p className="farewell-message">
          {getFarewellText(languages[wrongGuessCount - 1].name)}
        </p>
    }

    if (isGameWon) {
      return (
      <>
        <h2>You Win!</h2>
        <p>Well done! 🎉</p>
      </>
      )
    } else if (isGameOver && isGameLost) {
      return (
        <>
          <h2>Game Over!</h2>
          <p>Try again</p>
        </>
      )
    }
  }

  async function startNewGame() {
    setLoadingWord(true)
    setGuessedLetters([])
    let w = ""
    try {
      w = await fetchRandomWord()
    } catch (err) {
      console.error("Failed to fetch new word:", err)
    } finally {
      setCurrentWord(String(w || getRandomWord()))
      setLoadingWord(false)
    }
  }

  return (
    <main>
      <header>
        <h1>Assembly: Endgame</h1>
        <p>Guess the word within 8 attempts to keep the programming world safe from Assembly!</p>    
      </header>
      <section className={`game-status ${gameStatusClass}`}> 
        {/* { isGameOver ? (
          isGameWon ? (
            <>
              <h2>You Win!</h2>
              <p>Well done! 🎉</p>
            </>
          ) : (
            <>
              <h2>Game Over!</h2>
              <p>Try again</p>
            </>
          )
        ) : (
          null
        ) */
        
        renderGameStatus()
        }
          
      </section>

      <section className="language-chips">
        {languageElements}
      </section>
      <section className="word">
        {letterElements}
      </section>
      <section className="keyboard">
        {keyboardElements}
      </section>
      { isGameOver && <button className="new-game" onClick={startNewGame}>New Game</button> }
      
    </main>
  )
}