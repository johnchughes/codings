import { useState, type ReactElement } from 'react'
import './App.css'
import { CreatePhrase } from './EnglishWords.ts';
import { Word, type IWord } from './Word.tsx';
import { Keys } from './statics.ts';
interface ICodingsState {
  phraseLength: 25,
  attempt: string,
  index: number,
  words: IWord[]
};

const INITIAL_INDEX = 0;

function App() {

  const [cfg, setCfg] = useState<ICodingsState>({
    phraseLength: 25,
    attempt: "",
    index: INITIAL_INDEX,
    words: CreatePhrase(25).map((x:string, idx:number) => { return {value: x, attempt: '', isCurrent: idx == INITIAL_INDEX};})
  });


  const onChanged = (evt:React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = evt.currentTarget.value;
    setCfg(curr => { return {...curr, attempt: nextValue }});
  }

  const onKeyDown = (evt:React.KeyboardEvent<HTMLInputElement>) => {
    //Replace with a dict  of <string:(evt) => void> 
      switch(evt.code) {
        case Keys.Space: {onSpaceKeyDown(evt); break}
        case Keys.Escape: {onEscKeyDown(evt); break}
        default: break;
      }
  }

  const onEscKeyDown = (evt:React.KeyboardEvent<HTMLInputElement>) => {
      const next = {
        phraseLength: 25,
        attempt: "",
        index: INITIAL_INDEX,
        words: CreatePhrase(25).map((x:string, idx:number) => { return {value: x, attempt: '', isCurrent: idx == INITIAL_INDEX};})
      };
      setCfg(next);
  }

  const onSpaceKeyDown = (evt:React.KeyboardEvent<HTMLInputElement>) => {
    evt.preventDefault();
    evt.stopPropagation();
    const _word = {...cfg.words[cfg.index], attempt: cfg.attempt, isCurrent: false};
    const _nextWord = {...cfg.words[cfg.index + 1], attempt: null, isCurrent: true};

    const nextWordArr = [
      ...cfg.words.slice(0, cfg.index),
      ...[_word,_nextWord],
      ...cfg.words.slice(cfg.index + 2)
    ];

    setCfg(curr => {
      return {
        ...curr,
        index: curr.index + 1,
        words: nextWordArr,
        attempt: ""
      };
    });
  }


  return (
    <>
      <div className='codings'>
          {cfg.words.map((w:IWord, idx: number) => <Word {...w} key={idx} />)}
      </div>

      <input type="text" onChange={onChanged} value={cfg.attempt} onKeyDown={onKeyDown} />

    </>
  )
}

export default App
