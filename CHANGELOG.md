# Changelog

All notable changes to this project will be documented in this file.

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
