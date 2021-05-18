import React ,{ Component, Fragment } from "react"
import JqueryHelper from '../../../helpers/JqueryHelper'
import NumberOfPages from "../../Basics/NumberOfPages"
import Pagination from "../../Basics/Pagination"
import CommonFunctions from '../../../helpers/CommonFunctions'
import axios from "axios"
import Config from '../../../../Config'
import FoodRow from "./FoodRow"
import FoodForms from "./FoodForms"
import EditForm from './EditForm'
import CustomAlert from "../../Basics/CustomAlert"

export default class Index extends Component {
    constructor(props) {
        super(props)
        this.props.changeNavbarTitle('Food')
        this.entity_url = `${Config.apiBaseUrl}/bar/food-category`
        this.state = {
            items: [],
            keyword: '',
            dataPerPage: 10,
            headerTitle: '10 Items',
            currentPage: 1,
            lastPage: 5,
            paginationPages: [],
            deleteItemName: '',
            deleteItemId: 0,
            foodId: 0,
            showCustomAlert:false,
            customAlertData:{
                title: 'Success Notification' ,message: 'Operation proceed successfully' ,actionFor: 'success',
                cancel: () => {
                    JqueryHelper.cancel()
                    this.setState({showCustomAlert: false})
                }
            }
        }
        this.elScroll = this.utilizeScroll()
    }

    utilizeScroll = () => {
        const elRef = React.createRef()
        const executeScroll = () => elRef.current.scrollIntoView()
        return { executeScroll, elRef }
    }

    changeKeyword = (e) => {
        this.setState({keyword: e.target.value})
    }

    getPreviousPage = () => {
        const currentPage = this.state.currentPage
        if (currentPage > 1) this.loadDataPerPage(currentPage - 1)
    }

    getNextPage = () => {
        const currentPage = this.state.currentPage
        if (this.state.lastPage > currentPage) this.loadDataPerPage(currentPage + 1)
    }

    changeDataPerPage = (dataPerPage) => {
        this.setState({dataPerPage} ,this.loadDataPerPage(1))
    }

    loadDataPerPage = (pageNumber) => {
        this.setState({currentPage: pageNumber} ,this.fetchFoodList)
    }

    getPrintLink = () => {
        // here we need to call an api to get the print link and we most secure it
        CommonFunctions.print(`${this.entity_url}/print`)
    }

    componentDidMount = () => {
        this.fetchFoodList()
    }

    deleteFood = (food_id ,name) => {
        this.setState({deleteItemName: name ,deleteItemId: food_id} ,JqueryHelper.openDeleteAlert)
    }

    deleteFoodConfirmed = () => {
        axios.delete(`${this.entity_url}/${this.state.deleteItemId}`)
        .then(response => {
            JqueryHelper.cancel()
            this.showWarning(`${response.data.data.name_en} is deleted successfully` ,true)
            this.fetchFoodList()
        })
        .catch(err => {
            this.showWarning('Sorry we can`t proceed this process now ,try again later or call technical support')
        })
    }

    setItemIdForEdit = (foodId) => {
        JqueryHelper.cancel()
        this.setState({foodId} ,JqueryHelper.openEditForm)
    }

    removeEditForm = () => {
        JqueryHelper.cancel()
        this.setState({foodId: 0})
    }

    fetchFoodList = () => {
        this.setState({foodId: 0 ,headerTitle: 'Loading Data...'} ,() => {
            axios
            .get(`${this.entity_url}?limit=${this.state.dataPerPage}&page=${this.state.currentPage}&keyword=${this.state.keyword}`)
            .then(response => {
                const links = response.data.meta.links
                // here we just remove the first & last indexes to ignore (Next & Prev) buttons from backend
                delete links[0]
                delete links[links.length - 1]
    
                const from = response.data.meta.from ,
                    to = response.data.meta.to ,
                    itemNumber = to - from + 1
                this.setState({
                    items: response.data.data,
                    headerTitle: `${itemNumber} Items ,From : ${from ? from : '0'} To : ${to ? to : '0'}`,
                    paginationPages: links,
                    lastPage: response.data.meta.last_page
                } ,this.elScroll.executeScroll())
            })
        })
    }

    showWarning = (message ,forSuccess = false) => {
        const customAlertData = this.state.customAlertData
        customAlertData.title = forSuccess ? 'Success Notification' : 'Failed Notification'
        customAlertData.message = message
        customAlertData.actionFor = forSuccess ? 'success' : 'danger'
        this.setState({
            showCustomAlert:true,
            customAlertData: customAlertData
        })
    }

    render() {
        return (
            <Fragment>
                <div className="page-section header-box" ref={this.elScroll.elRef}>
                    <div className="row header">
                        <div className="search-box">
                            <img alt="Gymme" className="en" src="/assets/svg/search-solid.svg"/>
                            <input className="rounded-box" type="text" placeholder="Search"
                                onChange={this.changeKeyword} value={this.state.keyword}/>
                        </div>
                        <button className="btn btn-light" onClick={this.fetchFoodList}>Search</button>
                        <button className="btn btn-dark" onClick={JqueryHelper.openAddForm}>Add Category</button>
                    </div>
                </div>
                
                <div className="page-section content">
                    <div className="table-section">
                        <div className="table-header">
                            <span className="table-header-title">{this.state.headerTitle}</span>
                            <button className="btn btn-dark btn-small" onClick={this.getPrintLink}>
                                <img alt="Gymme" src="/assets/svg/print-solid.svg"/>
                                <span>Print</span>
                            </button>
                        </div>
                        <div className="table-container">
                            <div className="table">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>English Name</th>
                                            <th>Arabic Name</th>
                                            <th>Added Date</th>
                                            <th className="actions">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        { this.state.items.map(item => <FoodRow changeItemForEdit={this.setItemIdForEdit} deleteFood={this.deleteFood} key={item.id} item={item}/>) }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        
                        <div className="controls">
                            <NumberOfPages
                                changeDataPerPage={this.changeDataPerPage}
                                dataPerPage={this.state.dataPerPage}/>
                            <Pagination
                                getNextPage={this.getNextPage}
                                getPreviousPage={this.getPreviousPage}
                                currentPage={this.state.currentPage}
                                pages={this.state.paginationPages}
                                lastPage={this.state.lastPage}
                                loadDataPerPage={this.loadDataPerPage}/>
                        </div>
                    </div>
                </div>
                <div id="forms" className="no-display">
                    <FoodForms
                        deleteItemName={this.state.deleteItemName}
                        addEntityUrl={this.entity_url}
                        warningAlert={this.showWarning}
                        reloadData={() => this.loadDataPerPage(1)}
                        deleteFoodConfirmed={this.deleteFoodConfirmed}/>
                    {
                        this.state.foodId !== 0 ?
                            <EditForm
                                entityUrl={this.entity_url}
                                warningAlert={this.showWarning}
                                foodId={this.state.foodId}
                                removeEditForm={this.removeEditForm}
                                reloadCurrentPage={this.fetchFoodList}/>
                            :
                            ''
                    }
                </div>
                {
                    this.state.showCustomAlert ?
                        <CustomAlert
                            customId={this.state.customAlertData.actionFor}
                            customTitle={this.state.customAlertData.title}
                            customMessage={this.state.customAlertData.message}
                            confirmFunction={this.state.customAlertData.cancel}
                            cancelFunction={this.state.customAlertData.cancel}/>
                        :''
                }
            </Fragment>
        )
    }
}