import React, { useEffect, useRef } from 'react';

const ContactModal = ({ isOpen, onClose, onSend, initialMessage }) => {
  const [message, setMessage] = React.useState(initialMessage);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setMessage(initialMessage);
      requestAnimationFrame(() => textareaRef.current?.focus());
    }
  }, [isOpen, initialMessage]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-backdrop fixed inset-0 z-[200] flex items-center justify-center bg-void/80 px-4 sm:px-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-panel w-full max-w-xl border-[3px] border-ink shadow-none relative">
        <div className="absolute -top-px -left-px w-3 h-3 border-t-2 border-l-2 border-orange pointer-events-none" aria-hidden="true" />
        <div className="absolute -top-px -right-px w-3 h-3 border-t-2 border-r-2 border-orange pointer-events-none" aria-hidden="true" />
        <div className="absolute -bottom-px -left-px w-3 h-3 border-b-2 border-l-2 border-orange pointer-events-none" aria-hidden="true" />
        <div className="absolute -bottom-px -right-px w-3 h-3 border-b-2 border-r-2 border-orange pointer-events-none" aria-hidden="true" />

        <div className="flex justify-between items-center gap-4 px-5 sm:px-8 py-4 border-b-[3px] border-ink/25">
          <h3 id="contact-modal-title" className="font-display font-black text-2xl sm:text-3xl uppercase leading-none">
            Say hello
          </h3>
          <button type="button" onClick={onClose} className="btn-stamp !py-2 !px-3 !text-[11px]" aria-label="Close">
            Close
          </button>
        </div>

        <div className="px-5 sm:px-8 py-6 sm:py-8">
          <label htmlFor="contact-message" className="block font-mono text-[11px] uppercase tracking-[0.08em] text-blue font-semibold mb-3">
            Your message
          </label>
          <textarea
            id="contact-message"
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full h-40 bg-paper border-2 border-ink/30 p-4 text-base font-medium font-body text-ink resize-none focus:outline-none focus:border-blue"
            placeholder="What are you working on?"
          />

          <button
            type="button"
            onClick={() => onSend(message)}
            className="btn-stamp w-full justify-center mt-6 !py-4"
          >
            Send on WhatsApp →
          </button>
          <p className="font-mono text-[10px] text-ink-muted mt-3 text-center normal-case tracking-normal">
            Opens WhatsApp with your draft · +234 808 574 1430
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactModal;
