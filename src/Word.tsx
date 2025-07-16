export interface IWord {
  isCurrent: boolean,
  value: string,
  attempt: string
}

export const Word = ({value, attempt, isCurrent}:IWord) => {

  const GetClass = () => {

    if(isCurrent) {
      return "current";
    }

    if(!isCurrent && attempt && value != attempt) {
      return "wrong"
    }
    else if(!isCurrent && attempt && value == attempt){
      return "correct";
    }

  }

  return <span className={GetClass()}>{value}</span>
}