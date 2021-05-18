import { Component } from "react"

export default class FoodRow extends Component {
    render() {
        return (
            <tr>
                <td>{this.props.item.name_en}</td>
                <td>{this.props.item.name_ar}</td>
                <td>{this.props.item.created}</td>
                <td className="actions">
                    <button onClick={() => this.props.changeItemForEdit(this.props.item.id)}>
                        <img alt="Gymme" src="/assets/svg/pen-solid.svg"/>
                    </button>
                    <button onClick={() => this.props.deleteFood(this.props.item.id ,this.props.item.name_en)}>
                        <img alt="Gymme" src="/assets/svg/delete.svg"/>
                    </button>
                </td>
            </tr>
        )
    }
}