import { useState, type ReactElement } from 'react'
import './App.css'
import { Phrase } from './lib/phrases.ts';

//TODO: Tidy conmsts up into an object e.g. Key.Space 
const KEY_SPACE : string = "Space";
const KEY_ESC : string = "Esc";


interface IWord {
  isCurrent: boolean,
  value: string,
  attempt: string
}

const Word = ({value, attempt, isCurrent}:IWord) => {

  //TOOD: trim before passing in. 
  const trimmpedAttempt = attempt ? attempt.trim() :  attempt;
  //Refactor.
  const GetClass = () => {

    if(isCurrent) {
      return "current";
    }

    if(!isCurrent && trimmpedAttempt && value != trimmpedAttempt) {
      return "wrong"
    }
    else if(!isCurrent && trimmpedAttempt && value == trimmpedAttempt){
      return "correct";
    }

  }

  return <span className={GetClass()}>{value}</span>
}


interface ICodingsState {
  attempt: string,
  index: number,
  words: IWord[]
};

const INITIAL_INDEX = 0;

function App() {

  const [cfg, setCfg] = useState<ICodingsState>({
    attempt: "",
    index: INITIAL_INDEX,
    words: Phrase.split(' ').map((x:string, idx:number) => { return {value: x, attempt: '', isCurrent: idx == INITIAL_INDEX};})
  });


  const onChanged = (evt:React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = evt.currentTarget.value;
    setCfg(curr => { return {...curr, attempt: nextValue }});
  }

  const onKeyDown = (evt:React.KeyboardEvent<HTMLInputElement>) => {
    //Replace with a dict  of <string:(evt) => void> 
      console.log(evt.code);
      switch(evt.code) {
        case KEY_SPACE: {onSpaceKeyDown(evt); break}
        default: break;
      }
  }

  const onSpaceKeyDown = (_evt:React.KeyboardEvent<HTMLInputElement>) => {
    const _word = {...cfg.words[cfg.index], attempt: cfg.attempt, isCurrent: false};
    const _nextWord = {...cfg.words[cfg.index + 1], attempt: null, isCurrent: true};

    const nextWordArr = [
      ...cfg.words.slice(0, cfg.index),
      ...[_word,_nextWord],
      ...cfg.words.slice(cfg.index + 2)
    ];

    setCfg(curr => {
      return {
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
