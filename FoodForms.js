import { Component, Fragment } from "react"
import DeleteAlert from "../../Basics/DeleteAlert"
import AddForm from "./AddForm"
import './AddForm.css'

export default class FoodForms extends Component {
    render() {
        return (
            <Fragment>
                <DeleteAlert
                    deleteFoodConfirmed={this.props.deleteFoodConfirmed}
                    deleteItemName={this.props.deleteItemName}/>
                <AddForm
                    addEntityUrl={this.props.addEntityUrl}
                    warningAlert={this.props.warningAlert}
                    reloadData={this.props.reloadData}/>
            </Fragment>
        )
    }
}