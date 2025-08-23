import React, { Component } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { LuImage, LuX } from 'react-icons/lu';

class EmojiPickerPopup extends Component {
    constructor(props) {
        super(props);

        this.state = {
            icon: props.selectedEmoji || '',
            isOpen: false
        };
    }

    componentDidUpdate(prevProps) {
        // Mettre à jour l'état si la prop selectedEmoji change
        if (prevProps.selectedEmoji !== this.props.selectedEmoji && this.props.selectedEmoji) {
            this.setState({ icon: this.props.selectedEmoji });
        }
    }

    render() {
        const { onEmojiClick } = this.props;
        
        return (
            <div className='flex flex-col md:flex-row items-start gap-5 mb-6 '>
                <div
                    className='flex flex-center items-center gap-4 cursor-pointer'
                    onClick={() => this.setState({ isOpen: !this.state.isOpen })}
                >
                    <div className='w-12 h-12 flex items-center justify-center text-2xl bg-purple-50 text-purple-600 rounded-lg'>
                        {
                            this.state.icon ? (
                                <span className="text-2xl">{this.state.icon}</span>
                            ) : (
                                <LuImage />
                            )
                        }
                    </div>
                    <p className='text-sm text-gray-500'>
                        {
                            this.state.icon ? 'Changer votre icône' : 'Choisir une icône'
                        }
                    </p>
                </div>
                {
                    this.state.isOpen && (
                        <div className='relative'>
                            <button
                                className='w-7 h-7 flex items-center justify-center bg-white border border-gray-200 rounded-full absolute -top-2 -right-2 z-10 cursor-pointer'
                                onClick={() => this.setState({ isOpen: false })}
                            >
                                <LuX />
                            </button>
                            <EmojiPicker
                                onEmojiClick={(emojiObject) => {
                                    // L'emoji lui-même est dans emojiObject.emoji
                                    const emoji = emojiObject.emoji;
                                    console.log("Emoji sélectionné:", emoji, emojiObject);
                                    
                                    this.setState({ icon: emoji, isOpen: false });
                                    
                                    // Appeler la fonction onEmojiClick passée en prop
                                    if (onEmojiClick) {
                                        onEmojiClick(emoji);
                                    }
                                }}
                            />
                        </div>
                    )
                }
            </div>
        )
    }
}

export default EmojiPickerPopup;