import { auth } from "@/auth"
import { redirect } from "next/navigation"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Panduan — SIMDOM" }

const panduanAdmin = [
  {
    judul: "1. Dashboard Utama",
    ikon: "🏠",
    konten: [
      {
        subjudul: "Apa yang ditampilkan?",
        teks: "Dashboard menampilkan ringkasan kondisi seluruh layanan digital Kabupaten Soppeng — jumlah SKPD, total domain, status online/offline, dan temuan aktif."
      },
      {
        subjudul: "Cara membaca KPI:",
        teks: "• Total SKPD — jumlah satuan kerja yang terdaftar\n• Total Domain — jumlah website/aplikasi yang dikelola\n• Domain Aktif — domain yang masih beroperasi\n• Laporan Pending — laporan aktivitas yang belum dikonfirmasi\n• Online/Offline — hasil pengecekan otomatis dari worker\n• Temuan Aktif — masalah yang belum diselesaikan"
      }
    ]
  },
  {
    judul: "2. Domain & Subdomain",
    ikon: "🌐",
    konten: [
      {
        subjudul: "Fungsi halaman ini:",
        teks: "Mengelola inventaris seluruh domain dan subdomain milik Pemkab Soppeng. Admin bisa menambah, mengedit, menghapus, dan mengimport domain dari file Excel."
      },
      {
        subjudul: "Cara tambah domain:",
        teks: "Klik tombol '+ Tambah Domain' → isi form (nama, URL, SKPD, status, admin teknis) → klik Simpan."
      },
      {
        subjudul: "Cara import Excel:",
        teks: "Klik 'Import Excel' → download template → isi data di Excel sesuai format → upload file → cek preview → klik Import."
      },
      {
        subjudul: "Status domain:",
        teks: "• AKTIF — domain masih digunakan\n• TIDAK AKTIF — domain tidak lagi digunakan\n• SUSPEND — domain ditangguhkan sementara"
      }
    ]
  },
  {
    judul: "3. Monitoring",
    ikon: "📡",
    konten: [
      {
        subjudul: "Apa itu monitoring?",
        teks: "Sistem pengecekan otomatis yang memeriksa kondisi teknis setiap domain secara berkala — apakah bisa diakses, sertifikat SSL valid, dan keamanan header website."
      },
      {
        subjudul: "Cara menjalankan pengecekan:",
        teks: "Buka folder simdom-worker di laptop → klik dua kali check.bat → tunggu 2-3 menit sampai selesai → tekan Ctrl+C → tutup terminal."
      },
      {
        subjudul: "Arti kolom di tabel:",
        teks: "• Status Online/Offline — apakah website bisa diakses\n• HTTP — kode respon server (200=OK, 404=tidak ditemukan, 500=error server)\n• Response — kecepatan respon dalam milidetik (ms)\n• SSL — status sertifikat keamanan (Valid/Expired/Invalid)\n• Headers — skor keamanan header website (0-100)"
      },
      {
        subjudul: "Filter data:",
        teks: "Gunakan filter SKPD untuk melihat domain per satuan kerja. Gunakan filter Status untuk melihat domain Online saja atau Offline saja. Klik KPI card di atas untuk filter otomatis."
      }
    ]
  },
  {
    judul: "4. Temuan",
    ikon: "⚠️",
    konten: [
      {
        subjudul: "Apa itu temuan?",
        teks: "Temuan adalah masalah teknis yang terdeteksi otomatis saat pengecekan — misalnya website offline, SSL expired, atau security headers tidak lengkap."
      },
      {
        subjudul: "Workflow temuan:",
        teks: "OPEN (baru ditemukan) → PROGRESS (sedang ditangani) → DONE (selesai)"
      },
      {
        subjudul: "Cara update status temuan:",
        teks: "Klik tombol 'Update' di kolom Aksi → pilih status baru → isi catatan tindak lanjut (opsional) → klik Simpan."
      },
      {
        subjudul: "Severity:",
        teks: "• HIGH — masalah serius, perlu ditangani segera (website offline, SSL expired)\n• MEDIUM — masalah sedang, perlu perhatian (security headers tidak lengkap)"
      }
    ]
  },
  {
    judul: "5. Audit Teknis",
    ikon: "🔍",
    konten: [
      {
        subjudul: "Fungsi halaman ini:",
        teks: "Menampilkan hasil audit performa dan keamanan per domain. PageSpeed dicek otomatis oleh worker setiap hari jam 07.00. Admin bisa menambah hasil audit manual dari tools eksternal."
      },
      {
        subjudul: "Cara isi audit manual:",
        teks: "Klik 'Detail' pada domain yang ingin diaudit → scroll ke bagian Audit Manual → isi form (security headers, DNS, teknologi, catatan) → klik Simpan Audit."
      },
      {
        subjudul: "Arti skor PageSpeed:",
        teks: "• 90-100 — Baik (hijau)\n• 50-89 — Perlu perbaikan (kuning)\n• 0-49 — Buruk (merah)\n\nKategori: Performance, Accessibility, Best Practices, SEO"
      },
      {
        subjudul: "Tools audit manual yang disarankan:",
        teks: "• Security Headers: https://securityheaders.com\n• DNS/Email: https://mxtoolbox.com\n• Teknologi: https://www.wappalyzer.com"
      }
    ]
  },
  {
    judul: "6. Laporan Aktivitas",
    ikon: "📋",
    konten: [
      {
        subjudul: "Fungsi halaman ini:",
        teks: "Mencatat kegiatan teknis yang dilakukan admin terhadap domain — misalnya koordinasi dengan vendor, update SSL, atau perbaikan website."
      },
      {
        subjudul: "Cara buat laporan:",
        teks: "Klik '+ Buat Laporan' → pilih domain → isi jenis kegiatan dan deskripsi → pilih tanggal → klik Simpan."
      },
      {
        subjudul: "Status laporan:",
        teks: "• PENDING — laporan baru dibuat, menunggu konfirmasi\n• CONFIRMED — laporan sudah dikonfirmasi atasan\n• INSTRUCTED — laporan sudah diberi instruksi tindak lanjut"
      }
    ]
  },
  {
    judul: "7. Executive Summary",
    ikon: "📊",
    konten: [
      {
        subjudul: "Fungsi halaman ini:",
        teks: "Ringkasan kondisi seluruh layanan digital untuk dilaporkan ke pimpinan. Menampilkan kondisi per SKPD dan temuan yang perlu ditangani."
      },
      {
        subjudul: "Kondisi per SKPD:",
        teks: "Tabel menampilkan berapa domain per SKPD yang online, offline, SSL bermasalah, dan temuan aktif. Kolom 'Kondisi' menampilkan persentase layanan yang online."
      }
    ]
  },
  {
    judul: "8. Notifikasi",
    ikon: "🔔",
    konten: [
      {
        subjudul: "Notifikasi Telegram:",
        teks: "Setiap kali ada temuan baru (domain offline, SSL expired), sistem otomatis mengirim notifikasi ke grup Telegram Diskominfo."
      },
      {
        subjudul: "Notifikasi Email:",
        teks: "Email notifikasi dikirim ke alamat email yang terdaftar saat ada temuan baru."
      }
    ]
  }
]

