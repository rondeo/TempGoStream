import config from '../plugins/config';
import user from './user';
var md5 = require('md5');
import i18n from '../plugins/i18n'
import { Platform, Alert} from 'react-native'

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == variable) {
            return decodeURIComponent(pair[1]);
        }
    }
    return null;
}

function imgurUpload(file) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://api.imgur.com/3/image');
        xhr.setRequestHeader('Authorization', 'Client-ID 6aed3dbf672cce1');
        const data = new FormData();
        data.append("image", { uri: file, type: "image/png" });
        //data.append('image', file);
        xhr.send(data);
        xhr.addEventListener('load', () => {
            const response = JSON.parse(xhr.responseText);
            resolve(response);
        });
        xhr.addEventListener('error', () => {
            reject();
        });
    });
}

function generalCatch(error, reject) {
    //console.log("error", error);
    if (error.error) error = error.error;
    if (error.code !== undefined) error.code = error.code.toString().replace("/", "-");
    let mess = error.message ? i18n.t("notify.title.error")+ ": "+error.message : i18n.t("notify.title.error")+": "+error.code ;
    //let title = i18n.t("notify.title.error")+ error.code.split("/").pop() + i18n.t("notify.content.") + error.message
    Alert.alert(mess);
    reject && reject(error);
}

function loadCss(url) {
    var cssId = url.split("/").pop().replace(".", "_");
    if (!document.getElementById(cssId)) {
        var head = document.getElementsByTagName('head')[0];
        var link = document.createElement('link');
        link.id = cssId;
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = url;
        link.media = 'all';
        head.appendChild(link);
    }
}

function loadScript(src) {
    return new Promise(function(resolve, reject) {
        var s;
        s = document.createElement('script');
        s.src = src;
        s.onload = resolve;
        s.onerror = reject;
        document.head.appendChild(s);
    });
}

function now() {
    const date = new Date();
    return parseInt(date.getTime() / 1000);
}

function api(path, data = null, showError = false) {
    function generate_signature(args) {
        let tmp_string = args.time + config.secret_token;
        if (args.data) tmp_string += args.data;
        return `time=${args.time}&sig=` + md5(tmp_string);
    }

    return user.methods.getToken().then(token => {
        if (data && typeof data !== "string") data = JSON.stringify(data);
        let query = generate_signature({ time: now(), data })
        const url = config.apiURL + '/' + path + (path.indexOf('?') > 0 ? '&' : '?') + query;
        console.log(url);
        let request_config = {};
        if (token && token.length) {
            request_config.headers = {
                "Authorization": "Bearer " + token
            };
        }
        if (data) {
            request_config['method'] = 'POST';
            request_config['body'] = data;
        }
        return new Promise((resolve, reject) => {
            fetch(url, request_config)
                .then(response => {
                    return response.json().then(json_data => {
                        if (json_data == null)
                            reject(json_data)
                        else if (json_data['error'] !== undefined) {
                            if (showError)
                                generalCatch(json_data['error'])
                            reject(json_data);
                        } else
                            resolve(json_data);
                    })
                })
                .catch(error => {
                    const return_error = {
                        code: "-1",
                        explain: 'Network error',
                        detail: error
                    };
                    showError && generalCatch(return_error);
                    reject({
                        error: return_error
                    });
                })
        });
    });
}

function getAvatar(network, uid) {
    switch (network) {
        case 'facebook':
            return 'https://graph.facebook.com/' + uid + '/picture?type=normal';
    }
}

function ucfirst(string) {
    if (!string || !string.charAt) return "";
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function formatMoney(m, c, d, t) {
    var number = parseFloat(m, 10);
    var tmp = number.toFixed(c).toString().split(".")
    var main_number = tmp[0];
    var leftover = tmp[1] ? tmp[1] : '';
    var i = 0;
    var final_number = "";
    while (true) {
        if (main_number[i] === undefined) break;
        if ((main_number.length - i) % 3 === 0 && final_number.length)
            final_number += t;
        final_number += main_number[i];
        i++;
    }
    return final_number + (leftover.length ? (d + leftover) : '');
}

function formatDate(timestamp, show_hour = false) {
    let date = new Date(timestamp * 1000);
    let formated = [date.getDate(), date.getMonth() + 1, date.getFullYear()].join("/");
    let hours = [date.getHours(), date.getMinutes(), date.getSeconds()].join(":");
    return formated + (show_hour ? (" " + hours) : "");
}

function youtube_parser(url) {
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    var match = url.match(regExp);
    return (match && match[7].length == 11) ? match[7] : false;
}


function facebook_videoid(url) {
    var regExp = /(?:https?:\/\/)?(?:www.|web.|m.)?facebook.com\/(?:video.php\?v=\d+|photo.php\?v=\d+|\?v=\d+)|\S+\/videos\/((\S+)\/(\d+)|(\d+))\/?/;
    var match = url.match(regExp);
    return match ? match[match.length - 1] : "";
}

function parseUrl(url) {
    var regex = /[?&]([^=#]+)=([^&#]*)/g,
        params = {},
        match;
    url = url ? url : window.location.href;
    while (match = regex.exec(url)) {
        params[match[1]] = decodeURIComponent(match[2]);
    }
    return params;
}

function today() {
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1; //January is 0!

    let yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    return dd + '/' + mm + '/' + yyyy;
}

function screen_size() {
    let w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    let h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    return [w, h];
}

function copyToClipboard(str) {
    const el = document.createElement('textarea');
    el.value = str;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

export {
    getQueryVariable,
    imgurUpload,
    generalCatch,
    loadCss,
    loadScript,
    api,
    getAvatar,
    ucfirst,
    formatMoney,
    formatDate,
    youtube_parser,
    parseUrl,
    today,
    screen_size,
    facebook_videoid,
    now,
    copyToClipboard,
    setCookie,
    getCookie
};