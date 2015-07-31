/* eslint-env mocha */
'use strict';

var external = require('./index.js');
var jsdom = require('jsdom');
var extend = require('extend');
var util = require('util');
var assert = require('assert');

function makeLinkNode(options, cb) {
  options = extend(false, {
    url: 'http://aboutandrew.co.uk',
    pageUrl: 'http://github.com',
    rel: '',
    target: ''
  }, options);

  jsdom.env({
    url: options.pageUrl,
    html: util.format('<a href="%s" target="%s" rel="%s"></a>', options.url, options.target, options.rel),
    done: function(err, window) {
      if (err) cb(err);
      cb(null, window.document.querySelector('a'), window);
    }
  });
}

describe('Make link node', function() {
  it('should make a link with target and rel set', function(done) {
    makeLinkNode({url: 'http://aboutandrew.co.uk', target: '_blank', rel: 'external'}, function(err, link) {
      assert.ifError(err);
      assert.equal(link.getAttribute('href'), 'http://aboutandrew.co.uk');
      assert.equal(link.getAttribute('target'), '_blank');
      assert.equal(link.getAttribute('rel'), 'external');
      done();
    });
  });

  it('should make a link without target and rel set', function(done) {
    makeLinkNode({url: 'http://aboutandrew.co.uk'}, function(err, link) {
      assert.ifError(err);
      assert.equal(link.getAttribute('href'), 'http://aboutandrew.co.uk');
      assert.equal(link.getAttribute('rel'), '');
      assert.equal(link.getAttribute('target'), '');
      done();
    });
  });

  it('should set the current domain', function(done) {
    makeLinkNode({pageUrl: 'http://somewhere.co.uk/awesome'}, function(err, link, window) {
      assert.ifError(err);
      assert.equal(window.location.href, 'http://somewhere.co.uk/awesome');
      done();
    });
  });
});

describe('External link', function() {
  it('should know a absoloute relative link is not external', function(done) {
    makeLinkNode({url: '/somewhere'}, function(err, link) {
      assert.equal(external(link), false);
      done();
    });
  });

  it('should know a name anchor link on the current page is not external', function(done) {
    makeLinkNode({url: '#awesome'}, function(err, link) {
      assert.equal(external(link), false);
      done();
    });
  });

  it('should know a name anchor link on another page is not external', function(done) {
    makeLinkNode({url: 'somedire/page#awesome'}, function(err, link) {
      assert.equal(external(link), false);
      done();
    });
  });

  it('should know index.html is not external', function(done) {
    makeLinkNode({url: 'index.html'}, function(err, link) {
      assert.equal(external(link), false);
      done();
    });
  });

  it('should know ./index.html is not external', function(done) {
    makeLinkNode({url: './index.html'}, function(err, link) {
      assert.equal(external(link), false);
      done();
    });
  });

  it('should know somedir/page is not external', function(done) {
    makeLinkNode({url: 'somedir/page'}, function(err, link) {
      assert.equal(external(link), false);
      done();
    });
  });

  it('should know ../index.html is not external', function(done) {
    makeLinkNode({url: '../index.html'}, function(err, link) {
      assert.equal(external(link), false);
      done();
    });
  });

  it('should know a absoloute link is external', function(done) {
    makeLinkNode({url: 'https://github.com/foiseworth'}, function(err, link) {
      assert(external(link));
      done();
    });
  });

  it('should know a absoloute protocoless link is external', function(done) {
    makeLinkNode({url: '//github.com/foiseworth'}, function(err, link) {
      assert(external(link));
      done();
    });
  });

  it('should know a telephone link is external', function(done) {
    makeLinkNode({url: 'tel:0123456789'}, function(err, link) {
      assert(external(link));
      done();
    });
  });

  it('should know a mailto link is external', function(done) {
    makeLinkNode({url: 'mailto:test@test.com'}, function(err, link) {
      assert(external(link));
      done();
    });
  });

  it('should know a link with target="_blank" is external', function(done) {
    makeLinkNode({url: 'http://github.com', target: '_blank'}, function(err, link) {
      assert(external(link));
      done();
    });
  });

  it('should know a link with rel="external" is external', function(done) {
    makeLinkNode({url: 'http://github.com', rel: 'external'}, function(err, link) {
      assert(external(link));
      done();
    });
  });
});
