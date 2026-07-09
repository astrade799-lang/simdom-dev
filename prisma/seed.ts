import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Seeding database...")

  // Bersihkan data lama
  await prisma.activityReport.deleteMany()
  await prisma.webApp.deleteMany()
  await prisma.user.deleteMany()
  await prisma.skpd.deleteMany()

  // ─── SKPD ─────────────────────────────────────────────────────
  const skpdData = [
    { nama: "Dinas Komunikasi dan Informatika", singkatan: "DISKOMINFO", penanggungjawab: "-", kontak: "-" },
    { nama: "Badan Kepegawaian dan Pengembangan Sumber Daya Manusia", singkatan: "BKPSDM", penanggungjawab: "-", kontak: "-" },
    { nama: "Dinas Kesehatan", singkatan: "DINKES", penanggungjawab: "-", kontak: "-" },
    { nama: "Dinas Perpustakaan dan Kearsipan", singkatan: "PERPUSTAKAAN", penanggungjawab: "-", kontak: "-" },
    { nama: "Badan Pengelolaan Keuangan Daerah", singkatan: "BPKD", penanggungjawab: "-", kontak: "-" },
    { nama: "Dinas Perumahan dan Kawasan Permukiman", singkatan: "PERKIM", penanggungjawab: "-", kontak: "-" },
    { nama: "Badan Penanggulangan Bencana Daerah", singkatan: "BPBD", penanggungjawab: "-", kontak: "-" },
    { nama: "Dinas Tanaman Pangan, Hortikultura, Perkebunan dan Ketahanan Pangan", singkatan: "DTPHPKP", penanggungjawab: "-", kontak: "-" },
    { nama: "Dinas Pemberdayaan Perempuan, Perlindungan Anak, Pengendalian Penduduk dan Keluarga Berencana", singkatan: "DP3AP2KB", penanggungjawab: "-", kontak: "-" },
    { nama: "Dinas Pendidikan dan Kebudayaan", singkatan: "DISDIKBUD", penanggungjawab: "-", kontak: "-" },
    { nama: "Dinas Perikanan dan Ketahanan Pangan", singkatan: "DPKP", penanggungjawab: "-", kontak: "-" },
    { nama: "Dinas Perhubungan", singkatan: "DISHUB", penanggungjawab: "-", kontak: "-" },
    { nama: "Dinas Pekerjaan Umum dan Penataan Ruang", singkatan: "PUPR", penanggungjawab: "-", kontak: "-" },
    { nama: "Satuan Polisi Pamong Praja dan Pemadam Kebakaran", singkatan: "POLPP-PMK", penanggungjawab: "-", kontak: "-" },
    { nama: "Dinas Kependudukan dan Pencatatan Sipil", singkatan: "DISDUKCAPIL", penanggungjawab: "-", kontak: "-" },
    { nama: "Dinas Pemberdayaan Masyarakat dan Desa", singkatan: "DPMD", penanggungjawab: "-", kontak: "-" },
    { nama: "Badan Kesatuan Bangsa dan Politik", singkatan: "KESBANGPOL", penanggungjawab: "-", kontak: "-" },
    { nama: "Dinas Penanaman Modal, PTSP, Tenaga Kerja dan Transmigrasi", singkatan: "DPMPTSP-NAKERTRANS", penanggungjawab: "-", kontak: "-" },
    { nama: "Dinas Sosial", singkatan: "DINSOS", penanggungjawab: "-", kontak: "-" },
    { nama: "Dinas Pariwisata, Pemuda dan Olahraga", singkatan: "DISPARPORA", penanggungjawab: "-", kontak: "-" },
    { nama: "Dinas Perdagangan, Perindustrian, Koperasi dan UKM", singkatan: "DPPKUKM", penanggungjawab: "-", kontak: "-" },
    { nama: "Rumah Sakit Umum Daerah", singkatan: "RSUD", penanggungjawab: "-", kontak: "-" },
    { nama: "Dinas Lingkungan Hidup", singkatan: "DLH", penanggungjawab: "-", kontak: "-" },
    { nama: "Badan Perencanaan Pembangunan, Penelitian dan Pengembangan Daerah", singkatan: "BAPPELITBANGDA", penanggungjawab: "-", kontak: "-" },
    { nama: "Perusahaan Daerah", singkatan: "PERUSDA", penanggungjawab: "-", kontak: "-" },
    { nama: "Kecamatan Lalabata", singkatan: "KEC-LALABATA", penanggungjawab: "-", kontak: "-" },
    { nama: "Kecamatan Marioriwawo", singkatan: "KEC-MARIORIWAWO", penanggungjawab: "-", kontak: "-" },
    { nama: "Kecamatan Liliriaja", singkatan: "KEC-LILIRIAJA", penanggungjawab: "-", kontak: "-" },
    { nama: "Kecamatan Lilirilau", singkatan: "KEC-LILIRILAU", penanggungjawab: "-", kontak: "-" },
    { nama: "Kecamatan Ganra", singkatan: "KEC-GANRA", penanggungjawab: "-", kontak: "-" },
    { nama: "Kecamatan Marioriawa", singkatan: "KEC-MARIORIAWA", penanggungjawab: "-", kontak: "-" },
    { nama: "Kecamatan Donri-Donri", singkatan: "KEC-DONRIDONRI", penanggungjawab: "-", kontak: "-" },
    { nama: "Kecamatan Citta", singkatan: "KEC-CITTA", penanggungjawab: "-", kontak: "-" },
  ]

  const skpds: Record<string, string> = {}
  for (const data of skpdData) {
    const skpd = await prisma.skpd.create({ data })
    skpds[data.singkatan] = skpd.id
  }
  console.log(`✅ ${skpdData.length} SKPD dibuat`)

  // ─── WEB APPS ─────────────────────────────────────────────────
  const webApps = [
    // DISKOMINFO
    { nama: "Website Diskominfo", url: "https://diskominfo.soppeng.go.id", skpd: "DISKOMINFO" },
    { nama: "Sidalmentel", url: "https://sidalmentel.soppeng.go.id", skpd: "DISKOMINFO" },
    { nama: "Repository API", url: "https://repository-api.soppeng.go.id", skpd: "DISKOMINFO" },
    { nama: "Satu Data Soppeng", url: "https://satudata.soppeng.go.id", skpd: "DISKOMINFO" },
    { nama: "Sionrang", url: "https://sionrang.soppeng.go.id", skpd: "DISKOMINFO" },
    { nama: "Portal Bugis", url: "https://bugis.soppeng.go.id", skpd: "DISKOMINFO" },
    { nama: "JDIH", url: "https://jdih.soppeng.go.id", skpd: "DISKOMINFO" },
    { nama: "Sikapda", url: "https://sikapda.soppeng.go.id", skpd: "DISKOMINFO" },
    { nama: "PPID", url: "https://ppid.soppeng.go.id", skpd: "DISKOMINFO" },
    { nama: "SAMP", url: "https://samp.soppeng.go.id", skpd: "DISKOMINFO" },
    { nama: "TPP", url: "https://tpp.soppeng.go.id", skpd: "DISKOMINFO" },
    { nama: "Presensi", url: "https://presensi.soppeng.go.id", skpd: "DISKOMINFO" },
    { nama: "Cloud Soppeng", url: "https://cloud.soppeng.go.id", skpd: "DISKOMINFO" },
    { nama: "LAN", url: "https://lan.soppeng.go.id", skpd: "DISKOMINFO" },
    { nama: "Simpeg", url: "https://simpeg.soppeng.go.id", skpd: "DISKOMINFO" },
    { nama: "LPSE", url: "https://lpse.soppeng.go.id", skpd: "DISKOMINFO" },
    { nama: "Website Resmi Soppeng", url: "https://soppeng.go.id", skpd: "DISKOMINFO" },
    // BKPSDM
    { nama: "Website BKPSDM", url: "https://bkpsdm.soppeng.go.id", skpd: "BKPSDM" },
    // DINKES
    { nama: "Website Dinas Kesehatan", url: "https://dinkes.soppeng.go.id", skpd: "DINKES" },
    { nama: "Laboratorium Kesehatan Daerah", url: "https://labkesda.soppeng.go.id", skpd: "DINKES" },
    { nama: "PSC 119", url: "https://psc119.soppeng.go.id", skpd: "DINKES" },
    { nama: "Puskesmas Salotungo", url: "https://pkm-salotungo.soppeng.go.id", skpd: "DINKES" },
    { nama: "Puskesmas Sewo", url: "https://pkm-sewo.soppeng.go.id", skpd: "DINKES" },
    { nama: "Puskesmas Malaka", url: "https://pkm-malaka.soppeng.go.id", skpd: "DINKES" },
    { nama: "Puskesmas Ganra", url: "https://pkm-ganra.soppeng.go.id", skpd: "DINKES" },
    { nama: "Puskesmas Tajuncu", url: "https://pkm-tajuncu.soppeng.go.id", skpd: "DINKES" },
    { nama: "Puskesmas Leworeng", url: "https://pkm-leworeng.soppeng.go.id", skpd: "DINKES" },
    { nama: "Puskesmas Batubatu", url: "https://pkm-batubatu.soppeng.go.id", skpd: "DINKES" },
    { nama: "Puskesmas Panincong", url: "https://pkm-panincong.soppeng.go.id", skpd: "DINKES" },
    { nama: "Puskesmas Cangadi", url: "https://pkm-cangadi.soppeng.go.id", skpd: "DINKES" },
    { nama: "Puskesmas Pacongkang", url: "https://pkm-pacongkang.soppeng.go.id", skpd: "DINKES" },
    { nama: "Puskesmas Citta", url: "https://pkm-citta.soppeng.go.id", skpd: "DINKES" },
    { nama: "Puskesmas Cabenge", url: "https://pkm-cabenge.soppeng.go.id", skpd: "DINKES" },
    { nama: "Puskesmas Baringeng", url: "https://pkm-baringeng.soppeng.go.id", skpd: "DINKES" },
    { nama: "Puskesmas Tanjonge", url: "https://pkm-tanjonge.soppeng.go.id", skpd: "DINKES" },
    { nama: "Puskesmas Goarie", url: "https://pkm-goarie.soppeng.go.id", skpd: "DINKES" },
    { nama: "Puskesmas Takalala", url: "https://pkm-takalala.soppeng.go.id", skpd: "DINKES" },
    { nama: "Puskesmas Cakkuridi", url: "https://pkm-cakkuridi.soppeng.go.id", skpd: "DINKES" },
    // PERPUSTAKAAN
    { nama: "Website Perpustakaan", url: "https://perpustakaan.soppeng.go.id", skpd: "PERPUSTAKAAN" },
    { nama: "Sibugis", url: "https://sibugis.soppeng.go.id", skpd: "PERPUSTAKAAN" },
    // BPKD
    { nama: "Website BPKD", url: "https://bpkd.soppeng.go.id", skpd: "BPKD" },
    { nama: "PBB BPKD", url: "https://pbbpkd.soppeng.go.id", skpd: "BPKD" },
    // PERKIM
    { nama: "Website Perkim", url: "https://perkim.soppeng.go.id", skpd: "PERKIM" },
    // BPBD
    { nama: "Website BPBD", url: "https://bpbd.soppeng.go.id", skpd: "BPBD" },
    { nama: "BPBJ", url: "https://bpbj.soppeng.go.id", skpd: "BPBD" },
    { nama: "Silapa", url: "https://silapa.soppeng.go.id", skpd: "BPBD" },
    // DTPHPKP
    { nama: "Website DTPHPKP", url: "https://dtphpkp.soppeng.go.id", skpd: "DTPHPKP" },
    { nama: "BPP Lalabata", url: "https://bpplalabata.soppeng.go.id", skpd: "DTPHPKP" },
    { nama: "BPP Marioriwawo", url: "https://bppmarioriwawo.soppeng.go.id", skpd: "DTPHPKP" },
    { nama: "BPP Liliriaja", url: "https://bppliliriaja.soppeng.go.id", skpd: "DTPHPKP" },
    { nama: "BPP Lilirilau", url: "https://bpplilirilau.soppeng.go.id", skpd: "DTPHPKP" },
    { nama: "BPP Ganra", url: "https://bppganra.soppeng.go.id", skpd: "DTPHPKP" },
    { nama: "BPP Citta", url: "https://bppcitta.soppeng.go.id", skpd: "DTPHPKP" },
    { nama: "BPP Donri-Donri", url: "https://bppdonridonri.soppeng.go.id", skpd: "DTPHPKP" },
    { nama: "BPP Marioriawa", url: "https://bppmarioriawa.soppeng.go.id", skpd: "DTPHPKP" },
    // DP3AP2KB
    { nama: "Website DP3AP2KB", url: "https://dp3ap2kb.soppeng.go.id", skpd: "DP3AP2KB" },
    // DISDIKBUD
    { nama: "Website Disdikbud", url: "https://dikbud.soppeng.go.id", skpd: "DISDIKBUD" },
    // DPKP
    { nama: "Website DPKP", url: "https://dpkp.soppeng.go.id", skpd: "DPKP" },
    // DISHUB
    { nama: "Website Dishub", url: "https://dishub.soppeng.go.id", skpd: "DISHUB" },
    // PUPR
    { nama: "Website PUPR", url: "https://pupr.soppeng.go.id", skpd: "PUPR" },
    // POLPP-PMK
    { nama: "Website Satpol PP dan PMK", url: "https://polpp-pmk.soppeng.go.id", skpd: "POLPP-PMK" },
    // DISDUKCAPIL
    { nama: "Website Disdukcapil", url: "https://disdukcapil.soppeng.go.id", skpd: "DISDUKCAPIL" },
    // DPMD
    { nama: "Website DPMD", url: "https://dpmd.soppeng.go.id", skpd: "DPMD" },
    { nama: "Petta Desa", url: "https://pettadesa.soppeng.go.id", skpd: "DPMD" },
    // KESBANGPOL
    { nama: "Website Kesbangpol", url: "https://kesbangpol.soppeng.go.id", skpd: "KESBANGPOL" },
    { nama: "Sipakatau", url: "https://sipakatau.soppeng.go.id", skpd: "KESBANGPOL" },
    // DPMPTSP-NAKERTRANS
    { nama: "Website DPMPTSP Nakertrans", url: "https://dpmptsp-nakertrans.soppeng.go.id", skpd: "DPMPTSP-NAKERTRANS" },
    // DINSOS
    { nama: "Website Dinas Sosial", url: "https://dinsos.soppeng.go.id", skpd: "DINSOS" },
    { nama: "Reno", url: "https://reno.soppeng.go.id", skpd: "DINSOS" },
    { nama: "Kartu Macca", url: "https://kartumacca.soppeng.go.id", skpd: "DINSOS" },
    { nama: "Dinsosapp", url: "https://dinsosapp.soppeng.go.id", skpd: "DINSOS" },
    // DISPARPORA
    { nama: "Website Disparpora", url: "https://disparpora.soppeng.go.id", skpd: "DISPARPORA" },
    { nama: "Portal Wisata", url: "https://wisata.soppeng.go.id", skpd: "DISPARPORA" },
    { nama: "Visit Soppeng", url: "https://visit.soppeng.go.id", skpd: "DISPARPORA" },
    // DPPKUKM
    { nama: "Website DPPKUKM", url: "https://dppkukm.soppeng.go.id", skpd: "DPPKUKM" },
    { nama: "Galeri UKM", url: "https://galeryukm.soppeng.go.id", skpd: "DPPKUKM" },
    { nama: "Kemasan", url: "https://kemasan.soppeng.go.id", skpd: "DPPKUKM" },
    // RSUD
    { nama: "Website RSUD", url: "https://rsud.soppeng.go.id", skpd: "RSUD" },
    // DLH
    { nama: "Website Dinas Lingkungan Hidup", url: "https://dlh.soppeng.go.id", skpd: "DLH" },
    // BAPPELITBANGDA
    { nama: "Website Bappelitbangda", url: "https://bappelitbangda.soppeng.go.id", skpd: "BAPPELITBANGDA" },
    { nama: "E-Mappadeceng", url: "https://e-mappadeceng.soppeng.go.id", skpd: "BAPPELITBANGDA" },
    // PERUSDA
    { nama: "Website Perusda", url: "https://perusda.soppeng.go.id", skpd: "PERUSDA" },
    // KECAMATAN & KELURAHAN
    { nama: "Website Kecamatan Lalabata", url: "https://lalabata.soppeng.go.id", skpd: "KEC-LALABATA" },
    { nama: "Kelurahan Lapajung", url: "https://kel-lapajung.soppeng.go.id", skpd: "KEC-LALABATA" },
    { nama: "Kelurahan Lemba", url: "https://kel-lemba.soppeng.go.id", skpd: "KEC-LALABATA" },
    { nama: "Kelurahan Bila", url: "https://kel-bila.soppeng.go.id", skpd: "KEC-LALABATA" },
    { nama: "Kelurahan Ompo", url: "https://kel-ompo.soppeng.go.id", skpd: "KEC-LALABATA" },
    { nama: "Kelurahan Botto", url: "https://kel-botto.soppeng.go.id", skpd: "KEC-LALABATA" },
    { nama: "Kelurahan Lalabatarilau", url: "https://kel-lalabatarilau.soppeng.go.id", skpd: "KEC-LALABATA" },
    { nama: "Kelurahan Salokaraja", url: "https://kel-salokaraja.soppeng.go.id", skpd: "KEC-LALABATA" },
    { nama: "Website Kecamatan Marioriwawo", url: "https://marioriwawo.soppeng.go.id", skpd: "KEC-MARIORIWAWO" },
    { nama: "Kelurahan Tettikenrarae", url: "https://kel-tettikenrarae.soppeng.go.id", skpd: "KEC-MARIORIWAWO" },
    { nama: "Kelurahan Labessi", url: "https://kel-labessi.soppeng.go.id", skpd: "KEC-MARIORIWAWO" },
    { nama: "Website Kecamatan Liliriaja", url: "https://liliriaja.soppeng.go.id", skpd: "KEC-LILIRIAJA" },
    { nama: "Kelurahan Appanang", url: "https://kel-appanang.soppeng.go.id", skpd: "KEC-LILIRIAJA" },
    { nama: "Kelurahan Galung", url: "https://kel-galung.soppeng.go.id", skpd: "KEC-LILIRIAJA" },
    { nama: "Kelurahan Jennae", url: "https://kel-jennae.soppeng.go.id", skpd: "KEC-LILIRIAJA" },
    { nama: "Website Kecamatan Lilirilau", url: "https://lilirilau.soppeng.go.id", skpd: "KEC-LILIRILAU" },
    { nama: "Kelurahan Ujung", url: "https://kel-ujung.soppeng.go.id", skpd: "KEC-LILIRILAU" },
    { nama: "Kelurahan Pajalesang", url: "https://kel-pajalesang.soppeng.go.id", skpd: "KEC-LILIRILAU" },
    { nama: "Kelurahan Macanre", url: "https://kel-macanre.soppeng.go.id", skpd: "KEC-LILIRILAU" },
    { nama: "Kelurahan Cabenge", url: "https://kel-cabenge.soppeng.go.id", skpd: "KEC-LILIRILAU" },
    { nama: "Website Kecamatan Ganra", url: "https://ganra.soppeng.go.id", skpd: "KEC-GANRA" },
    { nama: "Website Kecamatan Marioriawa", url: "https://marioriawa.soppeng.go.id", skpd: "KEC-MARIORIAWA" },
    { nama: "Kelurahan Attangsalo", url: "https://kel-attangsalo.soppeng.go.id", skpd: "KEC-MARIORIAWA" },
    { nama: "Kelurahan Limpomajang", url: "https://kel-limpomajang.soppeng.go.id", skpd: "KEC-MARIORIAWA" },
    { nama: "Kelurahan Kaca", url: "https://kel-kaca.soppeng.go.id", skpd: "KEC-MARIORIAWA" },
    { nama: "Kelurahan Manorangsalo", url: "https://kel-manorangsalo.soppeng.go.id", skpd: "KEC-MARIORIAWA" },
    { nama: "Kelurahan Batubatu", url: "https://kel-batubatu.soppeng.go.id", skpd: "KEC-MARIORIAWA" },
    { nama: "Website Kecamatan Donri-Donri", url: "https://donridonri.soppeng.go.id", skpd: "KEC-DONRIDONRI" },
    { nama: "Website Kecamatan Citta", url: "https://citta.soppeng.go.id", skpd: "KEC-CITTA" },
  ]

  for (const app of webApps) {
    await prisma.webApp.create({
      data: {
        nama: app.nama,
        url: app.url,
        status: "AKTIF",
        adminTeknis: "-",
        kontakAdmin: "-",
        skpdId: skpds[app.skpd],
      },
    })
  }
  console.log(`✅ ${webApps.length} domain dibuat`)

  // ─── USERS ────────────────────────────────────────────────────
  const hashedPassword = await bcrypt.hash("Admin1234", 12)

  await prisma.user.createMany({
    data: [
      {
        email: "superadmin@soppeng.go.id",
        name: "Super Admin",
        password: hashedPassword,
        role: "SUPER_ADMIN",
        skpdId: skpds["DISKOMINFO"],
      },
      {
        email: "admin@soppeng.go.id",
        name: "Admin Diskominfo",
        password: hashedPassword,
        role: "ADMIN",
        skpdId: skpds["DISKOMINFO"],
      },
      {
        email: "kabid@soppeng.go.id",
        name: "Kabid Infrastruktur",
        password: hashedPassword,
        role: "KABID",
        skpdId: skpds["DISKOMINFO"],
      },
    ],
  })
  console.log("✅ 3 user dibuat")

  console.log("─────────────────────────────────────────")
  console.log("🎉 Seed selesai!")
  console.log(`📋 Total SKPD  : ${skpdData.length}`)
  console.log(`🌐 Total Domain: ${webApps.length}`)
  console.log("─────────────────────────────────────────")
  console.log("superadmin@soppeng.go.id | Admin1234")
  console.log("admin@soppeng.go.id      | Admin1234")
  console.log("kabid@soppeng.go.id      | Admin1234")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
