/**
 * Скрипт проверки скорости загрузки с CDN
 * @param images
 * @param statisticUrl
 * @returns {boolean}
 * @constructor
 */
var CDNDownloadTest = function(images, statisticUrl) {
    this.images = images;
    this.statisticUrl = statisticUrl;
    this.stat = [];

    if(!fetch || !this.statisticUrl) {
        return false;
    }

    for(var i = 0; i < this.images.length; i++) {
        this.load(this.images[i]);
    }

    return true;
};

/**
 * Загружает конкретную картинку
 * @param url
 */
CDNDownloadTest.prototype.load = function(url) {
    var image = new Image(),
        self = this;

    image.addEventListener('load', function() {
        var finishTime = (new Date()).getTime();

        self.stat.push({
            url: url,
            ms: finishTime - startTime
        });

        self.success();
    });

    image.addEventListener('error', function() {
        self.stat.push({
            url: url,
            ms: -1
        });

        self.success();
    });

    var startTime = (new Date()).getTime();
    image.src = url;
};

/**
 * Проверяет все ли изображения были обработаны
 */
CDNDownloadTest.prototype.success = function() {
    if(this.images.length === this.stat.length) {
        this.send();
    }
};

/**
 * Отправляет данные на сервер
 */
CDNDownloadTest.prototype.send = function() {
    fetch(this.statisticUrl, {
        method: "POST",
        body: JSON.stringify(this.stat)
    });

    console.log('done');
};

// ИНИЦИАЛИЗАЦИЯ
new CDNDownloadTest([
    'https://candyvalley-ru-g.cdnvideo.ru/candyvalley/candyvalley/site/img/preload/bg.f57d899edf.jpg',
    'https://candyvalley-ru-g.cdnvideo.ru/candyvalley/candyvalley/site/img/preload/bg.f57d899edf.jpg',
    'https://candyvalley-ru-g.cdnvideo.ru/candyvalley/candyvalley/site/img/preload/bg.f57d899edf.jpg',
    'https://candyvalley-ru-g.cdnvideo.ru/candyvalley/candyvalley/site/img/preload/bg.f57d899edf.jpg',
    'https://candyvalley-ru-g.cdnvideo.ru/candyvalley/candyvalley/site/img/preload/bg.f57d899edf.jpg',
    'https://candyvalley-ru-g.cdnvideo.ru/candyvalley/candyvalley/site/img/preload/bg.f57d899edf.jpg',
    'https://candyvalley-ru-g.cdnvideo.ru/candyvalley/candyvalley/site/img/preload/bg.f57d899edf.jpg_with_error'
], 'http://localhost/');