CREATE USER 'dokter'@'localhost' IDENTIFIED BY 'dokter123';
GRANT ALL PRIVILEGES ON manajemen_peternakan.* TO 'dokter'@'localhost';
FLUSH PRIVILEGES;


-- Membuat database
CREATE DATABASE manajemen_peternakan;

-- Mendeklarasikan database yang ingin digunakan
USE manajemen_peternakan;

-- Membuat tabel Akun
CREATE TABLE Akun (
   idUser INT PRIMARY KEY AUTO_INCREMENT,
   Nama VARCHAR(100) NOT NULL,
   username varchar(255) unique not null,
   Password VARCHAR(100) NOT NULL,
   is_dokter boolean not null
);

-- Membuat tabel Hewan
CREATE TABLE Hewan (
   idHewan INT PRIMARY KEY AUTO_INCREMENT,
   Umur INT NOT NULL,
   Spesies VARCHAR(100),
   Status_kesehatan VARCHAR(100)
);

-- Membuat tabel Kesehatan
CREATE TABLE Kesehatan (
   idKesehatan INT PRIMARY KEY AUTO_INCREMENT,
   idHewan INT,
   idUser INT,
   Tanggal_pemeriksaan DATE,
   Hasil_pemeriksaan TEXT,
   pengobatan TEXT,
   FOREIGN KEY (idHewan) REFERENCES Hewan(idHewan),
   FOREIGN KEY (idUser) REFERENCES Akun(idUser)
);
ALTER TABLE Kesehatan
ADD LastUpdated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,  -- untuk mencatat waktu pembaruan terakhir.
ADD LastUpdatedBy INT;  -- untuk mencatat siapa yang terakhir kali memperbarui.



CREATE TABLE Produksi (
   idProduksi INT AUTO_INCREMENT PRIMARY KEY,
   idHewan INT,
   idUser INT,
   Jenis_produksi VARCHAR(100),
   Jumlah INT,
   Stok INT,
   FOREIGN KEY (idHewan) REFERENCES Hewan(idHewan),
   FOREIGN KEY (idUser) REFERENCES Akun(idUser)
);

-- Membuat tabel Pakan
CREATE TABLE Pakan (
   idPakan INT PRIMARY KEY AUTO_INCREMENT,
   idUser INT,
   Jenis_pakan VARCHAR(100),
   Jumlah INT,
   Stok INT,
   FOREIGN KEY (idUser) REFERENCES Akun(idUser)
);
ALTER TABLE Pakan
ADD LastUpdated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,  --  untuk mencatat waktu pembaruan terakhir.
ADD LastUpdatedBy INT;  -- untuk mencatat siapa yang terakhir kali memperbarui.

-- Membuat stored procedure untuk registrasi
CREATE PROCEDURE register(
    IN _name VARCHAR(100),
    IN _username VARCHAR(255),
    IN _password VARCHAR(100),
    IN _is_dokter BOOLEAN
)
BEGIN
    -- Error handling
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    -- Validasi nama
    IF (_name IS NULL OR LENGTH(_name) < 1) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Nama tidak boleh kosong';
    END IF;

    -- Validasi username
    IF (LENGTH(_username) < 3) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Panjang username minimal 3 karakter';
    END IF;

    -- Validasi password
    IF (LENGTH(_password) < 8) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Panjang password minimal 8 karakter';
    END IF;

    -- Hash password
    SET @hashed_password = SHA2(_password, 256);

    -- Menyisipkan data ke dalam tabel Akun
    INSERT INTO Akun (Nama, username, Password, is_dokter)
    VALUES (_name, _username, @hashed_password, _is_dokter);

    COMMIT;
END;


-- Membuat stored procedure untuk login
CREATE PROCEDURE login(
    in _username varchar(255),
    in _password varchar(255)
)
begin
    -- catch err
    declare exit handler for sqlexception
    begin
        rollback;
        resignal;
    end;

    start transaction;

    if (length(coalesce(_username, '')) < 3) then
        signal sqlstate
            '45000'
        set
            message_text = 'Panjang username minimal 3 karakter';
    end if;

    if (length(_password) < 8) then
        signal sqlstate
            '45000'
        set
            message_text = 'Panjang password minimal 8 karakter';
    end if;

    if not exists(
        select
            1
        from
            akun
        where
            username = _username and password = sha2(_password, 256)
    ) then
        signal sqlstate
            '45000'
        set
            message_text = 'Username atau password salah';
    end if;

    select
        iduser,
        nama,
        username,
        is_dokter
    from
        akun  
    where
        username = _username and password = sha2(_password, 256);

    commit;
