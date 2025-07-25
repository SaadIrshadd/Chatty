import React, { useRef, useState } from 'react'
import { useChatStore } from '../store/useChatStore';
import { Image, Send, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { RiEmojiStickerLine } from 'react-icons/ri';
import EmojiPicker from 'emoji-picker-react';
import { Loader } from 'lucide-react'



const MessageInput = () => {
    const [text, setText] = useState("");
    const [sending, setSending] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [emoji, setEmoji] = useState(null)
    const fileInput = useRef(null);
    const { sendMessage } = useChatStore();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if(!file.type.startsWith("image/")){
            toast.error("Please select an image file.");
            return;
        }

        const reader = new FileReader();
        reader.onload = () => { 
            setImagePreview(reader.result)
        };
        reader.readAsDataURL(file);
    }
    
    const removeImage = () => {
        setImagePreview(null);
        if(fileInput.current) fileInput.current.value = "";
    }

    const handleSendMessage = async(e) => {
        e.preventDefault();
        if( !text.trim() &&  !imagePreview ) return;
        if (sending) return;

        try {
            setSending(true);

            await sendMessage({
                text: text.trim(),
                image: imagePreview,
            })

            //Clear form
            setText("");
            setImagePreview(null);
            
            if(fileInput.current) fileInput.current.value = "";

        } catch (error) {
            console.error("Failed to send a message", error);

        }finally {
            setSending(false);
        }
    }

    const handleEmoji = () => {
        setEmoji((prev) => !prev)
    }

    
return (
    <div className='p-4 w-full'>
      
      {imagePreview && (
        <div className='mb-3 flex items-center gap-2'>
            <div className='relative'>
                <img 
                    src={imagePreview} 
                    alt="Preview"
                    className='w-20 h-20 object-cover rounded-lg border border-zinc-700'    
                />
                <button
                    onClick={removeImage}
                    className='absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300 flex items-center justify-center'
                    type="button"
                >
                    <X className='size-3'/>
                </button>    
            </div>
        </div>   
      )}

      <form onSubmit={handleSendMessage} className='flex items-center gap-2'>
        <div className='flex-1 flex gap-2'>
            <input 
                type="text"
                className='w-full input input-bordered rounded-lg input-sm sm:input-md'
                placeholder='Type a message...'
                value={text}
                onChange={(e)=> {
                    const input = e.target.value;
                    const capitalized = input.charAt(0).toUpperCase() + input.slice(1);
                    setText(capitalized);
                }}    
            />
            <input 
                type="file"
                accept='image/*'
                className='hidden'
                ref={fileInput}
                onChange={handleImageChange}
            />
            <div className="relative">
            
            <button
                className={`btn btn-circle`}
                onClick={handleEmoji}
                type="button"
            >
                <RiEmojiStickerLine size={20} />
            </button>

            {emoji && (
                <div className="absolute bottom-full right-0 mb-2 z-50">
                <EmojiPicker
                    height={350} width={300}
                    onEmojiClick={(emojiData) => {
                    setText((prev) => prev + emojiData.emoji);
                    setEmoji(false); 
                    }}
                    lazyLoadEmojis='false'
                    skinTonesDisabled="true"
                    searchDisabled="true"
                    showPreview="false" 
                    emojiStyle="google"               
                />
                </div>
            )}
            </div>
            <button
                type="button"
                className={`btn btn-circle ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
                onClick={()=> fileInput.current?.click()}
            >
                <Image size={20} />
            </button>
        </div>

        <div className='flex'>
            <button
            type="submit"
            className='btn btn-sm btn-circle'
            disabled={ !text.trim() && !imagePreview }
        >
            {sending ? (            
                <Loader className="size-5 animate-spin" style={{ animationDuration: "1.5s" }} />                           
            ) : (
                <Send size={22} />
            )}
            </button>
        </div>
      </form>
    </div>
  )
}

export default MessageInput
