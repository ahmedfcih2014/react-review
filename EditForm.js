import axios from "axios"
import { Component } from "react"

export default class EditForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            id: this.props.foodId,
            name_ar: '',
            name_en: '',
            errors: {
                name_ar: '',
                name_en: ''
            }
        }
    }

    changeNameEn = (e) => {
        this.setState({name_en: e.target.value ,errors: {name_en: '' ,name_ar: this.state.errors.name_ar}})
    }

    changeNameAr = (e) => {
        this.setState({name_ar: e.target.value ,errors: {name_ar: '' ,name_en: this.state.errors.name_en}})
    }

    updateFood = () => {
        const data = {
            _method: 'PUT',
            name_en: this.state.name_en,
            name_ar: this.state.name_ar
        }
        axios.post(`${this.props.entityUrl}/${this.state.id}` ,data)
        .then(response => {
            this.props.warningAlert("Food updated successfully" ,true)
            this.props.reloadCurrentPage()
        })
        .catch(err => {
            const error = {...err}
            if (error.response.data.errors) {
                this.setState({errors: error.response.data.errors})
            } else {
                this.props.warningAlert("Can`t update food for now ,try again later or call technical support")
            }
        })
    }

    cancelEditForm = () => {
        this.setState({
            id: 0, name_ar: '' ,name_en: ''
        } ,this.props.removeEditForm)
    }

    componentDidMount = () => {
        axios.get(`${this.props.entityUrl}/${this.state.id}`)
        .then(response => {
            this.setState({
                name_ar: response.data.data.name_ar,
                name_en: response.data.data.name_en
            })
        })
        .catch(err => {
            this.props.warningAlert("Can`t update food for now ,try again later or call technical support")
            this.props.reloadCurrentPage()
        })
    }

    render() {
        return (
            <div id="edit-form" className="form-container no-display">
                <div className="contain">
                    <div className="header">
                        <div className="title">
                            <h4 className="heading">Edit Food</h4>
                        </div>
                        <div className="header-icon" onClick={this.cancelEditForm}>
                            <img alt="Gymme" src="/assets/svg/times-solid-form.svg"/>
                        </div>
                    </div>
                    <form>
                        <div className="section">
                            <div className="row">
                                <div className="col-md-12 pad0 d-flex flex-column">
                                    <div className="pad0">
                                        <div className="form-group">
                                            <input
                                                value={this.state.name_en} onChange={this.changeNameEn}
                                                className="rounded-box padding en" type="text" placeholder="English Name"/>
                                            {
                                                this.state.errors.name_en ?
                                                <div className="invalid-feedback" style={{display: 'block'}}>
                                                    {this.state.errors.name_en}
                                                </div>
                                                :
                                                ''
                                            }
                                        </div>
                                        <div className="form-group">
                                            <input
                                                value={this.state.name_ar} onChange={this.changeNameAr}
                                                className="rounded-box padding ar" type="text" placeholder="الإسم بالعربي"/>
                                            {
                                                this.state.errors.name_ar ?
                                                <div className="invalid-feedback" style={{display: 'block'}}>
                                                    {this.state.errors.name_ar}
                                                </div>
                                                :
                                                ''
                                            }
                                        </div>
                                    </div>
                                    <div className="confirm mt-auto">
                                        <button type="button" className="btn btn-default" onClick={this.cancelEditForm}>Cancel</button> 
                                        <button type="button" className="btn btn-light" onClick={this.updateFood}>Update Category</button> 
                                    </div>
                                </div>                     
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}