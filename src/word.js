const api_url = "https://random-word-api.herokuapp.com/word";

export async function fetchRandomWord() {
    try {
        const response = await fetch(api_url);
        const data = await response.json();
        console.log(data);
        const word = data[0];
        console.log(word)
        console.log(typeof(word));
        return word;
    } catch (error) {
        console.error("Error fetching random word:", error);
        return null;
    }
}
