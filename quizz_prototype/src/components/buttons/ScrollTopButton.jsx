import React, { useState } from 'react';
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';


const ScrollTopButton = () => {

    const [visible, setVisible] = useState(false)

    const toggleVisible = () => {
        const scrolled = document.documentElement.scrollTop;
        if (scrolled > 300) {
            setVisible(true)
        }
        else if (scrolled <= 300) {
            setVisible(false)
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
            /* you can also use 'auto' behaviour
               in place of 'smooth' */
        });
    };

    const scrollToBottom = () => {
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
            /* you can also use 'auto' behaviour
               in place of 'smooth' */
        });
    };

    window.addEventListener('scroll', toggleVisible);

    return (
        <div
            className='fixed bottom-[60px] right-4'
        >
            <div
            style={{ display: visible ? 'flex' : 'none' }}
                className='text-orange-500 w-[45px] h-[45px] rounded-full bg-slate-50 flex justify-center items-center shadow-xl my-2'
            >
                <IoMdArrowDropup size={45} onClick={scrollToTop} />
            </div>
            <div
            style={{ display: visible ? 'flex' : 'none' }} 
                className='text-orange-500 w-[45px] h-[45px] rounded-full bg-slate-50 flex justify-center items-center shadow-xl my-2'
            >
                <IoMdArrowDropdown size={45} onClick={scrollToBottom}
                    />
            </div>

        </div>
    );
}

export default ScrollTopButton;