const panduanPimpinan = [
  {
    judul: "Apa itu SIMDOM?",
    ikon: "💡",
    teks: "SIMDOM (Sistem Informasi Domain) adalah aplikasi untuk memantau kondisi seluruh website dan aplikasi digital milik Pemerintah Kabupaten Soppeng. Aplikasi ini membantu Diskominfo memastikan semua layanan digital berjalan dengan baik dan aman."
  },
  {
    judul: "Berapa banyak layanan digital Soppeng?",
    ikon: "🌐",
    teks: "Kabupaten Soppeng memiliki 111 domain/website yang dikelola oleh 33 SKPD. Setiap website dicek secara otomatis setiap hari untuk memastikan bisa diakses oleh masyarakat."
  },
  {
    judul: "Apa arti Online dan Offline?",
    ikon: "🟢",
    teks: "• Online — website bisa diakses normal oleh masyarakat\n• Offline — website tidak bisa diakses, perlu penanganan segera\n\nDari 111 layanan, sekitar 40 dalam kondisi Online dan 71 dalam kondisi Offline atau bermasalah."
  },
  {
    judul: "Apa itu SSL dan mengapa penting?",
    ikon: "🔒",
    teks: "SSL adalah sertifikat keamanan website (ditandai dengan gembok 🔒 di browser). Jika SSL expired, website tidak aman dan browser akan menampilkan peringatan merah kepada pengunjung. Saat ini terdapat 67 domain dengan SSL bermasalah yang perlu diperbaiki."
  },
  {
    judul: "Apa itu Temuan?",
    ikon: "⚠️",
    teks: "Temuan adalah masalah teknis yang ditemukan secara otomatis oleh sistem. Setiap temuan memiliki tingkat keparahan:\n• HIGH (Tinggi) — perlu ditangani segera\n• MEDIUM (Sedang) — perlu perhatian\n\nAdmin Diskominfo bertugas menindaklanjuti setiap temuan."
  },
  {
    judul: "Bagaimana cara membaca Executive Summary?",
    ikon: "📊",
    teks: "Halaman Executive Summary menampilkan kondisi per SKPD dalam bentuk tabel. Kolom 'Kondisi' menampilkan persentase layanan yang online — semakin tinggi persentasenya, semakin baik kondisi layanan digital SKPD tersebut."
  },
  {
    judul: "Apa yang dilakukan Diskominfo dengan aplikasi ini?",
    ikon: "👨‍💼",
    teks: "Admin Diskominfo menggunakan SIMDOM untuk:\n• Memantau kondisi semua website setiap hari\n• Mendeteksi masalah sebelum dilaporkan masyarakat\n• Mengoordinasikan perbaikan dengan vendor/OPD terkait\n• Membuat laporan kondisi layanan digital secara berkala"
  }
]

