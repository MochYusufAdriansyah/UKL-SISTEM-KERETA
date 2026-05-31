-- CreateTable
CREATE TABLE `Users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(100) NOT NULL,
    `password` VARCHAR(100) NOT NULL,
    `role` ENUM('ADMIN', 'PENUMPANG') NOT NULL DEFAULT 'PENUMPANG',

    UNIQUE INDEX `Users_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pelanggan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `NIK` VARCHAR(100) NOT NULL,
    `nama_penumpang` VARCHAR(100) NOT NULL,
    `alamat` TEXT NOT NULL,
    `telp` VARCHAR(20) NOT NULL,
    `userId` INTEGER NOT NULL,

    UNIQUE INDEX `Pelanggan_NIK_key`(`NIK`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Petugas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_petugas` VARCHAR(100) NOT NULL,
    `alamat` TEXT NOT NULL,
    `telp` VARCHAR(20) NOT NULL,
    `userId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Kereta` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_kereta` VARCHAR(100) NOT NULL,
    `deskripsi` TEXT NOT NULL,
    `kelas` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Gerbong` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_gerbong` VARCHAR(100) NOT NULL,
    `kuota` INTEGER NOT NULL,
    `keretaId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Kursi` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `no_kursi` VARCHAR(20) NOT NULL,
    `gerbongId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Jadwal` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `asal_keberangkatan` VARCHAR(100) NOT NULL,
    `tujuan_keberangkatan` VARCHAR(100) NOT NULL,
    `tanggal_berangkat` DATETIME(3) NOT NULL,
    `tanggal_kedatangan` DATETIME(3) NOT NULL,
    `harga` DOUBLE NOT NULL,
    `keretaId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PembelianTiket` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tanggal_pembelian` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `pelangganId` INTEGER NOT NULL,
    `jadwalId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DetailPembelian` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `NIK` VARCHAR(100) NOT NULL,
    `nama_penumpang` VARCHAR(100) NOT NULL,
    `pembelianTiketId` INTEGER NOT NULL,
    `kursiId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Pelanggan` ADD CONSTRAINT `Pelanggan_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Petugas` ADD CONSTRAINT `Petugas_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Gerbong` ADD CONSTRAINT `Gerbong_keretaId_fkey` FOREIGN KEY (`keretaId`) REFERENCES `Kereta`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Kursi` ADD CONSTRAINT `Kursi_gerbongId_fkey` FOREIGN KEY (`gerbongId`) REFERENCES `Gerbong`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Jadwal` ADD CONSTRAINT `Jadwal_keretaId_fkey` FOREIGN KEY (`keretaId`) REFERENCES `Kereta`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PembelianTiket` ADD CONSTRAINT `PembelianTiket_pelangganId_fkey` FOREIGN KEY (`pelangganId`) REFERENCES `Pelanggan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PembelianTiket` ADD CONSTRAINT `PembelianTiket_jadwalId_fkey` FOREIGN KEY (`jadwalId`) REFERENCES `Jadwal`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DetailPembelian` ADD CONSTRAINT `DetailPembelian_pembelianTiketId_fkey` FOREIGN KEY (`pembelianTiketId`) REFERENCES `PembelianTiket`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DetailPembelian` ADD CONSTRAINT `DetailPembelian_kursiId_fkey` FOREIGN KEY (`kursiId`) REFERENCES `Kursi`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
