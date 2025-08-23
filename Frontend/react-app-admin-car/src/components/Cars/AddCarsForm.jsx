import React, { Component } from 'react'
import Input from '../inputs/Input';
import EmojiPickerPopup from '../models/EmojiPickerPopup';

class AddExpenseForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            category: '',
            amount: '',
            date: '',
            icon: ''
        };
    }

    handleChange = (key, value) => {
        this.setState({
            [key]: value
        });
    }

    render() {
        return (
            <div>
                <EmojiPickerPopup
                    onEmojiClick={(emojiObject) => this.handleChange('icon', emojiObject.emoji)}
                    selectedEmoji={this.state.icon}
                />

                <Input
                    value={this.state.category}
                    onChange={e => this.handleChange('category', e.target.value)}
                    label="Catégorie"
                    placeholder="Alimentation, Transport etc"
                    type='text'
                />

                <Input
                    value={this.state.amount}
                    onChange={e => this.handleChange('amount', e.target.value)}
                    label='Montant'
                    placeholder=""
                    type='number'
                />

                <Input
                    value={this.state.date}
                    onChange={e => this.handleChange('date', e.target.value)}
                    label='Date'
                    placeholder="Date"
                    type='date'
                />

                <div className='flex justify-end mt-6'>
                    <button
                        type='button'
                        className='add-button add-btn-fill'
                        onClick={() => this.props.onAddExpense({
                            category: this.state.category,
                            amount: this.state.amount,
                            date: this.state.date,
                            icon: this.state.icon
                        })}
                    >
                        Ajouter une dépense
                    </button>
                </div>
            </div>
        )
    }
}

export default AddExpenseForm;
