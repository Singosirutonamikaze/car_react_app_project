import React, { Component } from 'react'


class DeleteAlert extends Component {

    constructor(props) {
        super(props);
        this.state = {
            message: "",
            onDelete: {}
        }
    }

    render() {
        return (
            <div className='flex w-1/2 h-1/2 items-center justify-center space-x-4'>
                <div>{this.state.message}</div>
                <div className='flex justify-around w-full'>
                    <button onClick={this.props.onCancel} className="px-4 py-2 bg-gray-300 rounded">Annuler</button>
                    <button onClick={this.props.onDelete} className="px-4 py-2 bg-red-500 text-white rounded">Supprimé</button>
                </div>
            </div>
        )
    }
}

export default DeleteAlert;
