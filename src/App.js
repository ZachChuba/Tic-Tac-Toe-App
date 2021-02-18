
import logo from './logo.svg';
import './App.css';
import { ListItem } from './ListItem.js';
import { BoardComponent} from './Board.js';
import { useState, useRef } from 'react';

function App() {
  const [myList, changeList] = useState([]);
  const inputRef = useRef(null);
  
  function onClickButton() {
    const userText = inputRef.current.value;
    changeList(prevList => [...prevList, userText]);
  }
  
  return (
    <div className="App">
      <BoardComponent />
      <input ref={inputRef} type="text" />
      <button onClick={onClickButton}> Add to list </button>
      <ul>
        {myList.map(item => <ListItem name={item} />)}
      </ul>
    </div>
  );
}

export default App;
