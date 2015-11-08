/**
 * Generate a random string
 *
 * @param {int} length the string length
 * @returns {string} the randomized string
 */
function uuid(length) {
    var str = "";

    for(var i = 0; i < length; i++) {
        str = "x" + str;
    }

    // str = "xxxxx...xx" length time
    var d = new Date().getTime();

    var uuid = str.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return ( c == "x" ? r : (r&0x3|0x8)).toString(16);
    });

    return uuid;
}