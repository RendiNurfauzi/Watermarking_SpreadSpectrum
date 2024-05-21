document.addEventListener('DOMContentLoaded', function() {
    const inputImageButton = document.querySelector('.inputImageButton');
    const inputWatermarkButton = document.querySelector('.inputWatermarkButton');
    const processImageButton = document.querySelector('.processImageButton');
    const cekWatermark = document.querySelector('.cekWatermark');
    const imageInput = document.getElementById('imageInput');
    const imagePlaceholder = document.querySelector('.imagePlaceholder');
    const watermarkInput = document.getElementById('watermarkInput');
    let watermarkImage; // Variabel untuk menyimpan data gambar watermark
    const imagePlaceholder2 = document.querySelector('.imagePlaceholder2');



    inputImageButton.addEventListener('click', function() {
        imageInput.click(); // Trigger klik pada input file
    });

    imageInput.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            var reader = new FileReader();
            reader.onload = function(e) {
                imagePlaceholder.innerHTML = `<img src="${e.target.result}" alt="Loaded Image" style="width: 100%; height: auto;">`;
            };
            reader.readAsDataURL(this.files[0]);
        }
    });

    inputWatermarkButton.addEventListener('click', function() {
        watermarkInput.click(); // Trigger klik pada input file watermark
    });

    watermarkInput.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            var reader = new FileReader();
            reader.onload = function(e) {
                watermarkImage = e.target.result; // Menyimpan data URL gambar watermark
                console.log('Watermark loaded');
            };
            reader.readAsDataURL(this.files[0]);
        }
    });

    processImageButton.addEventListener('click', function() {
        const originalImage = document.querySelector('.imagePlaceholder img');
        const watermarkCanvas = document.createElement('canvas');
        const ctxWatermark = watermarkCanvas.getContext('2d');
    
        const outputCanvas = document.createElement('canvas');
        const ctxOutput = outputCanvas.getContext('2d');
    
        const img = new Image();
        img.src = originalImage.src;
        img.onload = function() {
            const width = img.width;
            const height = img.height;
            outputCanvas.width = width;
            outputCanvas.height = height;
            ctxOutput.drawImage(img, 0, 0);
    
            const imgData = ctxOutput.getImageData(0, 0, width, height);
            const data = imgData.data;
    
            const watermarkImg = new Image();
            watermarkImg.src = watermarkImage;
            watermarkImg.onload = function() {
                // Menyesuaikan ukuran watermark dengan ukuran gambar asli
                watermarkCanvas.width = width;
                watermarkCanvas.height = height;
                ctxWatermark.drawImage(watermarkImg, 0, 0, width, height); // Menggambar watermark dengan ukuran yang disesuaikan
    
                const watermarkData = ctxWatermark.getImageData(0, 0, width, height).data;
    
                // Menggunakan metode Spread Spectrum untuk menyisipkan watermark
                const spreadFactor = 0.05; // Faktor penyebaran, bisa disesuaikan
                for (let i = 0; i < data.length; i += 4) {
                    for (let j = 0; j < 3; j++) { // RGB channels
                        const watermarkPixel = watermarkData[i + j];
                        data[i + j] = (data[i + j] & 0xFE) | ((watermarkPixel & 0x80) >> 7);
                        data[i + j] += Math.floor((Math.random() - 0.5) * 2 * watermarkPixel * spreadFactor);
                    }
                }
    
                ctxOutput.putImageData(imgData, 0, 0);
                imagePlaceholder2.innerHTML = `<img src="${outputCanvas.toDataURL()}" style="width: 100%; height: auto;">`;
    
                // Membuat link untuk download
                const downloadLink = document.createElement('a');
                downloadLink.href = outputCanvas.toDataURL('image/png');
                downloadLink.download = 'watermarked-image.png';
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
            };
        };
    });
    
    

    cekWatermark.addEventListener('click', function() {
        const originalImage = document.querySelector('.imagePlaceholder img');
        const extractCanvas = document.createElement('canvas');
        const ctxExtract = extractCanvas.getContext('2d');
    
        const watermarkCanvas = document.createElement('canvas');
        const ctxWatermark = watermarkCanvas.getContext('2d');
    
        const img = new Image();
        img.src = originalImage.src;
        img.onload = function() {
            const width = img.width;
            const height = img.height;
            extractCanvas.width = width;
            extractCanvas.height = height;
            ctxExtract.drawImage(img, 0, 0);
    
            const imgData = ctxExtract.getImageData(0, 0, width, height);
            const data = imgData.data;
    
            watermarkCanvas.width = width;
            watermarkCanvas.height = height;
            const watermarkData = ctxWatermark.createImageData(width, height);
            const wData = watermarkData.data;
    
            // Menggunakan metode Spread Spectrum untuk mengekstrak watermark
            for (let i = 0; i < data.length; i += 4) {
                for (let j = 0; j < 3; j++) { // RGB channels
                    // Mengambil bit terendah dari setiap channel dan menggunakannya untuk membentuk watermark
                    wData[i + j] = (data[i + j] & 0x01) * 255; // Mengambil LSB dan mengubahnya menjadi 0 atau 255
                    wData[i + j] -= Math.floor((Math.random() - 0.5) * 2 * wData[i + j]);
                }
                wData[i + 3] = 255; // Set alpha channel to fully opaque
            }
    
            ctxWatermark.putImageData(watermarkData, 0, 0);
            imagePlaceholder2.innerHTML = `<img src="${watermarkCanvas.toDataURL()}" style="width: 100%; height: auto;">`;
        };
    });
    
});