end;
drop procedure insertakun;
-- Stored Procedure untuk menambahkan data baru ke tabel Akun.-------------------------------------------------------------------------------------
DELIMITER $$

CREATE PROCEDURE InsertAkun (
    IN p_Nama VARCHAR(100),
    IN p_username VARCHAR(255),
    IN p_Password VARCHAR(100),
    IN p_is_dokter BOOLEAN
)
BEGIN
    -- Penanganan kesalahan
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        -- Rollback jika terjadi kesalahan
        ROLLBACK;
        -- Mengirimkan error kembali
        RESIGNAL;
    END;

    -- Memulai transaksi
    START TRANSACTION;

    -- Menyisipkan data ke tabel Akun
    INSERT INTO Akun (Nama, username, Password, is_dokter) 
    VALUES (p_Nama, p_username, p_Password, p_is_dokter);

    -- Commit transaksi jika berhasil
    COMMIT;
END$$

DELIMITER ;

CALL InsertAkun('John Doe', 'johndoe', 'hashedpassword123', TRUE);


SHOW PROCEDURE STATUS WHERE Db = 'manajemen_peternakan';

-- Stored Procedure untuk memperbarui data akun berdasarkan idUser.
CREATE PROCEDURE UpdateAkun (
     IN _idUser INT,
    IN _Nama VARCHAR(100),
    IN _username VARCHAR(255),
    IN _Password VARCHAR(100),
    IN _is_dokter BOOLEAN
)
BEGIN
    -- Penanganan kesalahan
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        -- Rollback jika terjadi kesalahan
        ROLLBACK;
    END;

    -- Memulai transaksi
    START TRANSACTION;

    -- Update data di tabel Akun
    UPDATE Akun 
    SET 
        Nama = p_Nama, 
        username = p_username, 
        Password = p_Password, 
        is_dokter = p_is_dokter
    WHERE 
        idUser = p_idUser;

    -- Commit transaksi jika berhasil
    COMMIT;
END;

-- Stored Procedure untuk mencari Akun berdasarkan idUser dan/atau Nama.
CREATE PROCEDURE GetAkunByIdAndName (
    IN p_idUser INT,
    IN p_Nama VARCHAR(100)
)
BEGIN
    SELECT idUser, Nama, username, is_dokter
    FROM Akun 
    WHERE (idUser = p_idUser OR p_idUser IS NULL)
      AND (Nama = p_Nama OR p_Nama IS NULL);
END;

-- Stored Procedure untuk menghapus data dari tabel Akun berdasarkan idUser.
CREATE PROCEDURE DeleteAkun (
    IN p_idUser INT
)
BEGIN
    -- Penanganan kesalahan
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        -- Rollback jika terjadi kesalahan
        ROLLBACK;
    END;

    -- Memulai transaksi
    START TRANSACTION;

    -- Menghapus data dari tabel Akun
    DELETE FROM Akun 
    WHERE idUser = p_idUser;

    -- Commit transaksi jika berhasil
    COMMIT;
END;

-- Stored Procedure untuk mendapatkan semua data dari tabel Akun.
-- tidak perlu menggunakan transaction krn hanya memanggil semua role tdk ada insert dkk
CREATE PROCEDURE GetAkun()
BEGIN
    -- Menampilkan data akun
    SELECT
        idUser,
        Nama,
        username,
        Password,
        is_dokter
    FROM
        Akun;
end;

-- Stored Procedure untuk mencari Akun berdasarkan Nama.
CREATE PROCEDURE SearchAkunByName (
    IN p_Nama VARCHAR(255)
)
BEGIN
    SELECT 
        idUser, 
        Nama, 
        username, 
        Password, 
        is_dokter 
    FROM 
        Akun
    WHERE 
        Nama LIKE CONCAT('%', p_Nama, '%');
end;


CALL searchakunbyname('Dilla');


SELECT * FROM Akun WHERE nama LIKE '%Dilla Ayu%';


