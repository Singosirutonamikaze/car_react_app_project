import React, { Component } from 'react'
import { LuDownload } from 'react-icons/lu';
import TransactionInfoCard from '../cards/TransactionInfoCard';
import moment from 'moment';


class ExpenseList extends Component {
    render() {
        const { data = [], onDeleteExpense, onDownloadExpense } = this.props;
        return (
            <div className='card'>
                <div className='flex items-center justify-between p-4 border-b border-gray-100/50'>
                    <h4 className='text-lg font-semibold'>Listes des dépenses</h4>
                    <button onClick={onDownloadExpense} className='card-btn  w-40 h-10 flex justify-around p-4 items-center gap-1 text-blue-600 hover:text-blue-800 transition'>
                        <span className='font-bold'>Télécharger</span>
                        <LuDownload className='text-base' />
                    </button>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2'>
                    {data.length === 0 ? (
                        <p className='text-gray-500'>Aucune dépense trouvée.</p>
                    ) : (
                        data.slice(0, 10).map((expense) => (
                            <div className='mt-6' key={expense._id}>
                                <TransactionInfoCard
                                    title={expense.category}
                                    icon={expense.icon}
                                    date={expense.date ? moment(expense.date).format("DD MMM YYYY") : ''}
                                    amount={expense.amount}
                                    type='expense'
                                    onDelete={() => onDeleteExpense(expense._id)}
                                />
                            </div>
                        ))
                    )}
                </div>
            </div>
        )
    }
}

export default ExpenseList;
