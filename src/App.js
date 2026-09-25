import React, { useState } from 'react';
import './App.css';

function App() {
  // State Autentikasi & Registrasi
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' atau 'register'
  
  // State Form
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');

  // State User yang sedang Aktif Login
  const [currentUser, setCurrentUser] = useState({
    name: 'Pak Irfan, M.T.',
    role: 'Dosen Pembimbing'
  });

  // State Utama Aplikasi
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  // State Bimbingan
  const [bimbingan, setBimbingan] = useState([
    { id: 1, nama: 'Krisopras Shine T.', tugas: 'Bab 3 - Metodologi IoT', status: 'Menunggu' },
    { id: 2, nama: 'Ahmad Fauzi', tugas: 'Bab 2 - Tinjauan Pustaka', status: 'Menunggu' },
    { id: 3, nama: 'Siti Sarah', tugas: 'Bab 4 - Pengujian Sistem', status: 'Selesai' },
  ]);

  const [inputNama, setInputNama] = useState('');
  const [inputTugas, setInputTugas] = useState('');

  // State Jadwal
  const [jadwalList, setJadwalList] = useState([
    { id: 1, jam: '10:00 - 12:00 WIB', kegiatan: 'Mengajar Sistem Terdistribusi (Lab 2)' },
    { id: 2, jam: '13:30 - 15:00 WIB', kegiatan: 'Rapat Kurikulum Jurusan (Ruang Rektorat)' }
  ]);

  const [inputJam, setInputJam] = useState('');
  const [inputKegiatan, setInputKegiatan] = useState('');
  const [editingJadwalId, setEditingJadwalId] = useState(null);

  // State Cuti
  const [cutiList, setCutiList] = useState([
    { id: 1, tanggal: '10 - 12 Oktober 2026', alasan: 'Cuti Tahunan / Konferensi Akademik', status: 'Disetujui' },
    { id: 2, tanggal: '20 November 2026', alasan: 'Urusan Keluarga', status: 'Menunggu' }
  ]);

  const [inputTanggalCuti, setInputTanggalCuti] = useState('');
  const [inputAlasanCuti, setInputAlasanCuti] = useState('');

  // State AI Assistant
  const [chatInput, setChatInput] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    { sender: 'ai', text: 'Halo! Saya CampusFlow AI. Ada yang bisa saya bantu terkait skripsi, jadwal, atau draf surat hari ini?' }
  ]);

  // Handler Switch Mode Auth (Login <-> Register)
  const switchAuthMode = (mode) => {
    setAuthMode(mode);
    setAuthError('');
    setAuthSuccess('');
  };

  // Handler Submit Login
  const handleLogin = (e) => {
    e.preventDefault();
    if (username.trim() !== '' && password.trim() !== '') {
      setCurrentUser({
        name: username,
        role: 'Dosen Pembimbing'
      });
      setIsLoggedIn(true);
      setAuthError('');
    } else {
      setAuthError('Harap isi username dan password!');
    }
  };

  // Handler Submit Register (Buat Akun Baru)
  const handleRegister = (e) => {
    e.preventDefault();
    if (!fullName.trim() || !username.trim() || !password.trim()) {
      setAuthError('Semua kolom pendaftaran wajib diisi!');
      return;
    }

    // Set User Aktif dari hasil registrasi
    setCurrentUser({
      name: fullName,
      role: 'Dosen / Pengajar'
    });

    setAuthError('');
    setIsLoggedIn(true); // Langsung masuk ke sistem setelah registrasi berhasil
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
    setFullName('');
  };

  // Logika Filter
  const filteredBimbingan = bimbingan.filter((item) =>
    item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.tugas.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredJadwal = jadwalList.filter((item) =>
    item.kegiatan.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.jam.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCuti = cutiList.filter((item) =>
    item.alasan.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.tanggal.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).slice(0, 2).join('');
  };

  // Fungsi Logika Respon AI Cerdas
  const generateAiResponse = (userText) => {
    const text = userText.toLowerCase();

    if (text.includes('ringkas') || text.includes('bab 3') || text.includes('krisopras')) {
      return "📊 **Ringkasan Bab 3 Krisopras (IoT):**\n1. Metode pengumpulan data sensor sudah jelas.\n2. **Saran:** Tambahkan alur diagram jaringan MQTT.\n3. **Rekomendasi:** Lanjut ke Bab 4 dengan catatan revisi kecil.";
    } else if (text.includes('jadwal') || text.includes('mengajar')) {
      return `📅 **Jadwal Anda Hari Ini:**\n- ${jadwalList.map(j => `${j.jam}:${j.kegiatan}`).join('\n- ')}`;
    } else if (text.includes('email') || text.includes('teguran') || text.includes('ingatkan')) {
      return "✉️ **Draft Email Pengingat Mahasiswa:**\n\n'Yth. Mahasiswa Bimbingan,\nMengingatkan kembali batas pengumpulan revisi skripsi Bab 3 adalah hari Jumat ini. Harap segera mengunggah draf terbaru.'";
    } else if (text.includes('sidang') || text.includes('pertanyaan')) {
      return "🎓 **Saran Pertanyaan Sidang Skripsi (Topik Sistem/IoT):**\n1. Apa keunggulan arsitektur yang Anda pilih dibanding metode konvensional?\n2. Bagaimana penanganan jika koneksi antarsensor terputus (*failover*)?";
    } else {
      return `🤖 Saya telah menganalisis permintaan Anda: "${userText}".\nSistem merekomendasikan untuk memperbarui data pada tab menu terkait atau menghubungi bagian akademik jika memerlukan validasi data resmi.`;
    }
  };

  const processChat = (textToSend) => {
    if (!textToSend.trim()) return;

    const newHistory = [...chatHistory, { sender: 'user', text: textToSend }];
    setChatHistory(newHistory);
    setChatInput('');
    setIsAiTyping(true);

    setTimeout(() => {
      const response = generateAiResponse(textToSend);
      setChatHistory(prev => [...prev, { sender: 'ai', text: response }]);
      setIsAiTyping(false);
    }, 800);
  };

  const handleSendChat = (e) => {
    e.preventDefault();
    processChat(chatInput);
  };

  const handleQuickPrompt = (promptText) => {
    processChat(promptText);
  };

  const handleReviewAI = (nama) => {
    processChat(`Tolong ringkas bimbingan milik ${nama}`);
    if (activeTab !== 'dashboard') setActiveTab('dashboard');
  };

  // Handlers Bimbingan, Jadwal & Cuti
  const handleTambahBimbingan = (e) => {
    e.preventDefault();
    if (!inputNama || !inputTugas) return;
    setBimbingan([...bimbingan, { id: Date.now(), nama: inputNama, tugas: inputTugas, status: 'Menunggu' }]);
    setInputNama('');
    setInputTugas('');
  };

  const handleSaveJadwal = (e) => {
    e.preventDefault();
    if (!inputJam || !inputKegiatan) return;

    if (editingJadwalId) {
      setJadwalList(jadwalList.map(item => 
        item.id === editingJadwalId ? { ...item, jam: inputJam, kegiatan: inputKegiatan } : item
      ));
      setEditingJadwalId(null);
    } else {
      setJadwalList([...jadwalList, { id: Date.now(), jam: inputJam, kegiatan: inputKegiatan }]);
    }
    setInputJam('');
    setInputKegiatan('');
  };

  const handleEditJadwal = (item) => {
    setEditingJadwalId(item.id);
    setInputJam(item.jam);
    setInputKegiatan(item.kegiatan);
  };

  const handleHapusJadwal = (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus jadwal ini?")) {
      setJadwalList(jadwalList.filter(item => item.id !== id));
      if (editingJadwalId === id) {
        setEditingJadwalId(null);
        setInputJam('');
        setInputKegiatan('');
      }
    }
  };

  const handleTambahCuti = (e) => {
    e.preventDefault();
    if (!inputTanggalCuti || !inputAlasanCuti) return;
    setCutiList([
      ...cutiList,
      { id: Date.now(), tanggal: inputTanggalCuti, alasan: inputAlasanCuti, status: 'Menunggu' }
    ]);
    setInputTanggalCuti('');
    setInputAlasanCuti('');
  };

  const handleHapusCuti = (id) => {
    if (window.confirm("Batalkan pengajuan cuti ini?")) {
      setCutiList(cutiList.filter(item => item.id !== id));
    }
  };

  // TAMPILAN JIKA BELUM LOGIN / BELUM BUAT AKUN
  if (!isLoggedIn) {
    return (
      <div className="login-container">
        <div className="login-card">
          <div className="brand" style={{ justifyContent: 'center', marginBottom: '16px' }}>
            <div className="brand-icon">CF</div>
            <div>
              <h2>CampusFlow AI</h2>
              <small>Academic Assistant</small>
            </div>
          </div>

          {/* TAB SWITCHER LOGIN / REGISTER */}
          <div className="auth-tabs" style={{ display: 'flex', borderBottom: '2px solid #e2e8f0', marginBottom: '20px' }}>
            <button 
              onClick={() => switchAuthMode('login')} 
              style={{
                flex: 1,
                padding: '10px',
                border: 'none',
                background: 'transparent',
                fontWeight: authMode === 'login' ? 'bold' : 'normal',
                color: authMode === 'login' ? '#4f46e5' : '#64748b',
                borderBottom: authMode === 'login' ? '2px solid #4f46e5' : 'none',
                cursor: 'pointer'
              }}
            >
              🔐 Masuk
            </button>
            <button 
              onClick={() => switchAuthMode('register')} 
              style={{
                flex: 1,
                padding: '10px',
                border: 'none',
                background: 'transparent',
                fontWeight: authMode === 'register' ? 'bold' : 'normal',
                color: authMode === 'register' ? '#4f46e5' : '#64748b',
                borderBottom: authMode === 'register' ? '2px solid #4f46e5' : 'none',
                cursor: 'pointer'
              }}
            >
              📝 Buat Akun
            </button>
          </div>

          {authError && (
            <div style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: '12px', textAlign: 'center', background: '#fee2e2', padding: '8px', borderRadius: '6px' }}>
              {authError}
            </div>
          )}

          {/* FORM MASUK (LOGIN) */}
          {authMode === 'login' ? (
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#475569', display: 'block', marginBottom: '4px' }}>
                  Username / NIP
                </label>
                <input
                  type="text"
                  placeholder="Masukkan username atau NIP..."
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#475569', display: 'block', marginBottom: '4px' }}>
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Masukkan password..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
                />
              </div>

              <button type="submit" className="btn-ai" style={{ width: '100%', padding: '12px', marginTop: '8px', fontSize: '0.95rem' }}>
                🔐 Masuk Sistem
              </button>
            </form>
          ) : (
            /* FORM BUAT AKUN (REGISTER) */
            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#475569', display: 'block', marginBottom: '4px' }}>
                  Nama Lengkap & Gelar
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Dr. Budi Santoso, M.T."
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#475569', display: 'block', marginBottom: '4px' }}>
                  Username / NIP
                </label>
                <input
                  type="text"
                  placeholder="Buat username atau NIP..."
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#475569', display: 'block', marginBottom: '4px' }}>
                  Password Baru
                </label>
                <input
                  type="password"
                  placeholder="Buat password aman..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
                />
              </div>

              <button type="submit" className="btn-ai" style={{ width: '100%', padding: '12px', marginTop: '8px', fontSize: '0.95rem' }}>
                🚀 Daftar Sekarang & Masuk
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  // TAMPILAN UTAMA APLIKASI (JIKA SUDAH LOGIN / SELESAI BUAT AKUN)
  return (
    <div className="app-container">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div>
          <div className="brand">
            <div className="brand-icon">CF</div>
            <div>
              <h2>CampusFlow AI</h2>
              <small>Academic Assistant</small>
            </div>
          </div>

          <nav className="nav-menu">
            <button className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
              📊 Dashboard
            </button>
            <button className={`nav-item ${activeTab === 'bimbingan' ? 'active' : ''}`} onClick={() => setActiveTab('bimbingan')}>
              📖 Bimbingan Skripsi
            </button>
            <button className={`nav-item ${activeTab === 'jadwal' ? 'active' : ''}`} onClick={() => setActiveTab('jadwal')}>
              📅 Jadwal Mengajar
            </button>
            <button className={`nav-item ${activeTab === 'cuti' ? 'active' : ''}`} onClick={() => setActiveTab('cuti')}>
              🏖️ Jadwal Cuti
            </button>
            <button className={`nav-item ${activeTab === 'ai' ? 'active' : ''}`} onClick={() => setActiveTab('ai')}>
              🤖 AI Console
            </button>
          </nav>
        </div>

        <div className="user-profile" style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ fontSize: '1.2rem' }}>👨‍🏫</div>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>{currentUser.name}</div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{currentUser.role}</div>
            </div>
          </div>
          <button 
            onClick={handleLogout} 
            title="Keluar / Logout" 
            style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '1rem' }}
          >
            🚪
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        <header className="top-bar">
          <div className="search-box">
            🔍 
            <input 
              type="text" 
              placeholder="Cari bimbingan, jadwal, cuti..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')} 
                style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#94a3b8' }}
              >
                ✖
              </button>
            )}
          </div>
          <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
            📅 Senin, 25 September 2026
          </div>
        </header>

        {activeTab === 'dashboard' && (
          <>
            <section className="hero">
              <h1>Selamat Pagi, {currentUser.name}! 👋</h1>
              <p>Ada <strong>{bimbingan.filter(b => b.status === 'Menunggu').length} revisi skripsi</strong> yang menunggu untuk ditinjau hari ini.</p>
            </section>

            <section className="stats-grid">
              <div className="stat-card" onClick={() => setActiveTab('bimbingan')}>
                <span style={{ fontSize: '0.75rem', color: '#ea580c', fontWeight: 'bold' }}>PERLU REVIEW</span>
                <h3>{bimbingan.filter(b => b.status === 'Menunggu').length}</h3>
                <p>Prioritas bimbingan minggu ini</p>
              </div>
              <div className="stat-card" onClick={() => setActiveTab('jadwal')}>
                <span style={{ fontSize: '0.75rem', color: '#2563eb', fontWeight: 'bold' }}>JADWAL MENGAJAR</span>
                <h3>{jadwalList.length} Kegiatan</h3>
                <p>{jadwalList[0]?.kegiatan || 'Tidak ada agenda'}</p>
              </div>
              <div className="stat-card" onClick={() => setActiveTab('cuti')}>
                <span style={{ fontSize: '0.75rem', color: '#0284c7', fontWeight: 'bold' }}>PENGAJUAN CUTI</span>
                <h3>{cutiList.length} Agenda</h3>
                <p>Kelola jadwal libur/cuti</p>
              </div>
              <div className="stat-card">
                <span style={{ fontSize: '0.75rem', color: '#7c3aed', fontWeight: 'bold' }}>DEADLINE BKD</span>
                <h3>6 Hari</h3>
                <p>Laporan Kinerja Dosen</p>
              </div>
            </section>

            <section className="content-grid">
              <div className="card">
                <div className="card-header">
                  <h3>📖 Daftar Bimbingan Skripsi</h3>
                  <button className="btn-ai" onClick={() => setActiveTab('bimbingan')}>Kelola Semua →</button>
                </div>
                <table>
                  <thead>
                    <tr>
                      <th>Mahasiswa</th>
                      <th>Progres / Topik</th>
                      <th>Aksi AI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBimbingan.length > 0 ? (
                      filteredBimbingan.map((item) => (
                        <tr key={item.id}>
                          <td>
                            <div className="user-cell">
                              <div className="avatar-circle">{getInitials(item.nama)}</div>
                              <strong>{item.nama}</strong>
                            </div>
                          </td>
                          <td>{item.tugas}</td>
                          <td>
                            <button className="btn-ai" onClick={() => handleReviewAI(item.nama)}>
                              ✨ Ringkas AI
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" style={{ textAlign: 'center', color: '#94a3b8', padding: '16px' }}>
                          Tidak ada mahasiswa ditemukan
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* AI ASSISTANT PANEL */}
              <div className="card">
                <h3>🤖 AI Assistant</h3>
                <div className="chat-box">
                  {chatHistory.map((msg, i) => (
                    <div key={i} className={`bubble ${msg.sender}`} style={{ whitespace: 'pre-line' }}>
                      {msg.text}
                    </div>
                  ))}
                  {isAiTyping && <div className="bubble ai" style={{ color: '#94a3b8' }}>*AI sedang mengetik...*</div>}
                </div>

                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '10px' }}>
                  <button className="btn-action edit" onClick={() => handleQuickPrompt('Tolong ringkas bab 3 Krisopras')}>
                    📝 Ringkas Bab 3
                  </button>
                  <button className="btn-action edit" onClick={() => handleQuickPrompt('Buatkan draft email pengingat revisi')}>
                    ✉️ Draft Email
                  </button>
                  <button className="btn-action edit" onClick={() => handleQuickPrompt('Saran pertanyaan sidang skripsi')}>
                    🎓 Soal Sidang
                  </button>
                </div>

                <form onSubmit={handleSendChat} className="chat-input">
                  <input 
                    type="text" 
                    placeholder="Tanyakan sesuatu ke AI..." 
                    value={chatInput} 
                    onChange={(e) => setChatInput(e.target.value)} 
                  />
                  <button type="submit" className="btn-ai">Kirim</button>
                </form>
              </div>
            </section>
          </>
        )}

        {activeTab === 'bimbingan' && (
          <div className="card">
            <h3>📖 Kelola Bimbingan Mahasiswa</h3>
            <form onSubmit={handleTambahBimbingan} className="chat-input" style={{ margin: '16px 0' }}>
              <input 
                type="text" 
                placeholder="Nama Mahasiswa..." 
                value={inputNama} 
                onChange={(e) => setInputNama(e.target.value)} 
              />
              <input 
                type="text" 
                placeholder="Judul / Bab Bimbingan..." 
                value={inputTugas} 
                onChange={(e) => setInputTugas(e.target.value)} 
              />
              <button type="submit" className="btn-ai">+ Tambah</button>
            </form>

            <table>
              <thead>
                <tr>
                  <th>Mahasiswa</th>
                  <th>Bab / Catatan</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredBimbingan.length > 0 ? (
                  filteredBimbingan.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="user-cell">
                          <div className="avatar-circle">{getInitials(item.nama)}</div>
                          <strong>{item.nama}</strong>
                        </div>
                      </td>
                      <td>{item.tugas}</td>
                      <td>
                        <span className={`badge ${item.status === 'Selesai' ? 'badge-success' : 'badge-warning'}`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" style={{ textAlign: 'center', color: '#94a3b8', padding: '16px' }}>
                      Data tidak ditemukan
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'jadwal' && (
          <div className="card">
            <h3>📅 Kelola Jadwal Mengajar & Rapat Hari Ini</h3>
            <form onSubmit={handleSaveJadwal} className="chat-input" style={{ margin: '16px 0', gap: '8px' }}>
              <input 
                type="text" 
                placeholder="Waktu (misal: 10:00 - 12:00 WIB)" 
                value={inputJam} 
                onChange={(e) => setInputJam(e.target.value)} 
                style={{ flex: '1' }}
              />
              <input 
                type="text" 
                placeholder="Kegiatan / Nama Mata Kuliah / Lokasi" 
                value={inputKegiatan} 
                onChange={(e) => setInputKegiatan(e.target.value)} 
                style={{ flex: '2' }}
              />
              <button type="submit" className="btn-ai">
                {editingJadwalId ? '💾 Simpan Edit' : '+ Tambah Jadwal'}
              </button>
              {editingJadwalId && (
                <button type="button" className="btn-cancel" onClick={() => setEditingJadwalId(null)}>
                  Batal
                </button>
              )}
            </form>

            <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {filteredJadwal.length === 0 ? (
                <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Agenda tidak ditemukan.</p>
              ) : (
                filteredJadwal.map((item) => (
                  <div key={item.id} className="schedule-card">
                    <div>
                      <strong style={{ color: '#4f46e5', fontSize: '0.95rem' }}>{item.jam}</strong>
                      <div style={{ fontSize: '0.9rem', color: '#1e293b', marginTop: '2px' }}>{item.kegiatan}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button className="btn-action edit" onClick={() => handleEditJadwal(item)}>
                        ✏️ Edit
                      </button>
                      <button className="btn-action delete" onClick={() => handleHapusJadwal(item.id)}>
                        🗑️ Hapus
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'cuti' && (
          <div className="card">
            <h3>🏖️ Pengajuan & Jadwal Cuti Dosen</h3>
            <form onSubmit={handleTambahCuti} className="chat-input" style={{ margin: '16px 0', gap: '8px' }}>
              <input 
                type="text" 
                placeholder="Tanggal Cuti (misal: 15 - 17 Oktober 2026)" 
                value={inputTanggalCuti} 
                onChange={(e) => setInputTanggalCuti(e.target.value)} 
                style={{ flex: '1' }}
              />
              <input 
                type="text" 
                placeholder="Alasan / Keperluan Cuti" 
                value={inputAlasanCuti} 
                onChange={(e) => setInputAlasanCuti(e.target.value)} 
                style={{ flex: '2' }}
              />
              <button type="submit" className="btn-ai">+ Ajukan Cuti</button>
            </form>

            <table>
              <thead>
                <tr>
                  <th>Tanggal Cuti</th>
                  <th>Keterangan / Alasan</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredCuti.length > 0 ? (
                  filteredCuti.map((item) => (
                    <tr key={item.id}>
                      <td><strong>{item.tanggal}</strong></td>
                      <td>{item.alasan}</td>
                      <td>
                        <span className={`badge ${item.status === 'Disetujui' ? 'badge-success' : 'badge-warning'}`}>
                          {item.status}
                        </span>
                      </td>
                      <td>
                        <button className="btn-action delete" onClick={() => handleHapusCuti(item.id)}>
                          🗑️ Batalkan
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', color: '#94a3b8', padding: '16px' }}>
                      Belum ada data/pengajuan cuti.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="card">
            <h3>🤖 AI Assistant Full Console</h3>
            <div className="chat-box" style={{ height: '260px', marginTop: '12px' }}>
              {chatHistory.map((msg, i) => (
                <div key={i} className={`bubble ${msg.sender}`} style={{ whitespace: 'pre-line' }}>
                  {msg.text}
                </div>
              ))}
              {isAiTyping && <div className="bubble ai" style={{ color: '#94a3b8' }}>*AI sedang mengetik...*</div>}
            </div>

            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '10px' }}>
              <button className="btn-action edit" onClick={() => handleQuickPrompt('Tolong ringkas bab 3 Krisopras')}>
                📝 Ringkas Bab 3
              </button>
              <button className="btn-action edit" onClick={() => handleQuickPrompt('Buatkan draft email pengingat revisi')}>
                ✉️ Draft Email
              </button>
              <button className="btn-action edit" onClick={() => handleQuickPrompt('Saran pertanyaan sidang skripsi')}>
                🎓 Soal Sidang
              </button>
            </div>

            <form onSubmit={handleSendChat} className="chat-input">
              <input 
                type="text" 
                placeholder="Minta AI buat draft koreksi..." 
                value={chatInput} 
                onChange={(e) => setChatInput(e.target.value)} 
              />
              <button type="submit" className="btn-ai">Kirim Ke AI</button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;