-- Stored Procedure untuk menambahkan data baru ke tabel Hewan.--------------------------------------------------------------------------------
CREATE PROCEDURE InsertHewan (
    IN p_Umur INT,
    IN p_Spesies VARCHAR(100),
    IN p_Status_kesehatan VARCHAR(100)
)
BEGIN
	-- penanganan kesalahan
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		-- rollback jika terjadi kesalahan
		ROLLBACK;
	END;
	
	-- memulai transaksi
	START TRANSACTION;
	
	-- menyisipkan data ke table hewan
    INSERT INTO Hewan (Umur, Spesies, Status_kesehatan) 
    VALUES (p_Umur, p_Spesies, p_Status_kesehatan);
   
   -- commit transaksi juka berhasil
   COMMIT;
END;

-- Stored Procedure untuk memperbarui data hewan
CREATE PROCEDURE UpdateHewan (
    IN p_idHewan INT,
    IN p_Umur INT,
    IN p_Spesies VARCHAR(100),
    IN p_Status_kesehatan VARCHAR(100)
)
BEGIN
	-- penanganan kesalahan
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		-- rollback jika terjadi kesalahan
		ROLLBACK;
	END;

	-- memulai transaksi
	START TRANSACTION;

	-- update data dari tabel hewan
    UPDATE Hewan 
    SET 
	    Umur = p_Umur, 
	    Spesies = p_Spesies, 
	    Status_kesehatan = p_Status_kesehatan
    WHERE 
   		idHewan = p_idHewan;
   	
   	-- commit transaksi jika berhasil
   	COMMIT;
END ;

-- Stored Procedure untuk menghapus data hewan
CREATE PROCEDURE DeleteHewan (
    IN p_idHewan INT
)
BEGIN
	-- penanganan kesalahan
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		-- rollback jika terjadi kesalahan
		ROLLBACK;
	END;

	-- memulai transaksi
	 START TRANSACTION;
	
	-- menghapus data dari tabel akun
    DELETE FROM Hewan 
    WHERE idHewan = p_idHewan;
   
   -- commit transaksi jika berhasil
   COMMIT;
END ;

-- Stored Procedure untuk mendapatkan semua data dari tabel hewan
-- tidak perlu menggunakan transaction krn hanya memanggil semua hewan tdk ada insert dkk
CREATE PROCEDURE GetHewan()
BEGIN
    SELECT
	    idHewan,
	    Umur,
	    Spesies,
	    Status_kesehatan
    FROM
    	Hewan;
END ;

-- Stored Procedure untuk menambahkan catatan kesehatan hewan.-------------------------------------------------------------------------------------------------
CREATE PROCEDURE InsertKesehatan (
    IN p_idHewan INT,
    IN p_idUser INT,
    IN p_Tanggal_pemeriksaan DATE,
    IN p_Hasil_pemeriksaan TEXT,
    IN p_pengobatan TEXT
)
BEGIN
	-- penanganan kesalahan
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		-- rollback jika terjadi kesalahan
		ROLLBACK;
	END;

	-- memulai transaksi
	START TRANSACTION;

	-- menyisiokan data ke tabel Hewan
    INSERT INTO Kesehatan (idHewan, idUser, Tanggal_pemeriksaan, Hasil_pemeriksaan, pengobatan) 
    VALUES (p_idHewan, p_idUser, p_Tanggal_pemeriksaan, p_Hasil_pemeriksaan, p_pengobatan);
   
   -- commit transaksi jika berhasil
   COMMIT;
END ;
CALL InsertKesehatan(1, 2, '2024-11-13', 'Sakit', 'Obat D');

-- Stored Procedure untuk Pencarian di namaHewan
CREATE PROCEDURE SearchHewanByName (
    IN p_Spesies VARCHAR(100)
)
BEGIN
    SELECT idHewan, Umur, Spesies, Status_kesehatan
    FROM Hewan
    WHERE Spesies LIKE CONCAT('%', p_Spesies, '%');
END;


-- Read melihat Kesehatan Berdasarkan idKesehatan
-- tidak perlu menggunakan transaction krn hanya memanggil semua hewan tdk ada insert dkk
CREATE PROCEDURE GetKesehatanById (
   IN p_idKesehatan INT
)
BEGIN
   SELECT 
   		idKesehatan,
	    idHewan,
	    idUser,
	    Tanggal_pemeriksaan,
	    Hasil_pemeriksaan,
	    pengobatan
   FROM Kesehatan
   WHERE idKesehatan = p_idKesehatan;
END;

CALL GetKesehatanById(7);


