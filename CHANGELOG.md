# Changelog

All notable changes to this project will be documented in this file.

## [0.5.0](https://github.com/forminator/react-wire/compare/v0.5.0-alpha.1...v0.5.0) (2022-04-02)

## [0.5.0-alpha.1](https://github.com/forminator/react-wire/compare/v0.5.0-alpha.0...v0.5.0-alpha.1) (2022-02-07)

### Features

- add id to state wires ([#61](https://github.com/forminator/react-wire/issues/61)) ([f8ce41b](https://github.com/forminator/react-wire/commit/f8ce41b2e5869a740005611dd4c3d514c7c836d2))

### Bug Fixes

- support re-wireing (uplink change) in strict mode for react 18 ([#63](https://github.com/forminator/react-wire/issues/63)) ([8f53c2e](https://github.com/forminator/react-wire/commit/8f53c2e1e05a0a990dc4520b1c00ac750aa7026c))

## [0.5.0-alpha.0](https://github.com/forminator/react-wire/compare/v0.4.2...v0.5.0-alpha.0) (2022-01-29)

### Features

- **state-wire:** use use-sync-external-store ([#50](https://github.com/forminator/react-wire/issues/50)) ([de15ac4](https://github.com/forminator/react-wire/commit/de15ac4b2ec14e8ddf35adbb0d56d2eaf5a74495))
- **use-subscribe:** call the callback when the value changes between render and effect ([#49](https://github.com/forminator/react-wire/issues/49)) ([e5836ff](https://github.com/forminator/react-wire/commit/e5836ffb057e599ad7ca6d44936465a746d74569))

### Bug Fixes

- **selector:** skip update value on connect if not required ([#52](https://github.com/forminator/react-wire/issues/52)) ([982cebf](https://github.com/forminator/react-wire/commit/982cebfb5f4ac235570cf012c976019bc9107879))
- update react and use react-test-renderer instead of react-dom ([#51](https://github.com/forminator/react-wire/issues/51)) ([4a6244a](https://github.com/forminator/react-wire/commit/4a6244a6e6cafa2cb273256a76511f77f4bb5bd7))

### Documentations

- **readme:** add motivation section ([#55](https://github.com/forminator/react-wire/issues/55)) ([bd3c7ba](https://github.com/forminator/react-wire/commit/bd3c7ba06081a574a8d7f7eca38b1508605bf1be))
- **readme:** add usage section ([#56](https://github.com/forminator/react-wire/issues/56)) ([b520957](https://github.com/forminator/react-wire/commit/b5209570242d2d716761553657a141acb83ba5a6))

### [0.4.2](https://github.com/forminator/react-wire/compare/v0.4.1...v0.4.2) (2021-04-14)

### Bug Fixes

- export isDefined and Defined ([#39](https://github.com/forminator/react-wire/issues/39)) ([bc49ae4](https://github.com/forminator/react-wire/commit/bc49ae4ebd60ed6583694b789975c613faaf2e68))

### [0.4.1](https://github.com/forminator/react-wire/compare/v0.4.0...v0.4.1) (2021-03-08)

### Features

- export selector options types ([#37](https://github.com/forminator/react-wire/issues/37)) ([79718a9](https://github.com/forminator/react-wire/commit/79718a9aff51f93886da1fd6b5be02d69c3491a2))

## [0.4.0](https://github.com/forminator/react-wire/compare/v0.3.3...v0.4.0) (2021-02-27)

### Features

- **fns-wire:** support rewiring ([#30](https://github.com/forminator/react-wire/issues/30)) ([f3d211a](https://github.com/forminator/react-wire/commit/f3d211aa398408b45b014f7aa8c1877af38360f7))
- **interceptor:** support rewiring ([#29](https://github.com/forminator/react-wire/issues/29)) ([625a34e](https://github.com/forminator/react-wire/commit/625a34e49b7f271de7855ab0580aae6a688abf03))
- **selector:** support dependencies ([#32](https://github.com/forminator/react-wire/issues/32)) ([30771a8](https://github.com/forminator/react-wire/commit/30771a8d87aef9bfe17515b2494370f0f2915f29))
- **state-wire:** support rewiring ([#28](https://github.com/forminator/react-wire/issues/28)) ([382efc6](https://github.com/forminator/react-wire/commit/382efc6f8453fc364730141563738eaaf31880e8))

### [0.3.3](https://github.com/forminator/react-wire/compare/v0.3.2...v0.3.3) (2020-11-10)

### Features

- **state-wire:** emit update only when the value is changed ([#25](https://github.com/forminator/react-wire/issues/25)) ([0ddb999](https://github.com/forminator/react-wire/commit/0ddb9995581b99fb113afc2b67a5b278e30970e9))

### Bug Fixes

- support fast-refresh ([#26](https://github.com/forminator/react-wire/issues/26)) ([369d7dd](https://github.com/forminator/react-wire/commit/369d7dde0e8ca8a302e265abef055694af37ee90))
- update dependencies ([#24](https://github.com/forminator/react-wire/issues/24)) ([7b30e0e](https://github.com/forminator/react-wire/commit/7b30e0e1ad31dc220e4cbdd95924763cfda231cc))

### [0.3.2](https://github.com/forminator/react-wire/compare/v0.3.1...v0.3.2) (2020-10-19)

### Features

- **fns-wire:** accept null and undefined in useFn function ([#23](https://github.com/forminator/react-wire/issues/23)) ([4e45fa6](https://github.com/forminator/react-wire/commit/4e45fa600d174f21d837a647317e5a6487d93b17))

### Documentations

- fix useSubscribe doc in readme ([#21](https://github.com/forminator/react-wire/issues/21)) ([681ef09](https://github.com/forminator/react-wire/commit/681ef09c19399dc757755b309ebbf91e19b17787))
- fix useSubscribe doc in readme ([#22](https://github.com/forminator/react-wire/issues/22)) ([8e8821d](https://github.com/forminator/react-wire/commit/8e8821d5e7ad7b383ac2cfd6dba731e92ce1be25))

### [0.3.1](https://github.com/forminator/react-wire/compare/v0.3.0...v0.3.1) (2020-07-15)

### Features

- **state-wire:** add useSubscribe hook ([#19](https://github.com/forminator/react-wire/issues/19)) ([6190f18](https://github.com/forminator/react-wire/commit/6190f18a954ce63c0633e59efa2eaf09fb78870a))

## [0.3.0](https://github.com/forminator/react-wire/compare/v0.2.5...v0.3.0) (2020-07-07)

### Features

- **selector:** add createSelector and useSelector ([75024ba](https://github.com/forminator/react-wire/commit/75024ba4b578da3b9a09241768a55a8594c5bfc7))
- **selector:** export useSelector and createSelector ([586a0e9](https://github.com/forminator/react-wire/commit/586a0e99660802dd12581130abb27b4c438a025b))
- **state-selector:** add createStateSelector ([5c7bd97](https://github.com/forminator/react-wire/commit/5c7bd97d19df26e10da02d3c0b13b6d8d5789559))
- **state-selector:** add useStateSelector ([ca0e3a0](https://github.com/forminator/react-wire/commit/ca0e3a059d10bc0098c5ee8bfae8204c39a4e576))

### Bug Fixes

- **wire:** add Fns generic to createWire ([7a23e2b](https://github.com/forminator/react-wire/commit/7a23e2b64cec190d8dfd98a5e609906afff884a2))

### Documentations

- **selector:** add useSelector and createSelector docs ([95c16e8](https://github.com/forminator/react-wire/commit/95c16e89e34c3d9f5dd767dec2331a0ecd885f87))

### [0.2.5](https://github.com/forminator/react-wire/compare/v0.2.4...v0.2.5) (2020-06-12)

### Documentations

- **wire:** add createWire dock ([21892ba](https://github.com/forminator/react-wire/commit/21892ba5d4753d94b879f11d17dc798e1652dcfa))

### [0.2.4](https://github.com/forminator/react-wire/compare/v0.2.3...v0.2.4) (2020-06-12)

### Features

- **wire:** add create wire ([4b378e2](https://github.com/forminator/react-wire/commit/4b378e2e69d097b0ba5181cd177fb59b5663d4bd))

### [0.2.3](https://github.com/forminator/react-wire/compare/v0.2.2...v0.2.3) (2020-06-05)

### Features

- **state-wire:** add readonly wire type ([b73b74c](https://github.com/forminator/react-wire/commit/b73b74c5fc1170c1374ad085bdfc0471085a8f5e))

### [0.2.2](https://github.com/forminator/react-wire/compare/v0.2.1...v0.2.2) (2020-03-30)

### Bug Fixes

- improve useWireState and useWire typing ([253c53d](https://github.com/forminator/react-wire/commit/253c53d5a5c4940e72c408ead60bb59bd97a9a4a))

### [0.2.1](https://github.com/forminator/react-wire/compare/v0.2.0...v0.2.1) (2020-03-30)

### Bug Fixes

- add default Fns type to wire ([104fb97](https://github.com/forminator/react-wire/commit/104fb97475f5e3623a40b45387b2db28fc3e037d))
- improve useWireValue typing ([a4475a4](https://github.com/forminator/react-wire/commit/a4475a403b9d98e34a08f426e84eac9643301e96))

## [0.2.0](https://github.com/forminator/react-wire/compare/v0.1.2...v0.2.0) (2020-03-29)

### Features

- add stability guard ([f529c74](https://github.com/forminator/react-wire/commit/f529c74751e853bf4ca150dd2a4b0f41b9c4d471))
- **fns-wire:** add fns-wire ([5fc7475](https://github.com/forminator/react-wire/commit/5fc7475dfab62460a219e162208e11da34a8458c))
- **interceptor:** add interceptor ([ecb959e](https://github.com/forminator/react-wire/commit/ecb959e5537d1d6887ee252e99e25f2b7655afe5))
- **state-wire:** add state wire ([22590a8](https://github.com/forminator/react-wire/commit/22590a884737147705ae4eea1fe2bec16ac1710c))
- **state-wire:** add use-wire-value ([7951ad7](https://github.com/forminator/react-wire/commit/7951ad7189751aedf84ebf0860bdfe61ed2f814e))
- **wire:** add use-wire ([ce9e825](https://github.com/forminator/react-wire/commit/ce9e82593ba4e31f8f0d26565734e438ff752a44))

### Bug Fixes

- update dependencies ([689638d](https://github.com/forminator/react-wire/commit/689638d71861cb2470b004bc03dd7bb816cff189))
- update dependencies ([474482b](https://github.com/forminator/react-wire/commit/474482b0674a95b1f811bfa9e0d8e3ddeb50d922))

### [0.1.2](https://github.com/forminator/react-wire/compare/v0.1.1...v0.1.2) (2019-12-20)

### Features

- **fns:** add fns and useFn ([7a8109b](https://github.com/forminator/react-wire/commit/7a8109b3065bc4408e49301b76e6c10ffb29ecef))

### Bug Fixes

- update dependencies ([a94f3cd](https://github.com/forminator/react-wire/commit/a94f3cdc90fdb4031a31e430902e238f822ab8dd))
- **fns:** fix empty Fs type problem ([f22479c](https://github.com/forminator/react-wire/commit/f22479cd4495bd9975bd1030a3e979206a3bffcc))

### Documentations

- update docs related to fns ([76cac88](https://github.com/forminator/react-wire/commit/76cac881ffde3f3791f4e5e4b7c3e636c6146332))

### [0.1.1](https://github.com/forminator/react-wire/compare/v0.1.0...v0.1.1) (2019-11-07)

### Features

- **use-interferer:** add use-interferer hook ([61ae360](https://github.com/forminator/react-wire/commit/61ae360f4485829297d688b29f9a1268087d3741))

### Bug Fixes

- **use-wire:** support initializer function returning undefined ([0fc7036](https://github.com/forminator/react-wire/commit/0fc703673fd77fdd763071101a0ab4e0abb7b144))
- **use-wire-state:** support initializer function returning undefined ([5e50241](https://github.com/forminator/react-wire/commit/5e502418be0fea49b031ef8661b6edf37cd5b539))

## 0.1.0 (2019-11-03)

### Features

- implement wire and hooks ([7bf363d](https://github.com/forminator/react-wire/commit/7bf363d2dadd4ed6b48ec66629db6a4ca5f6093a))
- init project ([5c54cbb](https://github.com/forminator/react-wire/commit/5c54cbb7e97134aeaf2f17626394c9bd217b14ea))

### Documentations

- add and build api docs ([b07c87d](https://github.com/forminator/react-wire/commit/b07c87d71777f61224a8f15e5062e5991a5aed35))
- add usage to readme ([204b1a1](https://github.com/forminator/react-wire/commit/204b1a177682c4184dbca9fd3fab42413f1cf0c6))
