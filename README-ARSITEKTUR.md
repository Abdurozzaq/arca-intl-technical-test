
# Arsitektur Solusi (End-to-End)

**[Frontend: Next.js] ←HTTP→ [Backend: Laravel API] ↔ [Database]**

----------

## Komponen Utama

### Frontend (Next.js)

-   Menggunakan Tailwind CSS untuk styling
    
-   Terdiri dari halaman dan komponen React
    
-   Berkomunikasi dengan backend via REST API
    

### Backend (Laravel)

-   Menyediakan API RESTful
    
-   Menangani logika bisnis (termasuk perhitungan remunerasi jika ada)
    
-   Berkomunikasi dengan database
    

### Database

-   Menyimpan data employees dan work_logs
    

----------

## Diagram Alur Data

```
Frontend → (HTTP Request) → Backend → (Query) → Database
Frontend ← (HTTP Response) ← Backend ← (Data) ← Database
```

----------

## Detail Alur Data

### 1. Inisialisasi Aplikasi

-   Frontend di-load di browser
    
-   Komponen Layout dan Navbar dirender
    
-   Halaman memanggil API untuk mendapatkan data awal
    

----------

### 2. Contoh Alur CRUD Employee

#### a. Create Employee

1.  **Frontend:**
    
    -   User mengisi form di `/employees/create`
        
    -   Form submit → POST `/api/employees`
        
2.  **Backend:**
    
    -   Validasi input
        
    -   Simpan ke database
        
    -   Kembalikan response sukses dan data employee baru
        
3.  **Frontend:**
    
    -   Terima response
        
    -   Redirect ke halaman list atau detail employee
        
    -   Tampilkan notifikasi sukses
        

#### b. Read Employee Data

1.  **Frontend:**
    
    -   GET `/api/employees` di `useEffect`
        
    -   Tampilkan loading state
        
2.  **Backend:**
    
    -   Query database untuk ambil daftar employees
        
    -   Format data ke JSON
        
    -   Kirim response ke frontend
        
3.  **Frontend:**
    
    -   Render data di tabel
        
    -   Tampilkan error jika ada masalah
        

#### c. Update Employee

1.  **Frontend:**
    
    -   GET `/api/employees/:id` untuk pre-fill form edit
        
    -   Submit form → PUT `/api/employees/:id`
        
2.  **Backend:**
    
    -   Validasi input
        
    -   Update data di database
        
    -   Kembalikan data terbaru
        
3.  **Frontend:**
    
    -   Update state/local data
        
    -   Redirect ke halaman detail atau list
        
    -   Tampilkan notifikasi sukses
        

#### d. Delete Employee

1.  **Frontend:**
    
    -   User konfirmasi dialog hapus
        
    -   DELETE `/api/employees/:id`
        
2.  **Backend:**
    
    -   Cek constraint database (jika ada)
        
    -   Hapus data dari database
        
    -   Kembalikan response sukses
        
3.  **Frontend:**
    
    -   Hapus data dari state/local
        
    -   Redirect ke list employee
        
    -   Tampilkan notifikasi sukses
        

----------

### 3. Alur Khusus Perhitungan Remunerasi (Work Log)

1.  **Frontend:**
    
    -   User input data work log (jam kerja, tarif, dll)
        
    -   POST `/api/work-logs`
        
2.  **Backend:**
    
    -   Hitung remunerasi:
        
        -   Jika kolaborator: prorata berdasarkan jam kerja
            
        -   Total = (jam kerja × tarif) + biaya tambahan
            
    -   Simpan data dan total remunerasi ke database
        
3.  **Frontend:**
    
    -   Terima response termasuk `total_remuneration`
        
    -   Tampilkan detail perhitungan ke user
