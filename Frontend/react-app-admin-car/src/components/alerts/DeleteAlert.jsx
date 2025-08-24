import React, { Component } from 'react'


class DeleteAlert extends Component {
    render() {
        return (
            <div className='flex w-full h-auto text-center p-4 flex-col space-x-4'>
                <div className='text-lg font-semibold text-white mb-6'>{this.props.message}</div>
                <div className='flex justify-around w-full'>
                    <button onClick={this.props.onCancel} className="px-4 py-2 bg-gray-300 rounded">Annuler</button>
                    <button onClick={this.props.onDelete} className="px-4 py-2 bg-red-500 text-white rounded">Supprimé</button>
                </div>
            </div>
        )
    }
}

export default DeleteAlert;