export default async function PanduanPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const isPimpinan = session.user.role === "KABID"

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Panduan Penggunaan</h1>
        <p className="text-sm text-slate-400 mt-0.5">
          {isPimpinan ? "Penjelasan ringkas fitur SIMDOM" : "Panduan lengkap fitur SIMDOM"}
        </p>
      </div>

      {isPimpinan ? (
        <>
          <div className="bg-emerald-600 rounded-2xl p-5 text-white">
            <h2 className="text-lg font-bold">📗 Panduan Pimpinan</h2>
            <p className="text-sm text-emerald-100 mt-1">Penjelasan ringkas untuk pimpinan</p>
          </div>
          <div className="space-y-3">
            {panduanPimpinan.map((item, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
                <h3 className="text-sm font-bold text-slate-800 mb-2">{item.ikon} {item.judul}</h3>
                <p className="text-sm text-slate-600 whitespace-pre-line">{item.teks}</p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="bg-blue-600 rounded-2xl p-5 text-white">
            <h2 className="text-lg font-bold">📘 Panduan Admin</h2>
            <p className="text-sm text-blue-100 mt-1">Panduan teknis untuk admin Diskominfo</p>
          </div>
          <div className="space-y-3">
            {panduanAdmin.map((item, i) => (
              <PanduanAccordion key={i} item={item} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function PanduanAccordion({ item }: { item: typeof panduanAdmin[0] }) {
  return (
    <details className="bg-white rounded-xl border border-slate-100 shadow-sm group">
      <summary className="flex items-center gap-3 px-5 py-4 cursor-pointer list-none">
        <span className="text-xl">{item.ikon}</span>
        <span className="text-sm font-semibold text-slate-800 flex-1">{item.judul}</span>
        <svg className="h-4 w-4 text-slate-400 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
        </svg>
      </summary>
      <div className="px-5 pb-5 space-y-3 border-t border-slate-100 pt-4">
        {item.konten.map((k, i) => (
          <div key={i}>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">{k.subjudul}</p>
            <p className="text-sm text-slate-600 whitespace-pre-line">{k.teks}</p>
          </div>
        ))}
      </div>
    </details>
  )
}
