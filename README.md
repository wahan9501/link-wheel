# link-wheel

# Build
TBD

## Some Infra
- We use chrome extension schema v3.0.
- We use content script interface of [Chrome Extension](https://developer.chrome.com/docs/extensions/mv3/content_scripts/) to inject **wheel code** into user page.
- Due to the limitation of content script, we can't use ES module. This is a very significant impact and make the current architecture of this project:
    - All the **injection code for rendering wheel** will be bundled into **1 JS file**.
    - We use [CSS-in-JS](https://cssinjs.org/) solution.
    - For development convenience, we will setup a build target `WheelDev` to build a SPA for debugging the inject wheel, using the same wheel.* code.
    - Use [Gulp](https://gulpjs.com/) as build tool.
    - For Constants sharing, use Gulp to inject the constants.
