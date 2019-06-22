import config from './../plugins/config'
import i18n from '../plugins/i18n'

function statusCode(codeNumber) {
    switch (codeNumber) {
        case 0:
            {
                return i18n.t('livestream.status_txt[0]')
                break;
            }
        case 1:
            {
                return i18n.t('livestream.status_txt[1]')
                break;
            }
        case 2:
            {
                return i18n.t('livestream.status_txt[2]')
                break;
            }
        case 3:
            {
                return i18n.t('livestream.status_txt[3]')
                break;
            }
        case 4:
            {
                return  i18n.t('livestream.status_txt[4]')
                break;
            }
        case 5:
            {
                return i18n.t('livestream.status_txt[5]')
                break;
            }
    }
}

function getTargetVideo(idtarget) {
    return (config.urlFb + idtarget).trim()
}

function formatDate(timestamp, show_hour = false) {
    let date = new Date(timestamp * 1000);
    let formated = [date.getDate(), date.getMonth() + 1, date.getFullYear()].join("/");
    let hours = [date.getHours(), date.getMinutes(), date.getSeconds()].join(":");
    return formated + (show_hour ? (" " + hours) : "");
}

function formatDatePicker(time) {
    const timeArray = time.split(" ");
    const month = timeArray[0];
    let newMonth = '';
    switch (month) {
        case "Jan":
            {
                newMonth = '01'
                break;
            }
        case "Feb":
            {
                newMonth = '02'
                break;
            }
        case "Mar":
            {
                newMonth = '03'
                break;
            }
        case "Apr":
            {
                newMonth = '04'
                break;
            }
        case "May":
            {
                newMonth = '05'
                break;
            }
        case "Jun":
            {
                newMonth = '06'
                break;
            }
        case "Jul":
            {
                newMonth = '07'
                break;
            }
        case "Aug":
            {
                newMonth = '08'
                break;
            }
        case "Sep":
            {
                newMonth = '09'
                break;
            }
        case "Oct":
            {
                newMonth = '10'
                break;
            }
        case "Nov":
            {
                newMonth = '11'
                break;
            }
        case "Dec":
            {
                newMonth = '12'
                break;
            }
    }

    return timeArray[2] + '-' + newMonth + '-' + timeArray[1];
}

function chunk(soucre, length) {
    let data = [];
    let array = [];
    soucre.forEach(item => {
        array.push(item);
        if (array.length === length) {
            data.push(array);
            array = [];
        }
    });
    data.push(array);
    return data;
}

export {
    statusCode,
    formatDate,
    formatDatePicker,
    getTargetVideo,
    chunk
}