-- Delete  riwayat kesehatan berdasarkan idKesehatan
CREATE PROCEDURE DeleteKesehatan (
   IN p_idKesehatan INT
)
BEGIN
	 DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
    END;

    START TRANSACTION;

    DELETE FROM Kesehatan 
    WHERE idKesehatan = p_idKesehatan;

    COMMIT;
END;

-- melihat riwayat kesehatan
CREATE PROCEDURE LihatRiwayatKesehatan (
   IN p_idHewan INT
)
BEGIN
   -- Select all records from the Kesehatan table based on the given idHewan
   SELECT
       K.Tanggal_pemeriksaan,
       K.Hasil_pemeriksaan,
       K.Pengobatan,
       U.Nama AS Dokter
   FROM
       Kesehatan K
   JOIN
       Akun U ON K.idUser = U.idUser  -- Menghubungkan dengan tabel Akun untuk mendapatkan nama dokter
   WHERE
       K.idHewan = p_idHewan
   ORDER BY
       K.Tanggal_pemeriksaan DESC;  -- Urutkan berdasarkan tanggal terbaru
END;

-- Stored Procedure untuk Pencarian di namaKesehatan
CREATE PROCEDURE SearchKesehatanByName (
    IN p_Hasil_pemeriksaan TEXT
)
BEGIN
    SELECT 
        idKesehatan, 
        idHewan, 
        idUser, 
        Tanggal_pemeriksaan, 
        Hasil_pemeriksaan, 
        pengobatan
    FROM 
        Kesehatan
    WHERE 
        Hasil_pemeriksaan LIKE CONCAT('%', p_Hasil_pemeriksaan, '%');
END;


CALL SearchKesehatanByName('sakit');

-- Stored Procedure untuk menambahkan data produksi hewan.----------------------------------------------------------------------------------------------
CREATE PROCEDURE InsertProduksi (
    IN p_idHewan INT,
    IN p_idUser INT,
    IN p_Jenis_produksi VARCHAR(100),
    IN p_Jumlah INT,
    IN p_Stok INT
)
BEGIN
	-- penaganan kesalahan 
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		-- rollback jika terjadi kesalahan
		ROLLBACK;
	END;

	-- memulai transaksi
	START TRANSACTION;

	-- menyisipkan data ke tabel produksi
    INSERT INTO Produksi (idHewan, idUser, Jenis_produksi, Jumlah, Stok) 
    VALUES (p_idHewan, p_idUser, p_Jenis_produksi, p_Jumlah, p_Stok);
   
   -- commit transaksi juka berhasil
   COMMIT;
END;

-- store prosedur untuk mengupdate data produksi
CREATE PROCEDURE UpdateProduksi (
   IN p_idProduksi INT,
   IN p_idHewan INT,
   IN p_idUser INT,
   IN p_Jenis_produksi VARCHAR(100),
   IN p_Jumlah INT,
   IN p_Stok INT
)
BEGIN
	-- penanganan kesalahan
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		-- rollback jika terjadi kesalahan
		ROLLBACK;
	END;

	-- memulai transaksi
	START TRANSACTION;

	-- update data dari tabel produksi
   UPDATE Produksi
   SET 
       idHewan = p_idHewan,
       idUser = p_idUser,
       Jenis_produksi = p_Jenis_produksi,
       Jumlah = p_Jumlah,
       Stok = p_Stok
   WHERE 
  	   idProduksi = p_idProduksi;
  	  
  -- commit transaksi jika berhasil
  COMMIT;
END;

-- Delete data produksi berdasarkan idProduksi
CREATE PROCEDURE DeleteProduksi (
   IN p_idProduksi INT
)
BEGIN
	-- penanganan kesalahan
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
		-- rollback jika terjadi kesalahan
		ROLLBACK;
	END;

	-- memulai transaksi
	START TRANSACTION;

	-- menghapus data dari tabel produkasi
   DELETE FROM Produksi 
   WHERE idProduksi = p_idProduksi;
  
  -- commit jika transaksi berhasil
  COMMIT;
END;

-- Read data produk berdasarkan idProduksi
CREATE PROCEDURE GetProduksiById (
   IN p_idProduksi INT
)
BEGIN
   SELECT idProduksi, idHewan, idUser, Jenis_produksi, Jumlah, Stok
   FROM Produksi
   WHERE idProduksi = p_idProduksi;
END;

