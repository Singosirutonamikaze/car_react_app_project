import React, { Component, useEffect, useState } from 'react'
import { LuPlus } from 'react-icons/lu';
import CustomBarChart from '../charts/CustomBarChart';
import { prepareExpenseLineChartData } from '../../utils/helper';
import CustomLineChart from '../charts/CustomLineChart';

function ExpenseOverview({ data, onAddExpense }) {
    const [chartData, setChartData] = useState(data || []);

    useEffect(() => {
        const result = prepareExpenseLineChartData(data);

        setChartData(result);

        return () => {};
    }, [data]);

    return (
        <div className='card'>
            <div className='flex items-center justify-between'>
                <div className='text-lg font-semibold text-gray-800'>
                    <h5 className='text-lg'>Aperçu des dépenses</h5>
                    <p className='text-xs text-gray-400 mt-0.5'>
                        Suivez vos dépenses au fil du temps et analysez les tendances de vos dépenses.
                    </p>
                </div>
                <button
                    onClick={onAddExpense}
                    className='add-button'
                >
                    <LuPlus className='mr-2 text-lg' /> Ajouter une dépense
                </button>
            </div>

            <div className='mt-10'>
                <CustomLineChart data={chartData} />
            </div>
        </div>
    );
}

export default ExpenseOverview;
