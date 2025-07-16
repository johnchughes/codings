import { useState, type ReactElement } from 'react'
import './App.css'
import { CreatePhrase } from './lib/PhraseGen.ts';
import { Word, type IWord } from './Word.tsx';
import { KEY_CODE_SPACE, KEY_CODE_ESCAPE } from './lib/statics.ts';

interface ICodingsState {
  phraseLength: number,
  attempt: string,
  index: number,
  words: IWord[],
  state: "IDLE" | "ACTIVE" | "FINISHED",
};

const INITIAL_INDEX = 0;
const INITIAL_LENGTH = 25;

function App() {

  const [cfg, setCfg] = useState<ICodingsState>({
    phraseLength: INITIAL_LENGTH,
    attempt: "",
    index: INITIAL_INDEX,
    words: CreatePhrase(INITIAL_LENGTH).map((x:string, idx:number) => { return {value: x, attempt: '', isCurrent: idx == INITIAL_INDEX};}),
    state: "IDLE"
  });

  
  const KeyMappings : Record<string, (evt:React.KeyboardEvent<HTMLInputElement>) => void> = {
      [KEY_CODE_SPACE]: onSpaceKeyDown,
      [KEY_CODE_ESCAPE]: onEscKeyDown
  }

  const onChanged = (evt:React.ChangeEvent<HTMLInputElement>) => {

    if(cfg.state === "FINISHED") {
      evt.preventDefault();
      evt.stopPropagation();
      return;
    }

    const nextValue = evt.currentTarget.value;

    setCfg(curr => { 
      return {...curr, attempt: nextValue, state: "ACTIVE" }
    });
  }

  function onKeyDown(evt:React.KeyboardEvent<HTMLInputElement>) {
      const keyFunction = KeyMappings[evt.code];
      if(keyFunction) keyFunction(evt);
  }

  function onEscKeyDown (evt:React.KeyboardEvent<HTMLInputElement>) {
    evt.preventDefault();
    evt.stopPropagation();
    Reset();
  }

  function Reset() {
    const next = {
          phraseLength: INITIAL_LENGTH,
          attempt: "",
          index: INITIAL_INDEX,
          words: CreatePhrase(INITIAL_LENGTH).map((x:string, idx:number) => { return {value: x, attempt: '', isCurrent: idx == INITIAL_INDEX};}),
          state:"IDLE"
        };
        setCfg(next);
    }

  function onSpaceKeyDown (evt:React.KeyboardEvent<HTMLInputElement>) {


      if(cfg.state === "FINISHED") {
        return;
      }


    evt.preventDefault();
    evt.stopPropagation();
    const _word = {...cfg.words[cfg.index], attempt: cfg.attempt, isCurrent: false};
    const _nextWord = {...cfg.words[cfg.index + 1], attempt: null, isCurrent: true};

    //TODO: The array grows if you continue to spam spoace, fix the nextWordArr to actually have some limits .... 
    const nextWordArr = [
      ...cfg.words.slice(0, cfg.index),
      ...[_word,_nextWord],
      ...cfg.words.slice(cfg.index + 2)
    ];

    setCfg(curr => {

      const _nextIndex = curr.index + 1;
      const _state = curr.index === curr.words.length -1 ? "FINISHED" : "ACTIVE";

      return {
        ...curr,
        index: curr.index + 1,
        words: nextWordArr,
        attempt: "",
        state:_state
      };
    });
  }


  return (
    <>
      <div className='codings'>
          {cfg.words.map((w:IWord, idx: number) => <Word {...w} key={idx} />)}
      </div>
      <input type="text" onChange={onChanged} value={cfg.attempt} onKeyDown={onKeyDown} />
      {cfg.state === "FINISHED" && <button className='btn-reset' onClick={Reset}>reset</button>}
    </>

  )
}

export default App
