import { Github, Mail, MapPin, ExternalLink } from 'lucide-react';

const Contact = () => {
      return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
                  <div className="w-full max-w-2xl">
                        <div className="text-center mb-10">
                              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl mb-2">
                                    Contact Us
                              </h1>
                              <p className="text-lg text-gray-600">
                                    We'd love to hear from you.
                              </p>
                        </div>

                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                              <div className="p-8">
                                    <div className="flex flex-col gap-6">

                                          {/* Row 1: Location */}
                                          <div className="flex items-center gap-5 p-4 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                                                <div className="flex-shrink-0 p-3 bg-indigo-50 rounded-lg text-indigo-600">
                                                      <MapPin size={24} />
                                                </div>
                                                <div>
                                                      <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-1">Location</h3>
                                                      <p className="text-lg font-semibold text-gray-900">Hyderabad, India</p>
                                                </div>
                                          </div>

                                          {/* Row 2: Email */}
                                          <a
                                                href="mailto:veerachandanashanigaram@gmail.com"
                                                className="flex items-center gap-5 p-4 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 group"
                                          >
                                                <div className="flex-shrink-0 p-3 bg-indigo-50 rounded-lg text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                                      <Mail size={24} />
                                                </div>
                                                <div>
                                                      <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-1">Email</h3>
                                                      <p className="text-lg font-semibold text-gray-900">veerachandanashanigaram@gmail.com</p>
                                                </div>
                                          </a>

                                          {/* Row 3: GitHub */}
                                          <a
                                                href="https://github.com/SChandanaa"
                                                target="_blank"
                                                rel="noreferrer"
                                                className="flex items-center gap-5 p-4 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 group"
                                          >
                                                <div className="flex-shrink-0 p-3 bg-gray-100 rounded-lg text-gray-900 group-hover:bg-gray-900 group-hover:text-white transition-colors">
                                                      <Github size={24} />
                                                </div>
                                                <div className="flex-grow">
                                                      <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-1">GitHub</h3>
                                                      <div className="flex items-center gap-2">
                                                            <p className="text-lg font-semibold text-gray-900">View Profile</p>
                                                            <ExternalLink size={16} className="text-gray-400 group-hover:text-gray-900 transition-colors" />
                                                      </div>
                                                </div>
                                          </a>

                                    </div>
                              </div>
                        </div>
                  </div>
            </div>
      );
};

export default Contact;