-- Stored Procedure untuk mencari Hewan berdasarkan idHewan dan/atau Spesies.
CREATE PROCEDURE GetHewanByIdAndSpecies (
    IN p_idHewan INT,
    IN p_Spesies VARCHAR(100)
)
BEGIN
    SELECT idHewan, Umur, Spesies, Status_kesehatan
    FROM Hewan 
    WHERE (idHewan = p_idHewan OR p_idHewan IS NULL)
      AND (Spesies = p_Spesies OR p_Spesies IS NULL);
END;

-- Contoh mencari berdasarkan idHewan saja
CALL sp_GetHewanByIdAndSpecies(1, NULL);

-- Contoh mencari berdasarkan Spesies saja
CALL sp_GetHewanByIdAndSpecies(NULL, 'Sapi');

-- procedure data produksi berdasarkan namaProduksi
CREATE PROCEDURE SearchProduksiByName (
    IN p_Jenis_produksi VARCHAR(100)
)
BEGIN
    SELECT idProduksi, idHewan, idUser, Jenis_produksi, Jumlah, Stok
    FROM Produksi
    WHERE Jenis_produksi LIKE CONCAT('%', p_Jenis_produksi, '%');
END;


-- Stored Procedure untuk menambahkan data pakan yang diberikan kepada hewan.----------------------------------------------------------------------------
CREATE PROCEDURE InsertPakan (
    IN p_idUser INT,
    IN p_Jenis_pakan VARCHAR(100),
    IN p_Jumlah INT,
    IN p_Stok INT
)
BEGIN
	-- Penanganan kesalahan
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        -- Rollback jika terjadi kesalahan
        ROLLBACK;
    END;

    -- Memulai transaksi
    START TRANSACTION;
   
   -- menyisipkan data  ke tabel pakan
    INSERT INTO Pakan (idUser, Jenis_pakan, Jumlah, Stok) 
    VALUES (p_idUser, p_Jenis_pakan, p_Jumlah, p_Stok);
   
    -- Commit transaksi jika berhasil
    COMMIT;
END ;

-- Read data pakan berdasarkan idPakan
CREATE PROCEDURE GetPakanById (
   IN p_idPakan INT
)
BEGIN
   SELECT * FROM Pakan WHERE idPakan = p_idPakan;
END;

-- Update data pakan berdasarkan idPakan
CREATE PROCEDURE UpdatePakan (
   IN p_idPakan INT,
   IN p_idUser INT,
   IN p_Jenis_pakan VARCHAR(100),
   IN p_Jumlah INT,
   IN p_Stok INT
)
BEGIN
	-- Penanganan kesalahan
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        -- Rollback jika terjadi kesalahan
        ROLLBACK;
    END;

    -- Memulai transaksi
    START TRANSACTION;
   
   -- update data ke table pakan
   UPDATE Pakan
   SET idUser = p_idUser,
       Jenis_pakan = p_Jenis_pakan,
       Jumlah = p_Jumlah,
       Stok = p_Stok
   WHERE idPakan = p_idPakan;
  
  -- Commit transaksi jika berhasil
    COMMIT;
END;

-- delete data pakan berdasarkan idPakan
CREATE PROCEDURE DeletePakan (
   IN p_idPakan INT
)
BEGIN
	-- Penanganan kesalahan
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        -- Rollback jika terjadi kesalahan
        ROLLBACK;
    END;

    -- Memulai transaksi
    START TRANSACTION;

    -- Menghapus data dari tabel pakan
   DELETE FROM Pakan 
   WHERE idPakan = p_idPakan;
  
  -- Commit transaksi jika berhasil
    COMMIT;
END;
drop PROCEDURE SearchPakanByName;
-- Stored Procedure untuk Pencarian di namaPakan
CREATE PROCEDURE ambil_jenis_pakan()
BEGIN
   -- Mengambil daftar jenis pakan
   SELECT idPakan, Jenis_pakan, Stok
   FROM Pakan;
END;


-- function ----------------------------- function -------------------------------------------------------------------------------

