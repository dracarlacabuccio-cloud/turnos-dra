import React, { useState, useEffect } from 'react';
import { 
  Calendar, Clock, User, Mail, Phone, FileText, CheckCircle2, 
  ChevronRight, ArrowLeft, ShieldCheck, Stethoscope, Settings, 
  Video, DollarSign, Lock, LogOut, Edit3, Save, X, Info, Sparkles, Upload, AlertCircle
} from 'lucide-react';

export default function App() {
  const [profile, setProfile] = useState({
    name: 'Dra. Carla Cabuccio',
    title: 'Médica Clínica | Especialista en Medicina Interna',
    bio: 'Atención médica integral enfocada en la prevención, diagnóstico y tratamiento de enfermedades del adulto. Enfoque personalizado e interdisciplinario para tu bienestar general.',
    photoUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
    fee: 50000,
    duration: '30 min',
    modality: 'Virtual (Teleconsulta)',
    email: 'dracarlacabuccio@gmail.com',
    phone: '+54 9 11 1234-5678',
    days: ['Lunes', 'Jueves'],
    timeSlots: ['09:00', '09:30', '10:00', '10:30', '11:00'],
    emailJsServiceId: '',
    emailJsTemplateId: '',
    emailJsPublicKey: ''
  });

  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [patientInfo, setPatientInfo] = useState({
    fullName: '',
    dni: '',
    email: '',
    phone: '',
    reason: ''
  });
  const [bookedTurns, setBookedTurns] = useState([]);
  const [isDoctorMode, setIsDoctorMode] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [editProfile, setEditProfile] = useState({ ...profile });
  const [isBookingSuccess, setIsBookingSuccess] = useState(false);

  useEffect(() => {
    setEditProfile({ ...profile });
  }, [profile]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (authPassword === 'admin123') {
      setIsDoctorMode(true);
      setIsAuthOpen(false);
      setAuthPassword('');
      setAuthError('');
    } else {
      setAuthError('Contraseña incorrecta (Usa: admin123)');
    }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setProfile({ ...editProfile });
    alert('¡Perfil y datos actualizados con éxito!');
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditProfile(prev => ({ ...prev, photoUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const isDayAvailable = (dateString) => {
    if (!dateString) return false;
    const date = new Date(dateString + 'T00:00:00');
    const dayName = date.toLocaleDateString('es-ES', { weekday: 'long' });
    const capitalizedDay = dayName.charAt(0).toUpperCase() + dayName.slice(1);
    return profile.days.includes(capitalizedDay);
  };

  const isSlotTaken = (date, time) => {
    return bookedTurns.some(t => t.date === date && t.time === time);
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    const newTurn = {
      id: Date.now(),
      date: selectedDate,
      time: selectedTime,
      patient: { ...patientInfo },
      fee: profile.fee,
      createdAt: new Date().toLocaleDateString()
    };
    
    setBookedTurns([newTurn, ...bookedTurns]);
    setIsBookingSuccess(true);
    setStep(3);

    sendMailNotification(newTurn);
  };

  const sendMailNotification = (turn) => {
    const subject = encodeURIComponent(`Nuevo Turno Reservado - ${turn.patient.fullName}`);
    const body = encodeURIComponent(
      `Hola Dra. Carla Cabuccio,

Se ha reservado un nuevo turno de teleconsulta:

` +
      `📅 Fecha: ${turn.date}
` +
      `⏰ Hora: ${turn.time} hs

` +
      `👤 Paciente: ${turn.patient.fullName}
` +
      `🆔 DNI: ${turn.patient.dni}
` +
      `✉️ Mail: ${turn.patient.email}
` +
      `📱 Teléfono: ${turn.patient.phone}
` +
      `📝 Motivo: ${turn.patient.reason || 'No especificado'}

` +
      `💰 Honorario: $${turn.fee.toLocaleString()}

` +
      `Por favor contáctese con el paciente para enviarle el link de acceso a la consulta.`
    );
    
    window.open(`mailto:${profile.email}?subject=${subject}&body=${body}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#F7F3EA] text-[#263333] flex flex-col justify-between selection:bg-[#A9B9A6] selection:text-[#315D5A]">
      <header className="bg-[#315D5A] text-white py-4 px-6 shadow-md sticky top-0 z-40">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Stethoscope className="w-6 h-6 text-[#A9B9A6]" />
            <h1 className="font-semibold text-lg tracking-wide">Dra. Carla Cabuccio</h1>
          </div>
          <button 
            onClick={() => isDoctorMode ? setIsDoctorMode(false) : setIsAuthOpen(true)}
            className="flex items-center gap-1.5 text-xs bg-[#315D5A]/80 border border-[#A9B9A6]/40 hover:bg-[#263333] text-[#F7F3EA] px-3 py-1.5 rounded-full transition-all duration-200"
          >
            {isDoctorMode ? (
              <>
                <LogOut className="w-3.5 h-3.5" />
                <span>Vista Paciente</span>
              </>
            ) : (
              <>
                <Settings className="w-3.5 h-3.5" />
                <span>Panel Médica</span>
              </>
            )}
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto w-full px-4 py-6 flex-grow">

        {isAuthOpen && (
          <div className="fixed inset-0 bg-[#263333]/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-[#F7F3EA] rounded-2xl p-6 max-w-sm w-full border border-[#E7D8B5] shadow-2xl relative">
              <button 
                onClick={() => setIsAuthOpen(false)}
                className="absolute right-4 top-4 text-[#263333]/60 hover:text-[#263333]"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-[#315D5A]/10 text-[#315D5A] rounded-full flex items-center justify-center mx-auto mb-2">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-xl text-[#315D5A]">Acceso de Médica</h3>
                <p className="text-xs text-[#263333]/70 mt-1">Ingresa tu contraseña para editar honorarios, horarios y ver turnos</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#315D5A] mb-1">Contraseña</label>
                  <input 
                    type="password" 
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="Contraseña por defecto: admin123"
                    className="w-full px-3 py-2 text-sm border border-[#E7D8B5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#315D5A] bg-white text-[#263333]"
                    required
                  />
                  {authError && <p className="text-xs text-[#C9826B] mt-1 font-medium">{authError}</p>}
                </div>

                <button 
                  type="submit"
                  className="w-full bg-[#315D5A] text-white py-2.5 rounded-xl font-medium text-sm hover:bg-[#263333] transition-all shadow-md"
                >
                  Ingresar al Panel
                </button>
              </form>
            </div>
          </div>
        )}

        {isDoctorMode ? (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-[#E7D8B5]/40 border border-[#E7D8B5] rounded-2xl p-5 text-center">
              <h2 className="text-xl font-bold text-[#315D5A] flex items-center justify-center gap-2">
                <Settings className="w-5 h-5" /> Panel de Administración Médica
              </h2>
              <p className="text-xs text-[#263333]/80 mt-1">Modifica tus datos profesionales, foto, honorarios y gestiona los turnos agendados.</p>
            </div>

            <form onSubmit={handleSaveProfile} className="bg-white rounded-2xl p-6 border border-[#E7D8B5] shadow-sm space-y-5">
              <h3 className="font-bold text-base text-[#315D5A] border-b border-[#E7D8B5] pb-2 flex items-center gap-2">
                <User className="w-4 h-4" /> Configuración del Perfil
              </h3>

              <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-[#F7F3EA] rounded-xl border border-[#E7D8B5]/60">
                <img 
                  src={editProfile.photoUrl} 
                  alt="Vista previa" 
                  className="w-20 h-20 rounded-full object-cover border-2 border-[#315D5A]" 
                />
                <div className="space-y-2 flex-grow w-full">
                  <label className="block text-xs font-semibold text-[#315D5A]">Foto de Perfil</label>
                  <div className="flex gap-2">
                    <label className="cursor-pointer bg-[#315D5A] hover:bg-[#263333] text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors">
                      <Upload className="w-3.5 h-3.5" /> Subir foto
                      <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                    </label>
                  </div>
                  <input 
                    type="text" 
                    value={editProfile.photoUrl}
                    onChange={(e) => setEditProfile({ ...editProfile, photoUrl: e.target.value })}
                    placeholder="O pega una URL de imagen..."
                    className="w-full text-xs px-2 py-1.5 border border-[#E7D8B5] rounded-lg bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#315D5A] mb-1">Nombre Completo</label>
                  <input 
                    type="text" 
                    value={editProfile.name}
                    onChange={(e) => setEditProfile({ ...editProfile, name: e.target.value })}
                    className="w-full text-sm px-3 py-2 border border-[#E7D8B5] rounded-xl bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#315D5A] mb-1">Especialidad / Subtítulo</label>
                  <input 
                    type="text" 
                    value={editProfile.title}
                    onChange={(e) => setEditProfile({ ...editProfile, title: e.target.value })}
                    className="w-full text-sm px-3 py-2 border border-[#E7D8B5] rounded-xl bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#315D5A] mb-1">Biografía / Presentación Profesional</label>
                <textarea 
                  rows={3}
                  value={editProfile.bio}
                  onChange={(e) => setEditProfile({ ...editProfile, bio: e.target.value })}
                  className="w-full text-sm px-3 py-2 border border-[#E7D8B5] rounded-xl bg-white resize-none"
                  placeholder="Escribe tu resumen profesional aquí..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#315D5A] mb-1">Honorarios Particulares ($ ARS)</label>
                  <input 
                    type="number" 
                    value={editProfile.fee}
                    onChange={(e) => setEditProfile({ ...editProfile, fee: Number(e.target.value) })}
                    className="w-full text-sm px-3 py-2 border border-[#E7D8B5] rounded-xl bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#315D5A] mb-1">Email para Notificaciones</label>
                  <input 
                    type="email" 
                    value={editProfile.email}
                    onChange={(e) => setEditProfile({ ...editProfile, email: e.target.value })}
                    className="w-full text-sm px-3 py-2 border border-[#E7D8B5] rounded-xl bg-white"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button 
                  type="submit"
                  className="bg-[#315D5A] hover:bg-[#263333] text-white font-medium px-5 py-2.5 rounded-xl text-sm flex items-center gap-2 shadow-md transition-all"
                >
                  <Save className="w-4 h-4" /> Guardar Cambios
                </button>
              </div>
            </form>

            <div className="bg-white rounded-2xl p-6 border border-[#E7D8B5] shadow-sm">
              <h3 className="font-bold text-base text-[#315D5A] border-b border-[#E7D8B5] pb-3 mb-4 flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Turnos Registrados ({bookedTurns.length})
              </h3>
              
              {bookedTurns.length === 0 ? (
                <p className="text-xs text-[#263333]/60 italic text-center py-6">Aún no hay turnos agendados por los pacientes.</p>
              ) : (
                <div className="space-y-3">
                  {bookedTurns.map((turn) => (
                    <div key={turn.id} className="p-4 rounded-xl border border-[#E7D8B5] bg-[#F7F3EA]/50 space-y-1 text-xs">
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-sm text-[#315D5A]">{turn.patient.fullName}</span>
                        <span className="bg-[#A9B9A6]/30 text-[#315D5A] font-semibold px-2 py-0.5 rounded-md">
                          {turn.date} - {turn.time} hs
                        </span>
                      </div>
                      <p><strong>DNI:</strong> {turn.patient.dni}</p>
                      <p><strong>Contacto:</strong> {turn.patient.email} | {turn.patient.phone}</p>
                      <p><strong>Motivo:</strong> {turn.patient.reason || 'Consulta médica general'}</p>
                      <p className="text-right text-[#C9826B] font-bold text-sm pt-1">${turn.fee.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-6">

            <div className="bg-white rounded-3xl p-6 border border-[#E7D8B5] shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                <img 
                  src={profile.photoUrl} 
                  alt={profile.name} 
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-[#A9B9A6] shadow-md shrink-0"
                />
                <div className="text-center sm:text-left space-y-1.5">
                  <span className="bg-[#C9826B]/15 text-[#C9826B] font-bold text-[11px] uppercase tracking-wider px-2.5 py-0.5 rounded-full inline-block">
                    Modalidad {profile.modality}
                  </span>
                  <h2 className="text-2xl font-bold text-[#315D5A]">{profile.name}</h2>
                  <p className="text-xs font-semibold text-[#263333]/80">{profile.title}</p>
                  
                  <div className="pt-1 flex flex-wrap justify-center sm:justify-start gap-2 text-xs">
                    <span className="bg-[#E7D8B5]/50 text-[#315D5A] font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#315D5A]" /> Turnos de {profile.duration}
                    </span>
                    <span className="bg-[#A9B9A6]/20 text-[#315D5A] font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5 text-[#315D5A]" /> ${profile.fee.toLocaleString()} ARS
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t border-[#E7D8B5]/70 pt-3">
                <h3 className="text-xs font-bold text-[#315D5A] uppercase tracking-wider mb-1">Sobre la profesional</h3>
                <p className="text-xs text-[#263333]/90 leading-relaxed bg-[#F7F3EA]/70 p-3 rounded-xl border border-[#E7D8B5]/40">
                  {profile.bio}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-[#E7D8B5] shadow-sm">
              <div className="flex items-center justify-between mb-6 border-b border-[#E7D8B5] pb-3">
                <h3 className="text-lg font-bold text-[#315D5A] flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#315D5A]" /> Reserva tu Turno
                </h3>
                <span className="text-xs text-[#263333]/60 font-medium">Paso {step} de 2</span>
              </div>

              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-[#315D5A] mb-2 uppercase tracking-wide">
                      1. Selecciona la Fecha (Disponible: Lunes y Jueves)
                    </label>
                    <input 
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      value={selectedDate}
                      onChange={(e) => {
                        setSelectedDate(e.target.value);
                        setSelectedTime('');
                      }}
                      className="w-full text-sm p-3 border border-[#E7D8B5] rounded-xl bg-[#F7F3EA]/40 text-[#263333] focus:outline-none focus:ring-2 focus:ring-[#315D5A]"
                    />
                    {selectedDate && !isDayAvailable(selectedDate) && (
                      <p className="text-xs text-[#C9826B] font-medium mt-2 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> La Dra. atiende únicamente Lunes y Jueves. Por favor selecciona otra fecha.
                      </p>
                    )}
                  </div>

                  {selectedDate && isDayAvailable(selectedDate) && (
                    <div className="space-y-2 animate-fadeIn">
                      <label className="block text-xs font-bold text-[#315D5A] uppercase tracking-wide">
                        2. Selecciona la Hora (09:00 a 11:30 hs)
                      </label>
                      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                        {profile.timeSlots.map((slot) => {
                          const taken = isSlotTaken(selectedDate, slot);
                          return (
                            <button
                              key={slot}
                              disabled={taken}
                              onClick={() => setSelectedTime(slot)}
                              className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all ${
                                taken 
                                  ? 'bg-gray-100 text-gray-400 border-gray-200 line-through cursor-not-allowed'
                                  : selectedTime === slot
                                  ? 'bg-[#315D5A] text-white border-[#315D5A] shadow-md scale-105'
                                  : 'bg-[#F7F3EA]/60 text-[#263333] border-[#E7D8B5] hover:border-[#315D5A] hover:bg-white'
                              }`}
                            >
                              {slot} hs
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="pt-4 flex justify-end">
                    <button
                      disabled={!selectedDate || !selectedTime || !isDayAvailable(selectedDate)}
                      onClick={() => setStep(2)}
                      className="bg-[#315D5A] text-white px-6 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-[#263333] transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md"
                    >
                      Continuar a tus Datos <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <form onSubmit={handleBookingSubmit} className="space-y-4 animate-fadeIn">
                  <div className="bg-[#E7D8B5]/30 p-3.5 rounded-xl border border-[#E7D8B5] flex justify-between items-center text-xs text-[#315D5A]">
                    <div>
                      <span className="font-bold">Turno seleccionado:</span> {selectedDate} a las {selectedTime} hs
                    </div>
                    <button 
                      type="button" 
                      onClick={() => setStep(1)} 
                      className="underline font-semibold text-[#263333] hover:text-[#315D5A]"
                    >
                      Cambiar
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#315D5A] mb-1">Nombre Completo *</label>
                      <input 
                        type="text"
                        required
                        value={patientInfo.fullName}
                        onChange={(e) => setPatientInfo({ ...patientInfo, fullName: e.target.value })}
                        placeholder="Ej: María García"
                        className="w-full text-sm px-3 py-2 border border-[#E7D8B5] rounded-xl bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#315D5A] mb-1">DNI / Documento *</label>
                      <input 
                        type="text"
                        required
                        value={patientInfo.dni}
                        onChange={(e) => setPatientInfo({ ...patientInfo, dni: e.target.value })}
                        placeholder="Ej: 35.123.456"
                        className="w-full text-sm px-3 py-2 border border-[#E7D8B5] rounded-xl bg-white"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-[#315D5A] mb-1">Correo Electrónico *</label>
                        <input 
                          type="email"
                          required
                          value={patientInfo.email}
                          onChange={(e) => setPatientInfo({ ...patientInfo, email: e.target.value })}
                          placeholder="maria@gmail.com"
                          className="w-full text-sm px-3 py-2 border border-[#E7D8B5] rounded-xl bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#315D5A] mb-1">Teléfono / WhatsApp *</label>
                        <input 
                          type="tel"
                          required
                          value={patientInfo.phone}
                          onChange={(e) => setPatientInfo({ ...patientInfo, phone: e.target.value })}
                          placeholder="11 5555-4444"
                          className="w-full text-sm px-3 py-2 border border-[#E7D8B5] rounded-xl bg-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#315D5A] mb-1">Motivo principal de consulta</label>
                      <textarea 
                        rows={2}
                        value={patientInfo.reason}
                        onChange={(e) => setPatientInfo({ ...patientInfo, reason: e.target.value })}
                        placeholder="Breve descripción de síntomas o control habitual..."
                        className="w-full text-sm px-3 py-2 border border-[#E7D8B5] rounded-xl bg-white resize-none"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-3">
                    <button 
                      type="button" 
                      onClick={() => setStep(1)} 
                      className="text-xs font-semibold text-[#263333] flex items-center gap-1 hover:underline"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> Volver
                    </button>

                    <button 
                      type="submit" 
                      className="bg-[#315D5A] text-white px-6 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-[#263333] transition-all shadow-md"
                    >
                      Confirmar Reserva (${profile.fee.toLocaleString()})
                    </button>
                  </div>
                </form>
              )}

              {step === 3 && isBookingSuccess && (
                <div className="text-center py-8 space-y-4 animate-fadeIn">
                  <div className="w-16 h-16 bg-[#A9B9A6]/30 text-[#315D5A] rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>

                  <h3 className="text-2xl font-bold text-[#315D5A]">¡Turno Solicitado con Éxito!</h3>
                  <p className="text-xs text-[#263333]/80 max-w-md mx-auto leading-relaxed">
                    Hemos registrado tu solicitud para el <strong>{selectedDate}</strong> a las <strong>{selectedTime} hs</strong>. Se ha abierto una notificación por mail para la médica.
                  </p>

                  <div className="bg-[#F7F3EA] border border-[#E7D8B5] p-4 rounded-2xl max-w-sm mx-auto text-xs text-left space-y-2">
                    <p className="font-bold text-[#315D5A] border-b border-[#E7D8B5] pb-1">Pasos siguientes:</p>
                    <p>1. Recibirás en tu mail ({patientInfo.email}) la confirmación de la cita.</p>
                    <p>2. Se te enviarán los datos para abonar el honorario ($50.000 ARS) y el link de la videollamada.</p>
                  </div>

                  <button 
                    onClick={() => {
                      setStep(1);
                      setSelectedDate('');
                      setSelectedTime('');
                      setIsBookingSuccess(false);
                    }}
                    className="mt-4 bg-[#315D5A] text-white px-6 py-2 rounded-xl text-xs font-semibold hover:bg-[#263333] transition-all"
                  >
                    Volver al Inicio
                  </button>
                </div>
              )}
            </div>

          </div>
        )}
      </main>

      <footer className="bg-[#263333] text-[#F7F3EA] py-4 px-6 text-center text-xs mt-8">
        <p className="opacity-80">© Dra. Carla Cabuccio - Reserva de Turnos Particulares</p>
        <p className="text-[10px] text-[#A9B9A6] mt-1">Modalidad Virtual | Lunes y Jueves 09:00 - 11:30 hs</p>
      </footer>
    </div>
  );
}
