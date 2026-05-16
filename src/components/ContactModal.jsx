import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const ContactModal = ({ isOpen, onClose, onSend, initialMessage }) => {
  const modalRef = useRef(null);
  const contentRef = useRef(null);
  const [message, setMessage] = React.useState(initialMessage);

  useEffect(() => {
    if (isOpen) {
      gsap.to(modalRef.current, { opacity: 1, display: 'flex', duration: 0.3 });
      gsap.fromTo(contentRef.current, 
        { y: 50, opacity: 0, scale: 0.9 }, 
        { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.7)" }
      );
    } else {
      gsap.to(modalRef.current, { opacity: 0, display: 'none', duration: 0.3 });
    }
  }, [isOpen]);

  return (
    <div ref={modalRef} className="fixed inset-0 z-[200] hidden items-center justify-center bg-brandDark/80 backdrop-blur-xl px-6">
      <div ref={contentRef} className="bg-brandCream w-full max-w-xl rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-brandDark/5">
        <div className="flex justify-between items-center mb-10">
           <h3 className="text-3xl font-black tracking-tighter uppercase">Message Michael</h3>
           <button onClick={onClose} className="p-4 hover:bg-brandDark/5 rounded-full transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
           </button>
        </div>
        
        <div className="mb-10">
           <label className="block text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-4">Your Message</label>
           <textarea 
             value={message}
             onChange={(e) => setMessage(e.target.value)}
             className="w-full h-40 bg-brandDark/5 rounded-2xl p-6 text-lg font-medium border-none focus:ring-2 focus:ring-primary transition-all resize-none"
             placeholder="Type your message here..."
           />
        </div>

        <button 
          onClick={() => onSend(message)}
          className="w-full py-6 bg-brandDark text-brandCream rounded-full font-black uppercase tracking-widest hover:bg-primary transition-colors duration-500 flex items-center justify-center gap-4"
        >
          Send Message
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
        </button>
      </div>
    </div>
  );
};

export default ContactModal;