-- Function untuk mendapatkan nama user dari idUser
-- CREATE FUNCTION GetNamaUserById (
--    p_idUser INT
-- )
-- RETURNS VARCHAR(100)
-- DETERMINISTIC
-- BEGIN
--    DECLARE namaUser VARCHAR(100);
-- 
--    -- Mengambil nama user berdasarkan idUser
--    SELECT COALESCE(Nama, 'Tidak ditemukan') INTO namaUser
--    FROM Akun
--    WHERE idUser = p_idUser;
-- 
--    RETURN namaUser;
-- END;
-- SELECT GetNamaUserById(1) AS NamaUser;
-- -- jika idUser tidak ada menghasilkan output NULL
-- SELECT GetNamaUserById(99) AS NamaUser;
-- 
-- -- prosedure panggil nama user by id function
-- CREATE PROCEDURE ambil_nama_user(
--    IN p_idUser INT,
--    OUT namaUser VARCHAR(100)
-- )
-- BEGIN
--    -- Memanggil fungsi untuk mendapatkan nama user
--    SET namaUser = GetNamaUserById(p_idUser);
-- END;
-- 
-- CALL ambil_nama_user(1, @NamaUser);
-- SELECT @NamaUser AS NamaUser;


-- Function untuk menghitung jumlah hewan berdasarkan status kesehatannya
CREATE FUNCTION GetJumlahHewanByStatusKesehatan (
   p_Status_kesehatan VARCHAR(100)
)
RETURNS INT
DETERMINISTIC
BEGIN
   DECLARE jumlahHewan INT;

   -- Menghitung jumlah hewan berdasarkan kolom idHewan
   SELECT COUNT(idHewan) INTO jumlahHewan
   FROM Hewan
   WHERE Status_kesehatan = p_Status_kesehatan;

   RETURN jumlahHewan;
END;
SELECT GetJumlahHewanByStatusKesehatan('Sehat') AS JumlahHewanSehat;

-- prosedur untuk memenggil Function untuk menghitung jumlah hewan berdasarkan status kesehatannya
CREATE PROCEDURE get_jumlah_hewan_by_status_kesehatan(
   IN p_Status_kesehatan VARCHAR(100),
   OUT jumlahHewan INT
)
BEGIN
   -- Penanganan error
   DECLARE exitHandler INT DEFAULT 0;
   DECLARE EXIT HANDLER FOR SQLEXCEPTION
   BEGIN
      -- Rollback jika terjadi error
      SET exitHandler = 1;
      ROLLBACK;
   END;

   -- Mulai transaksi
   START TRANSACTION;

   BEGIN
      -- Query untuk menghitung jumlah hewan berdasarkan status kesehatan
      SELECT COUNT(idHewan) INTO jumlahHewan
      FROM Hewan
      WHERE Status_kesehatan = p_Status_kesehatan
      FOR UPDATE;

      -- Komit transaksi jika berhasil
      COMMIT;
   END;

   -- Rollback otomatis jika ada error
   IF exitHandler THEN
      ROLLBACK;
   END IF;
END;

CALL get_jumlah_hewan_by_status_kesehatan('sehat', @jumlahHewan);
SELECT @jumlahHewan AS jumlahHewan;




-- Function untuk mendapatkan jenis produksi berdasarkan idHewan
CREATE FUNCTION GetJenisProduksiByHewan(
   p_idHewan INT
)
RETURNS VARCHAR(100)
DETERMINISTIC
BEGIN
   RETURN (
       SELECT COALESCE(Jenis_produksi, 'Tidak ada data') 
       FROM Produksi 
       WHERE idHewan = p_idHewan 
       LIMIT 1
   );
END;

SELECT GetJenisProduksiByHewan(1) AS JenisProduksiHewan;

-- prosedur untuk memanggi Function untuk mendapatkan jenis produksi berdasarkan idHewan
CREATE PROCEDURE get_jenis_produksi_by_hewan(
   IN p_idHewan INT,
   OUT jenisProduksi VARCHAR(100)
)
BEGIN
   -- Penanganan error
   DECLARE exitHandler INT DEFAULT 0;
   DECLARE EXIT HANDLER FOR SQLEXCEPTION
   BEGIN
      -- Rollback jika terjadi error
      SET exitHandler = 1;
      ROLLBACK;
   END;

   -- Mulai transaksi
   START TRANSACTION;

   BEGIN
      -- Query untuk mendapatkan jenis produksi berdasarkan idHewan
      SET jenisProduksi = (
         SELECT COALESCE(Jenis_produksi, 'Tidak ada data')
         FROM Produksi
         WHERE idHewan = p_idHewan
         LIMIT 1
         FOR UPDATE
      );

      -- Komit transaksi jika berhasil
      COMMIT;
   END;

   -- Rollback otomatis jika ada error
   IF exitHandler THEN
      ROLLBACK;
   END IF;
END;


