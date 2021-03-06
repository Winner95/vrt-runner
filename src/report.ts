import fs from 'fs';
import type { DiffResult } from 'compare';

export default function generateReport(reportFile: string, vrtResult: DiffResult) {
    fs.writeFileSync(reportFile, html(vrtResult));
}

function html(vrtResult: DiffResult) {
    return `
        <!doctype html>
        <html lang="en">
        <head>
            <link rel="stylesheet" href="./css/vrt.css"/>
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
            <meta charset="utf-8">
            <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0, user-scalable=no, minimum-scale=1.0, width=device-width">
            <title>Visual Regression Test - Comparison</title>
        </head>
        <body class="page-comparison">
            <div class="vrt-wrapper">
                ${navigation()}
                ${main(vrtResult)}
            </div>
            <script src="./js/comparison.js" async></script>
        </body>
        </html>
        `;
}

function navigation() {
    return `
        <nav class="vrt-sidemenu">
            <div class="vrt-navigation">
                <ul>
                    <li class="new"><a href="#vrt-new">New</a></li>
                    <li class="failed"><a href="#vrt-missing">Missing</a></li>
                    <li class="failed"><a href="#vrt-failed">Failed</a></li>
                    <li class="passed"><a href="#vrt-passed">Passed</a></li>
                </ul>
            </div>
        </nav>
    `;
}

function main({ new: new_, missing, failed, passed }: DiffResult) {
    return `
        <div class="vrt-main">
            <div class="suite vrt">
                    ${sectionNew(new_)}
                    ${sectionMissing(missing)}
                    ${sectionFailed(failed)}
                    ${sectionPassed(passed)}
                <div class="vrt-divider"></div>
            </div>
        </div>
    `;
}

function sectionNew(items: string[]) {
    return `
        <div class="vrt-section new" id="vrt-new">
            <h3 class="vrt-section__title">New</h3>
            <div class="vrt-section__actions">
                <div class="switcher">
                    <label class="switcher__label">Show images:</label>
                    <input class="switcher__input js-toggle-collapsed" type="checkbox" checked/>
                    <div class="switcher__toggle"></div>
                </div>
            </div>
            ${items.map(newItem).join('\n')}
        </div>
    `;
}

function newItem(itemName: string) {
    return `
        <div class="vrt-test new">
            <div class="vrt-test__toolbar">
                <kbd class="vrt-test__label">${itemName}</kbd>
            </div>
            <div class="vrt-test__screenshots">
                <a class="screenshot" href="#">
                    <img src="./test/${itemName}" />
                </a>
            </div>
        </div>
    `;
}

function sectionMissing(items: string[]) {
    return `
        <div class="vrt-section failed" id="vrt-missing">
            <h3 class="vrt-section__title">Missing</h3>
            <div class="vrt-section__actions">
                <div class="switcher">
                    <label class="switcher__label">Show images:</label>
                    <input class="switcher__input js-toggle-collapsed" type="checkbox" checked/>
                    <div class="switcher__toggle"></div>
                </div>
            </div>
            ${items.map(missingItem).join('\n')}
        </div>
    `;
}

function missingItem(itemName: string) {
    return `
        <div class="vrt-test failed">
            <div class="vrt-test__toolbar">
                <kbd class="vrt-test__label">${itemName}</kbd>
            </div>
            <div class="vrt-test__screenshots">
                <a class="screenshot" href="#">
                    <img src="./baseline/${itemName}" />
                </a>
            </div>
        </div>
    `;
}

function sectionFailed(items: string[]) {
    return `
        <div class="vrt-section failed" id="vrt-failed">
            <h3 class="vrt-section__title">Failed</h3>
            <div class="vrt-section__actions">
                <div class="switcher">
                    <label class="switcher__label">Show images:</label>
                    <input class="switcher__input js-toggle-collapsed" type="checkbox" checked/>
                    <div class="switcher__toggle"></div>
                </div>
            </div>
            ${items.map(failedItem).join('\n')}
        </div>
    `;
}

function failedItem(itemName: string) {
    return `
        <div class="vrt-test failed">
            <div class="vrt-test__toolbar">
                <kbd class="vrt-test__label">${itemName}</kbd>
                <div class="vrt-test__visualisation">
                    ${partialVisualisation()}
                </div>
            </div>
            <div class="vrt-test__screenshots">
                <div class="vrt-test__controls">
                    ${partialControls()}
                </div>
                <a class="screenshot baseline" href="#">
                    <img src="./baseline/${itemName}" />
                </a>
                <a class="screenshot delta" href="#">
                    <img src="./diff/${itemName}" />
                </a>
                <a class="screenshot current" href="#">
                    <img src="./test/${itemName}" />
                </a>
            </div>
        </div>
    `;
}

function sectionPassed(items: string[]) {
    return `
        <div class="vrt-section passed" id="vrt-passed">
            <h3 class="vrt-section__title">Passed</h3>
            <div class="vrt-section__actions">
                <div class="switcher">
                    <label class="switcher__label">Show images:</label>
                    <input class="switcher__input js-toggle-collapsed" type="checkbox" />
                    <div class="switcher__toggle"></div>
                </div>
            </div>
            ${items.map(itemPassed).join('\n')}
        </div>
    `;
}

function itemPassed(itemName: string) {
    return `
        <div class="vrt-test collapsed">
            <div class="vrt-test__toolbar">
                <kbd class="vrt-test__label">${itemName}</kbd>
            </div>
            <div class="vrt-test__screenshots">
                <a class="screenshot baseline" href="#">
                    <img data-src="./baseline/${itemName}" />
                </a>
                <a class="screenshot current" href="#">
                    <img data-src="./test/${itemName}" />
                </a>
            </div>
        </div>
    `;
}

function partialVisualisation() {
    return `
        <button class="js-toggle-visualisation" data-visualisation="side-by-side">Side-by-Side</button>
        <button class="js-toggle-visualisation" data-visualisation="fade">Fade</button>
        <button class="js-toggle-visualisation" data-visualisation="swipe">Swipe</button>
    `;
}

function partialControls() {
    return `<input class="controls-visualisation__range js-control-range" type="range" min="0" max="1" step="0.01" value="0.5" />`;
}
