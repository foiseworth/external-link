# External Link
[![npm version](https://badge.fury.io/js/external-link.svg)](http://badge.fury.io/js/external-link)
[![Build Status](https://travis-ci.org/foiseworth/external-link.svg?branch=master)](https://travis-ci.org/foiseworth/external-link)

A simple function that tells you whether a link DOM node is 'external'.

A link is external if it:
* has the attribute rel="external"
* has the attribute target="\_blank"
* is an absolute link
* is a telephone link
* is a mailto link


## To use
```javascript
var external = require('external-link');
var link = document.querySelector('a');

external(link);
```
