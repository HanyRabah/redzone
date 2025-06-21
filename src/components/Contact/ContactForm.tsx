"use client"
import React, { useState, useRef } from 'react';
import FlipCtaButton from '../Layout/Flippers/FlipCtaButton';

interface ContactFormProps {
  className?: string;
  backgroundImage?: string;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
}

interface PopupState {
  show: boolean;
  type: 'success' | 'error';
}

const ContactForm: React.FC<ContactFormProps> = ({ 
  className = '', 
  backgroundImage = '/assets/images/backgrounds/pexels-photo-1287145.jpeg' 
}) => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [popup, setPopup] = useState<PopupState>({ show: false, type: 'success' });
  const [formVisible, setFormVisible] = useState(true);

  const formRef = useRef<HTMLFormElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormVisible(false);

    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate success/error randomly for demo
      const isSuccess = Math.random() > 0.3;
      
      setPopup({ show: true, type: isSuccess ? 'success' : 'error' });
      
      if (isSuccess) {
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          message: ''
        });
      }
    } catch (error) {
      setPopup({ show: true, type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const closePopup = () => {
    setPopup({ show: false, type: 'success' });
    setFormVisible(true);
  };

  return (
    <section 
      className={`min-h-screen bg-cover bg-center bg-no-repeat relative ${className}`}
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="absolute inset-0 bg-black opacity-25"></div>
      
      <div className="relative min-h-screen flex items-center">
        <div className="w-full">
          <div className="container mx-auto px-4 py-32 max-w-2xl">
            <div className={`transition-all duration-1000 ${formVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none'}`}>
              <h4 className="text-sm font-medium text-gray-300 text-center uppercase tracking-widest mb-24">
                Let&apos;s Get In Touch!
              </h4>
              
              <form 
                ref={formRef}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                {/* First Name */}
                <div className="relative">
                  <div className="md:mr-2">
                    <input
                      type="text"
                      name="firstName"
                      id="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-5 bg-transparent border-none border-b border-white border-opacity-40 focus:border-white focus:outline-none text-white text-sm font-normal tracking-wide transition-colors duration-500"
                    />
                    <label
                      htmlFor="firstName"
                      className={`absolute left-3 top-6 text-sm font-medium tracking-wide text-white opacity-70 pointer-events-none transition-all duration-1000 transform-gpu ${
                        formData.firstName 
                          ? 'translate-y-[-28px] scale-80 opacity-70' 
                          : 'translate-y-0 scale-100 opacity-100'
                      }`}
                      style={{ transformOrigin: 'left' }}
                    >
                      First name
                    </label>
                  </div>
                </div>

                {/* Last Name */}
                <div className="relative">
                  <div className="md:mx-1">
                    <input
                      type="text"
                      name="lastName"
                      id="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-5 bg-transparent border-none border-b border-white border-opacity-40 focus:border-white focus:outline-none text-white text-sm font-normal tracking-wide transition-colors duration-500"
                    />
                    <label
                      htmlFor="lastName"
                      className={`absolute left-3 top-6 text-sm font-medium tracking-wide text-white opacity-70 pointer-events-none transition-all duration-1000 transform-gpu ${
                        formData.lastName 
                          ? 'translate-y-[-28px] scale-80 opacity-70' 
                          : 'translate-y-0 scale-100 opacity-100'
                      }`}
                      style={{ transformOrigin: 'left' }}
                    >
                      Last name
                    </label>
                  </div>
                </div>

                {/* Email */}
                <div className="relative">
                  <div className="md:ml-2">
                    <input
                      type="email"
                      name="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-5 bg-transparent border-none border-b border-white border-opacity-40 focus:border-white focus:outline-none text-white text-sm font-normal tracking-wide transition-colors duration-500"
                    />
                    <label
                      htmlFor="email"
                      className={`absolute left-3 top-6 text-sm font-medium tracking-wide text-white opacity-70 pointer-events-none transition-all duration-1000 transform-gpu ${
                        formData.email 
                          ? 'translate-y-[-28px] scale-80 opacity-70' 
                          : 'translate-y-0 scale-100 opacity-100'
                      }`}
                      style={{ transformOrigin: 'left' }}
                    >
                      Email address
                    </label>
                  </div>
                </div>

                {/* Message */}
                <div className="relative md:col-span-3 mt-8">
                  <textarea
                    name="message"
                    id="message"
                    required
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full min-h-[150px] px-3 py-5 bg-transparent border-none border-b border-white border-opacity-40 focus:border-white focus:outline-none text-white text-sm font-normal tracking-wide transition-colors duration-500 resize-none"
                  />
                  <label
                    htmlFor="message"
                    className={`absolute left-3 top-6 text-sm font-medium tracking-wide text-white opacity-70 pointer-events-none transition-all duration-1000 transform-gpu ${
                      formData.message 
                        ? 'translate-y-[-28px] scale-80 opacity-70' 
                        : 'translate-y-0 scale-100 opacity-100'
                    }`}
                    style={{ transformOrigin: 'left' }}
                  >
                    Message content
                  </label>
                </div>

                {/* Submit Button */}
                <div className="md:col-span-3 text-center mt-24">
                  {/* <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`relative border border-white px-8 py-3 text-white text-sm font-normal tracking-[7px] uppercase transition-all duration-500 hover:bg-white hover:text-black ${
                      isSubmitting ? 'pointer-events-none' : 'cursor-pointer'
                    }`}
                  >
                    <span className={`transition-all duration-500 ${isSubmitting ? 'opacity-0' : 'opacity-100'}`}>
                      submit
                    </span>
                    <span 
                      className={`absolute inset-0 flex items-center justify-center text-sm font-normal tracking-[7px] uppercase transition-opacity duration-500 ${
                        isSubmitting ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      Wait...
                    </span>
                  </button> */}
                  <FlipCtaButton
                    text="Submit"
                    onClick={(e) => handleSubmit(e)}
                    disabled={isSubmitting}
                  />
                </div>
              </form>
            </div>

            {/* Success Popup */}
            <div className={`fixed inset-0 flex items-center justify-center transition-all duration-1000 ${
              popup.show && popup.type === 'success' 
                ? 'opacity-100 scale-100 pointer-events-auto' 
                : 'opacity-0 scale-75 pointer-events-none'
            }`}>
              <div className="bg-white p-8 rounded-lg text-center max-w-sm mx-4">
                <div className="w-12 h-12 mx-auto mb-6 flex items-center justify-center rounded-full border border-green-500">
                  <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="text-gray-800 text-lg font-bold mb-6">
                  Thank you!<br />
                  Your submission<br />
                  has been received!
                </div>
                <button
                  onClick={closePopup}
                  className="group relative inline-block text-black hover:text-red-500 transition-colors duration-300 cursor-pointer"
                >
                  <span className="relative z-10">Close</span>
                  <span className="absolute inset-0 bg-red-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left -z-10"></span>
                </button>
              </div>
            </div>

            {/* Error Popup */}
            <div className={`fixed inset-0 flex items-center justify-center transition-all duration-1000 ${
              popup.show && popup.type === 'error' 
                ? 'opacity-100 scale-100 pointer-events-auto' 
                : 'opacity-0 scale-75 pointer-events-none'
            }`}>
              <div className="bg-white p-8 rounded-lg text-center max-w-sm mx-4">
                <div className="w-12 h-12 mx-auto mb-6 flex items-center justify-center rounded-full border border-red-500">
                  <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <div className="text-gray-800 text-lg font-bold mb-6">Error</div>
                <button
                  onClick={closePopup}
                  className="group relative inline-block text-black hover:text-red-500 transition-colors duration-300 cursor-pointer"
                >
                  <span className="relative z-10">Close</span>
                  <span className="absolute inset-0 bg-red-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left -z-10"></span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;