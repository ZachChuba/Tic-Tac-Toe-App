
import logo from './logo.svg';
import './App.css';
import { ListItem } from './ListItem.js';
import { BoardComponent, Login} from './Board.js';
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
      <Login />
      <BoardComponent />
    </div>
  );
}

export default App;

/* Old code for reference, TODO delete
<input ref={inputRef} type="text" />
      <button onClick={onClickButton}> Add to list </button>
      <ul>
        {myList.map(item => <ListItem name={item} />)}
      </ul>
*/