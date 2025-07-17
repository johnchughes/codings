export const WORD_STATE_CURRENT :string = "CURRENT";
export const WORD_STATE_COMPLETED : string = "COMPLETED";
export const WORD_STATE_NOT_STARTED : string = "NOT_STARTED";

export type WORD_STATE  = typeof WORD_STATE_CURRENT | typeof WORD_STATE_COMPLETED | typeof WORD_STATE_NOT_STARTED;

export interface IWord {
  wordIndex: number,
  currentIndex: number,
  value: string,
  attempt: string
}

export const Word = ({value, attempt, wordIndex, currentIndex}:IWord) => {
  
  const GetClass = () => {

    if(wordIndex === currentIndex) {
      return "current";
    }

    if(wordIndex < currentIndex) {
      return attempt.trim() === value ? "correct" : "wrong";
    } else {
      return "";
    }

  }

  return <span className={GetClass()}>{value}</span>
}