CALL get_jenis_produksi_by_hewan(1, @jenisProduksi);
SELECT @jenisProduksi AS JenisProduksi;

-- Function untuk menghitung total produksi dari jenis tertentu
CREATE FUNCTION GetTotalProduksiByJenis (
   p_Jenis_produksi VARCHAR(100)
)
RETURNS INT
DETERMINISTIC
BEGIN
   DECLARE totalProduksi INT;

   -- Menghitung total jumlah produksi berdasarkan jenis produksi
   SELECT COALESCE(SUM(Jumlah), 0) INTO totalProduksi
   FROM Produksi
   WHERE Jenis_produksi = p_Jenis_produksi;

   RETURN totalProduksi;
END;

SELECT GetTotalProduksiByJenis('Susu') AS TotalProduksiSusu;

-- prosedur memanggil Function untuk menghitung total produksi dari jenis tertentu
CREATE PROCEDURE hitung_total_produksi(
   IN p_Jenis_produksi VARCHAR(100),
   OUT totalProduksi INT
)
BEGIN
   -- Mulai transaksi
   DECLARE exitHandler INT DEFAULT 0;
   DECLARE EXIT HANDLER FOR SQLEXCEPTION
   BEGIN
      -- Rollback jika terjadi error
      SET exitHandler = 1;
      ROLLBACK;
   END;

   START TRANSACTION;

   BEGIN
      -- Memanggil fungsi untuk menghitung total produksi
      SET totalProduksi = (
         SELECT COALESCE(SUM(Jumlah), 0)
         FROM Produksi
         WHERE Jenis_produksi = p_Jenis_produksi
         FOR UPDATE
      );

      -- Komit transaksi jika tidak ada error
      COMMIT;
   END;

   -- Rollback otomatis jika ada error
   IF exitHandler THEN
      ROLLBACK;
   END IF;
END;


CALL hitung_total_produksi('Susu', @TotalProduksi);
SELECT @TotalProduksi AS TotalProduksiSusu;



-- Function untuk menghitung stok total pakan yang tersisa
CREATE FUNCTION GetTotalStokPakan()
RETURNS INT
DETERMINISTIC
BEGIN
   DECLARE totalStok INT;

   -- Menghitung total stok pakan
   SELECT COALESCE(SUM(Stok), 0) INTO totalStok
   FROM Pakan;

   RETURN totalStok;
END;
SELECT GetTotalStokPakan() AS TotalStokPakan;

-- prosedur memanggil function untuk mengambil data total stok pakan
-- Prosedur untuk menghitung total stok pakan menggunakan transaksi
CREATE PROCEDURE HitungTotalStokPakan(
   OUT totalStok INT
)
BEGIN
   DECLARE EXIT HANDLER FOR SQLEXCEPTION
   BEGIN
      -- Rollback jika ada error
      ROLLBACK;
      SET totalStok = NULL;
   END;

   -- Mulai transaksi
   START TRANSACTION;

   -- Hitung total stok pakan
   SELECT COALESCE(SUM(Stok), 0) INTO totalStok
   FROM Pakan;

   -- Commit transaksi jika berhasil
   COMMIT;
END;
CALL HitungTotalStokPakan(@stokPakan);
SELECT @stokPakan AS TotalStokPakan;


------------------- view ------------------------------------------------ view ---------------------------------------------------------------
-- View untuk menampilkan data pakan dan pengguna
CREATE VIEW Pakan_Stok AS
SELECT 
    p.idPakan,
    p.Jenis_pakan,
    p.Jumlah,
    p.Stok,
    a.Nama AS Pengguna
FROM 
    Pakan p
JOIN 
    Akun a ON p.idUser = a.idUser;

   

SELECT * FROM Pakan_Stok;

-- prosedure untuk menampilkan data pakan dan pengguna
CREATE PROCEDURE ambil_data_pakan_stok(p_idPakan  INT)
BEGIN
    -- kode lainnya
    SELECT * FROM Pakan_Stok WHERE idPakan = p_idPakan;
END;


call ambil_data_pakan_stok_user;

select * from Pakan_Stok;

