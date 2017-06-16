let idGen = 0

class App extends React.Component {

  //===================//SET UP FUNCTIONS//==============//
  constructor(props){
    super(props)

    const retrievedStateObject = JSON.parse(window.localStorage.getItem('lastState'))
    const retrievedIdGen = window.localStorage.getItem('lastidGenvalue')

    if (retrievedStateObject !== null && retrievedStateObject.length) {
      idGen = retrievedIdGen
    }

    this.state = {
      items: retrievedStateObject || [],
      value: '',
    }
  }

  //==================//Logic functions//================//

  saveToLocalStorage = () => {
    window.localStorage.setItem('lastState', JSON.stringify(this.state.items))
    window.localStorage.setItem('lastidGenvalue', idGen)
  }

  addCurrentInput = () => {
    if (this.state.value){
      const itemValue = {
        item : this.state.value,
        id : idGen++,
        completed: false,
        editable: false,
      }

      this.setState({
        items: [
          ...this.state.items,
          itemValue,
        ],
        value: ''
      }, this.saveToLocalStorage)
    }
  } //end addCurrentInput

  removeAllItems = () => {
    this.setState({items: []}, this.saveToLocalStorage)
  } //end removeAllItems

  removeItem = (idInfo) => {
    const newState = this.state.items.filter(
      (task) => task.id !== idInfo
    )
    this.setState({items: newState}, this.saveToLocalStorage)
  } //end removeItem

  handleKeyPress = (e) => {
    if (e.key === 'Enter'){
      e.preventDefault()
      this.addCurrentInput()
    }
  } //end handleKeyPress

  handleAddClick = (e) => {
    e.preventDefault()
    this.addCurrentInput()
  } //end handleAddClick

  handleCompletedClick = (idInfo) => {
    const newState = this.state.items.map((task)=>{
      if (task.id === idInfo) {
        return {
          ...task,
          completed : ! task.completed
        }
      }

      return task
    })
    this.setState({items: newState}, this.saveToLocalStorage)
  } //end

  toggleItemEdit = (idInfo) => {
    const newState = this.state.items.map((task)=>{
      if (task.id === idInfo) {
        return {
          ...task,
          editable : ! task.editable,
        }
      }

      return task
    })

    this.setState({items: newState})
  }

  saveItemEdit = (idInfo, inputString) => {
    const newState = this.state.items.map((task)=>{
      if (task.id === idInfo) {
        return {
          ...task,
          item: inputString,
          editable: false,
          completed: false,
        }
      }

      return task
    })

    this.setState({items: newState}, this.saveToLocalStorage)
  }

  onChangeHandler = (e) => {
    this.setState({value: e.target.value})
  } //end onChangeHandler


  //=========================//RENDER FUNCTION//===================//

  render(){
    return(
      <div>
        <h2>Things I need to do this millenium</h2>
        <input placeholder="Please enter a task here" value={this.state.value} maxLength="35" onKeyPress={this.handleKeyPress}  onChange={this.onChangeHandler}/>
        <button type="submit" onClick={this.handleAddClick}>Add</button>
        <button className="removeAllItems" onClick={this.removeAllItems}>Remove All</button>
        <List
          items={this.state.items}
          add={this.addCurrentInput}
          remove={this.removeItem}
          handleCompletedClick={this.handleCompletedClick}
          toggleItemEdit={this.toggleItemEdit}
          saveItemEdit={this.saveItemEdit}
        />
      </div>
    )
  }
} //end class

class List extends React.Component{

  render(){
    return (
      <ul>
        {this.props.items.map((task)=>(
          <ListItem
            key={task.id}
            task={task}
            remove={this.props.remove}
            handleCompletedClick={this.props.handleCompletedClick}
            toggleItemEdit={this.props.toggleItemEdit}
            saveItemEdit={this.props.saveItemEdit}
            add={this.props.add}/>
       ))}
      </ul>
    )
  }
} //end class


class ListItem extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      inputString: this.props.task.item
    }
  }

  componentWillReceiveProps(nextProps){
    if (this.props.task.item !== nextProps.task.item) {
      this.setState({inputString: nextProps.task.item})
    }
  }

  handleRemoveClickFactory = (id) => (e) => {
    e.preventDefault()
    this.props.remove(id)
  }

  handleCompletedClickFactory = (id) => (e) => {
    e.preventDefault();
    this.props.handleCompletedClick(id)
  }

  handleEditEnableClickFactory = (id) => (e) => {
    e.preventDefault()
    this.props.toggleItemEdit(id)
  }

  handleSaveClickFactory = (id) => (e) => {
    this.props.saveItemEdit(id, this.state.inputString)
  }

  handleCancelEditClickFactory = (id) => (e) => {
    e.preventDefault()
    this.props.toggleItemEdit(id)
  }

  getCompleteTextToggle = (id) => {
    return this.props.task.completed !== true ? "Mark as Complete" : "Mark as Incomplete"
  }

  getClassValueToggle = (id) => {
    return this.props.task.completed === true ? "completed" : null
  }

  onChangeHandler = (e) => {
    this.setState({inputString: e.target.value})
  }

  render(){
    return (
      <li
        className={this.getClassValueToggle(this.props.task.id)}>
          {this.props.task.editable !== true ?
            <span
              className={this.getClassValueToggle(this.props.task)}>
              {this.props.task.item}
            </span>
            :
            <input
              onChange={this.onChangeHandler}
              value={this.state.inputString}
              maxLength='35'
            />}
        {this.props.task.editable !== true ?
        <button
          onClick={this.handleCompletedClickFactory(this.props.task.id)}>
          {this.getCompleteTextToggle(this.props.task.id)}
        </button>
        :
        null
        }
        <button
          onClick={this.handleRemoveClickFactory(this.props.task.id)}>
          Delete
        </button>
        {this.props.task.completed === false ?
          this.props.task.editable === true ?
            <button
              onClick={this.handleSaveClickFactory(this.props.task.id)}>
              Save
            </button>
            :
            <button
              onClick={this.handleEditEnableClickFactory(this.props.task.id)}>
              Edit
            </button>
          :
          null
        }
        {this.props.task.editable === true ?
          <button
            onClick={this.handleCancelEditClickFactory(this.props.task.id)}>
            Cancel edit
          </button>
            :
            null
        }
    </li>
    )
  }
}


ReactDOM.render(<App/>,document.getElementById('root'));
