import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { FiSend } from "react-icons/fi";

function ContactForm() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });

    const formRef = useRef<HTMLDivElement | null>(null);
    const fieldsRef = useRef<Array<HTMLDivElement | null>>([]);

    useEffect(() => {
        const form = formRef.current;
        const fields = fieldsRef.current;

        if (form) {
            form.style.opacity = '0';
            form.style.transform = 'translateY(50px)';
            
            setTimeout(() => {
                form.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                form.style.opacity = '1';
                form.style.transform = 'translateY(0)';
            }, 300);

            fields.forEach((field, index) => {
                if (field) {
                    field.style.opacity = '0';
                    field.style.transform = 'translateY(20px)';
                    
                    setTimeout(() => {
                        field.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                        field.style.opacity = '1';
                        field.style.transform = 'translateY(0)';
                    }, 500 + index * 100);
                }
            });
        }
    }, []);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const button = form.querySelector('button[type="submit"]');
        
        if (button) {
            (button as HTMLButtonElement).style.transform = 'scale(0.95)';
            setTimeout(() => {
                (button as HTMLButtonElement).style.transform = 'scale(1)';
            }, 150);
        }

        alert("Votre message a été envoyé avec succès!");
        setFormData({ name: "", email: "", subject: "", message: "" });
    };

    return (
        <div 
            ref={formRef}
            className="bg-blue-900/30 backdrop-blur-md rounded-2xl p-8 border border-blue-700/30 hover:bg-blue-900/40 transition-all duration-300"
        >
            <h2 className="text-2xl font-bold text-white mb-6">Envoyez-nous un message</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div 
                    ref={el => { fieldsRef.current[0] = el }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-blue-100 mb-2">
                            Nom complet
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-blue-800/40 border border-blue-600/50 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 focus:scale-105"
                            placeholder="Votre nom"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-blue-100 mb-2">
                            Adresse email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-blue-800/40 border border-blue-600/50 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 focus:scale-105"
                            placeholder="votre@email.com"
                            required
                        />
                    </div>
                </div>

                <div ref={el => { fieldsRef.current[1] = el }}>
                    <label htmlFor="subject" className="block text-sm font-medium text-blue-100 mb-2">
                        Sujet
                    </label>
                    <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-blue-800/40 border border-blue-600/50 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 focus:scale-105"
                        placeholder="Sujet de votre message"
                        required
                    />
                </div>

                <div ref={el => { fieldsRef.current[2] = el }}>
                    <label htmlFor="message" className="block text-sm font-medium text-blue-100 mb-2">
                        Message
                    </label>
                    <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={5}
                        className="w-full px-4 py-3 bg-blue-800/40 border border-blue-600/50 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 focus:scale-105"
                        placeholder="Votre message..."
                        required
                    ></textarea>
                </div>

                <div ref={el => { fieldsRef.current[3] = el }}>
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 hover:scale-105 active:scale-95 hover:shadow-2xl"
                    >
                        Envoyer le message
                        <FiSend className="transition-transform duration-300 hover:translate-x-1" />
                    </button>
                </div>
            </form>
        </div>
    );
}

export default ContactForm;