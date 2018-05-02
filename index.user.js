// ==UserScript==
// @name         TopCoder TimeZone UserScript
// @namespace    https://github.com/kmyk
// @version      1.0
// @description  convert the timezone used in TopCoder from EST/EDT to your local time
// @author       Kimiyuki Onaka
// @include      https://apps.topcoder.com/forums/
// @include      https://apps.topcoder.com/forums/?*module=Category*
// @include      https://apps.topcoder.com/forums/?*module=History*
// @include      https://apps.topcoder.com/forums/?*module=Thread*
// @include      https://apps.topcoder.com/forums/?*module=ThreadList*
// @include      https://apps.topcoder.com/*
// @include      https://community.topcoder.com/longcontest/?*module=ViewStandings*
// @include      https://community.topcoder.com/longcontest/?*module=ViewSubmissionHistory*
// @include      https://community.topcoder.com/longcontest/?*module=ViewExampleHistory*
// @include      https://community.topcoder.com/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.22.1/moment-with-locales.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.5.16/moment-timezone-with-data-2012-2022.min.js
// ==/UserScript==
function convert(text) {
    const zone = "America/Indiana/Indianapolis";
    let t = undefined;
    const match = text.match(/^\s*(?:\w+,? )?(\w+ \d+,? 20\d\d at \d+:\d\d [AP]M) (E[SD]T)\s*$/);
    if (match) {
        // example: "Wed, Apr 25, 2018 at 9:04 PM EDT" (https://apps.topcoder.com/forums/?module=Thread&threadID=916943&start=0)
        // example: "Thu, Jun 29 2017 at 12:42 AM EDT" (https://apps.topcoder.com/forums/)
        // example:     "Apr 27, 2018 at 12:26 AM EDT" (https://apps.topcoder.com/forums/?module=History)
        const format = "MMM DD YYYY hh:mm A";
        t = moment.tz(match[1], format, zone); // I want to use `match[2]` instead of `zone`, but moment-timezone say "Moment Timezone has no data for EDT". EST is accpeted.
    }
    else if (/^\s*\d\d.\d\d.20\d\d \d\d+:\d\d:\d\d\s*$/.test(text)) {
        // example: "04.22.2018 09:42:47" (https://community.topcoder.com/longcontest/?module=ViewStandings&rd=17143)
        const format = "MM.DD.YYYY HH:mm:ss";
        t = moment.tz(text, format, zone);
    }
    else {
        return "";
    }
    return text + " (" + t.local().format() + ")";
}
function main() {
    const tags = Array.prototype.slice.call(document.getElementsByTagName("*"));
    tags.reverse(); // to visit leaves at first
    for (const tag of tags) {
        const converted = convert(tag.textContent);
        if (converted) {
            tag.textContent = converted;
        }
    }
}
main();
