import { FormEvent, useEffect, useRef, useState } from 'react';

interface ContactUsModalProps {
    onClose: () => void;
}

const ContactUsModal = ({ onClose }: ContactUsModalProps) => {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (dialog && !dialog.open) {
            dialog.showModal();
        }
    }, []);

    const closeModal = () => {
        setName('');
        setEmail('');
        setMessage('');
        setIsSubmitted(false);
        if (dialogRef.current?.open) {
            dialogRef.current.close();
        }
        onClose();
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setName('');
        setEmail('');
        setMessage('');
        setIsSubmitted(true);
    };

    return (
        <dialog
            ref={dialogRef}
            className="contact-us-dialog"
            aria-labelledby="contact-us-title"
            onCancel={(event) => {
                event.preventDefault();
                closeModal();
            }}
            onClick={(event) => {
                if (event.target === event.currentTarget) {
                    closeModal();
                }
            }}
        >
            <button type="button" className="close-button" onClick={closeModal}>
                Close
            </button>
            {isSubmitted ? (
                <div role="status">
                    <h2 id="contact-us-title">Thank you for your message</h2>
                    <button type="button" onClick={closeModal}>Continue</button>
                </div>
            ) : (
                <>
                    <h2 id="contact-us-title">Contact Us</h2>
                    <form className="contact-us-form" onSubmit={handleSubmit}>
                        <label htmlFor="contact-name">Name</label>
                        <input
                            id="contact-name"
                            name="name"
                            type="text"
                            autoComplete="name"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            required
                            autoFocus
                        />

                        <label htmlFor="contact-email">Email address</label>
                        <input
                            id="contact-email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            required
                        />

                        <label htmlFor="contact-message">Message</label>
                        <textarea
                            id="contact-message"
                            name="message"
                            value={message}
                            onChange={(event) => setMessage(event.target.value)}
                            required
                        />
                        <button type="submit">Submit</button>
                    </form>
                </>
            )}
        </dialog>
    );
};

export default ContactUsModal;
