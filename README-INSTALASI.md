BACKEND LARAVEL 12



SERVER VERSION:
    
    MYSQL: 8.0.25-15

    PHP: 8.2.13



INSTALLATION:
    
    1. Clone repo
    
    2. Buka terminal dan masuk ke direktori project
    
    3. Jalankan: composer install
    
    4. Ubah nama file .env.example menjadi .env

    5. Buat database MySQL dengan nama booking_rozzaq atau nama lain (disesuaikan pada file .env) seperti berikut:

```
DB_CONNECTION=mysql  
DB_HOST=127.0.0.1  
DB_PORT=3306  
DB_DATABASE=backend-app  
DB_USERNAME=root  
DB_PASSWORD=root  
```

    6. Jalankan perintah berikut:
    
        - php artisan key:generate
        
        - php artisan migrate

        - php artisan serve
        









---------------------------------------------------------

FRONTEND NEXT JS


SERVER VERSION:

    Node.js: v22.15.0


INSTALLATION:
    
    1. Clone repo
    
    2. Buka terminal dan masuk ke direktori project
    
    3. Jalankan: npm install
    
    4. Jalankan: npm run dev