-- View untuk menampilkan data produksi hewan
-- CREATE VIEW Produksi_Hewan AS
-- SELECT 
--     p.idProduksi,
--     h.Spesies AS Hewan,
--     p.Jenis_produksi,
--     p.Jumlah,
--     p.Stok,
--     a.Nama AS Pekerja
-- FROM 
--     Produksi p
-- JOIN 
--     Hewan h ON p.idHewan = h.idHewan
-- JOIN 
--     Akun a ON p.idUser = a.idUser;
-- 
-- 
-- -- prosedure untuk menampilkan data produksi hewan
-- CREATE PROCEDURE ambil_data_produksi_hewan(p_idProduksi INT)
-- BEGIN
--     -- Query yang mengambil data berdasarkan parameter
--     SELECT * FROM Produksi_Hewan WHERE idProduksi = p_idProduksi;
-- END;
-- 
-- 
-- call ambil_data_produksi_hewan(6);
-- 
-- select * from Produksi_Hewan;

-- View untuk menampilkan data kesehatan beserta nama dokter
CREATE VIEW View_Kesehatan_Dokter AS
SELECT 
    K.idKesehatan,
    H.idHewan,
    H.Spesies,
    H.Umur,
    H.Status_kesehatan,
    K.Tanggal_pemeriksaan,
    K.Hasil_pemeriksaan,
    K.pengobatan,
    A.Nama AS Nama_Dokter
FROM 
    Kesehatan K
INNER JOIN 
    Hewan H ON K.idHewan = H.idHewan
INNER JOIN 
    Akun A ON K.idUser = A.idUser
WHERE 
    A.is_dokter = TRUE;

-- prosedur untuk menampilkan data kesehatan dan nama dokter
CREATE PROCEDURE ambil_data_kesehatan_dokter(p_idKesehatan INT)
BEGIN
    -- kode lainnya
    SELECT * FROM View_Kesehatan_Dokter WHERE idKesehatan = p_idKesehatan;
END;

SELECT * FROM view_Kesehatan_dokter LIMIT 10;
call ambil_data_kesehatan_dokter;

select * from Kesehatan_Dokter;

-- triger ----------------------------------------------- triger----------------------------------------------------------------------------------
-- Trigger setelah data dimasukkan ke tabel Pakan
-- untuk memastikan bahwa stok pakan tidak akan berkurang jika tidak mencukupi, sehingga mencegah kesalahan dalam pengelolaan stok.
CREATE TRIGGER UpdateStokPakan_AfterInsert
AFTER INSERT ON Pakan
FOR EACH ROW
BEGIN
    IF NEW.Stok >= NEW.Jumlah THEN
        UPDATE Pakan
        SET Stok = Stok - NEW.Jumlah
        WHERE idPakan = NEW.idPakan;
    ELSE
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Stok pakan tidak mencukupi!';
    END IF;
END;
drop TRIGGER UpdateStokPakan_AfterInsert;

-- Trigger Memperbarui Status Kesehatan Hewan Setelah Produksi
-- untuk secara otomatis memperbarui status kesehatan hewan ketika ada peningkatan dalam jumlah produksi,
-- yang dapat menjadi indikator kesehatan hewan tersebut.
CREATE TRIGGER UpdateStatusHewan_AfterInsertProduksi
AFTER INSERT ON Produksi
FOR EACH ROW
BEGIN
    IF NEW.Jumlah > 50 THEN
        UPDATE Hewan
        SET Status_kesehatan = 'Produksi meningkat'
        WHERE idHewan = NEW.idHewan;
    END IF;
END;


-- Trigger Validasi Dokter Sebelum Menambahkan Data Kesehatan
-- CREATE TRIGGER ValidateDokter_BeforeInsertKesehatan
-- BEFORE INSERT ON Kesehatan
-- FOR EACH ROW
-- BEGIN
--     IF (SELECT is_dokter FROM Akun WHERE idUser = NEW.idUser) = 0 THEN
--         SIGNAL SQLSTATE '45000'
--         SET MESSAGE_TEXT = 'Hanya dokter yang dapat menambahkan catatan kesehatan.';
--     END IF;
-- END;

--  Trigger Memperbarui Informasi Riwayat di Tabel Kesehatan
-- untuk melacak kapan data kesehatan terakhir diperbarui dan oleh siapa, yang penting untuk audit dan pengelolaan data.
CREATE TRIGGER UpdateKesehatan_AfterUpdate
AFTER UPDATE ON Kesehatan
FOR EACH ROW
BEGIN
    UPDATE Kesehatan
    SET LastUpdated = CURRENT_TIMESTAMP,
        LastUpdatedBy = NEW.idUser
    WHERE idKesehatan = NEW.idKesehatan;
END;
