Dokumentasi Perhitungan Remunerasi Karyawan
Tujuan
Menghitung total jam kerja dan total remunerasi (upah) setiap karyawan berdasarkan:
1.	Pekerjaan utama (work log milik sendiri)
2.	Kontribusi sebagai kolaborator (di work log orang lain)
________________________________________
Rumus Perhitungan
A. Remunerasi dari Work Log Utama
Untuk setiap log pekerjaan (workLog) milik si karyawan:
basePayment = hours_spent * hourly_rate
totalBeforeProrate = basePayment + additional_charges

IF ada collaborators:
    totalHours = hours_spent (utama) + sum(hours_spent semua collaborator)
    proratedRatio = hours_spent / totalHours
    totalRemuneration = totalBeforeProrate * proratedRatio
ELSE:
    totalRemuneration = totalBeforeProrate
Catatan: Prorate dilakukan agar upah dibagi adil jika pekerjaan dikerjakan bersama.
________________________________________
B. Remunerasi dari Peran sebagai Kolaborator
Untuk setiap WorkLog orang lain di mana si karyawan terdaftar sebagai kolaborator:
FOR each collaborator IN workLog.collaborators:
    IF collaborator.employee_id == current_employee.id:
        collabHours = collaborator.hours_spent

        totalHours = workLog.hours_spent (utama) + sum(collaborator.hours_spent)
        totalBeforeProrate = (workLog.hours_spent * hourly_rate) + additional_charges
        proratedRatio = collabHours / totalHours
        collabRemuneration = totalBeforeProrate * proratedRatio
________________________________________
Alur Proses (Flow)
[Mulai]
   ↓
Ambil data Employee berdasarkan ID
   ↓
Ambil semua WorkLog milik Employee tersebut
   ↓
Hitung:
 - Total Hours = sum(hours_spent)
 - Total Remunerasi = sum(calculateTotalRemuneration() per log)
   ↓
Ambil semua WorkLog orang lain yang punya Employee ini sebagai kolaborator
   ↓
Untuk setiap log tersebut:
 - Cari kontribusi si employee dalam collaborators[]
 - Hitung proratedRemuneration untuk kontribusinya
   ↓
Jumlahkan semua kolaboratorRemuneration
   ↓
Gabungkan:
 - total_hours = hours dari log utama + hours sebagai kolaborator
 - total_remuneration = dari log utama + dari kolaborasi
   ↓
Hitung average_hourly_rate = total_remuneration / total_hours
   ↓
[Kirim response JSON ke client]
________________________________________
Contoh Kasus
Employee: Tatang Suratang
•	hours_spent: 2
•	hourly_rate: $10
•	additional_charges: $2
•	Total collaborator hours: 1 (Sari Wardani)
•	Total hours: 3
•	Prorated ratio (Tatang): 2 / 3
•	Base payment: 2 × $10 = $20
•	Total before prorate: $22
•	Final remuneration (Tatang): $22 × (2 / 3) = $14.67
•	Remunerasi Sari: $22 × (1 / 3) = $7.33
________________________________________
Response API JSON Contoh
{
  "success": true,
  "data": {
    "total_hours": 3,
    "total_remuneration": 22.00,
    "average_hourly_rate": 7.33
  }
}
