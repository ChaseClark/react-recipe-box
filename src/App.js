import React, { Component } from 'react'
import './App.css'
import Panel from 'react-bootstrap/lib/Panel'
import PanelGroup from 'react-bootstrap/lib/PanelGroup'
import Button from 'react-bootstrap/lib/Button'
import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar'
import Modal from 'react-bootstrap/lib/Modal'
import FormGroup from 'react-bootstrap/lib/FormGroup'
import ControlLabel from 'react-bootstrap/lib/ControlLabel'
import FormControl from 'react-bootstrap/lib/FormControl'

class App extends Component {

  state = {
    newestRecipe: { recipeName: "", ingredients: [] },
    recipes: [],
    showAddModal: false,
    showEditModal: false,
    currentIndex: 0
  }

  componentDidMount() {
    let recipes = JSON.parse(localStorage.getItem("recipes")) || []
    this.setState({ recipes })
  }

  close = () => {
    if (this.state.showAddModal) {
      this.setState({ showAddModal: false })
    }
    else if (this.state.showEditModal) {
      this.setState({ showEditModal: false })
    }
  }


  deleteRecipe(index) {
    let recipes = this.state.recipes.slice()
    recipes.splice(index, 1)
    localStorage.setItem('recipes', JSON.stringify(recipes))
    this.setState({ recipes })
  }

  open = (state, currentIndex) => {
    this.setState({ [state]: true, currentIndex: currentIndex })
  }

  render() {

    const { recipes, newestRecipe, currentIndex } = this.state

    // dont try to render accordion if there are no items in the list
    return (
      <div className="App container">
        {recipes.length > 0 && (
          <div>
            <PanelGroup accordion id='recipe-list'>
              {recipes.map((recipe, index) => (
                <Panel eventKey={index} key={index}>
                  <Panel.Heading>
                    <Panel.Title toggle>{recipe.recipeName}</Panel.Title>
                  </Panel.Heading>
                  <Panel.Body collapsible>
                    <ol>
                      {recipe.ingredients.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ol>
                    <ButtonToolbar>
                      <Button bsStyle="danger" onClick={(event) => this.deleteRecipe(index)}>Delete</Button>
                      <Button bsStyle="default" onClick={(event) => this.open("showEditModal", index)}>Edit</Button>
                    </ButtonToolbar>
                  </Panel.Body>
                </Panel>
              ))}
            </PanelGroup>
            <Modal show={this.state.showEditModal} onHide={this.close}>
              <Modal.Header closeButton></Modal.Header>
              <Modal.Title>Edit Recipe</Modal.Title>
              <Modal.Body>
                <FormGroup controlId="formControlsBasicText">
                  <ControlLabel>Recipe Name</ControlLabel>
                  <FormControl type="text" value={recipes[currentIndex].recipeName} placeholder="Enter recipe name" onChange={(event) => this.updateRecipeName(event.target.value, currentIndex)}></FormControl>
                </FormGroup>
                <FormGroup controlId="formControlsTextArea">
                  <ControlLabel>Edit Ingredients</ControlLabel>
                  <FormControl componentClass="textarea" onChange={(event) => this.updateIngredients(event.target.value.split(","), currentIndex)} value={recipes[currentIndex].ingredients}></FormControl>
                </FormGroup>
              </Modal.Body>
              <Modal.Footer>
                <Button bsStyle="default" onClick={this.close}>Close</Button>
              </Modal.Footer>
            </Modal>
          </div>
        )}

        <Modal show={this.state.showAddModal} onHide={this.close}>
          <Modal.Header closeButton></Modal.Header>
          <Modal.Title>Add a Recipe</Modal.Title>
          <Modal.Body>
            <FormGroup controlId="formControlsBasicText">
              <ControlLabel>Recipe Name</ControlLabel>
              <FormControl type="text" value={newestRecipe.recipeName} placeholder="Enter recipe name" onChange={(event) => this.updateNewRecipe(event.target.value, newestRecipe.ingredients)}></FormControl>
            </FormGroup>
            <FormGroup controlId="formControlsTextArea">
              <ControlLabel>Ingredients Separated by Commas</ControlLabel>
              <FormControl type="textarea" value={newestRecipe.ingredients} placeholder="Enter ingredients seperated by commas." onChange={(event) => this.updateNewRecipe(newestRecipe.recipeName, event.target.value.split(","))}></FormControl>
            </FormGroup>
          </Modal.Body>
          <Modal.Footer>
            <Button bsStyle="success" onClick={(event) => this.saveNewRecipe()}>Save Recipe</Button>
          </Modal.Footer>
        </Modal>



        <Button bsStyle="primary" onClick={(event) => this.open("showAddModal", currentIndex)}>Add Recipe</Button>
      </div>
    );
  }

  // Saves a new recipe to recipes
  saveNewRecipe() {
    let recipes = this.state.recipes.slice()
    recipes.push({ recipeName: this.state.newestRecipe.recipeName, ingredients: this.state.newestRecipe.ingredients })

    localStorage.setItem('recipes', JSON.stringify(recipes))
    this.setState({ recipes })
    this.setState({ newestRecipe: { recipeName: "", ingredients: [] } })
    this.close()
  }

  updateIngredients(ingredients, currentIndex) {
    let recipes = this.state.recipes.slice()
    recipes[currentIndex] = { recipeName: recipes[currentIndex].recipeName, ingredients: ingredients }
    localStorage.setItem('recipes', JSON.stringify(recipes))
    this.setState({ recipes })
  }

  updateNewRecipe(value, ingredients) {
    this.setState({ newestRecipe: { recipeName: value, ingredients: ingredients } })
  }

  updateRecipeName(recipeName, currentIndex) {
    let recipes = this.state.recipes.slice()
    recipes[currentIndex] = { recipeName: recipeName, ingredients: recipes[currentIndex].ingredients }
    localStorage.setItem('recipes', JSON.stringify(recipes))
    this.setState({ recipes })
  }

}

export default App;
