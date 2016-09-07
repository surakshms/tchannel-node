// Copyright (c) 2016 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

'use strict';

module.exports = RateCounter;

var assert = require('assert');

var DEFAULT_BUCKET_NUMBER = 20;

function RateCounter(options) {
    if (!(this instanceof RateCounter)) {
        return new RateCounter(options);
    }

    var self = this;
    self.index = 0;
    self.rps = 0;
    self.numOfBuckets = options.numOfBuckets || DEFAULT_BUCKET_NUMBER;
    self.buckets = [];
    self.buckets[0] = 0;
}

RateCounter.prototype.refresh = function refresh() {
    var self = this;
    // update the sliding window
    var next = (self.index + 1) % self.numOfBuckets;
    if (self.buckets[next]) {
        // offset the bucket being moved out
        self.rps -= self.buckets[next];
    }

    assert(self.rps >= 0, 'rps should always be larger equal to 0');
    self.index = next;
    self.buckets[self.index] = 0;
};

RateCounter.prototype.increment = function increment() {
    var self = this;
    self.buckets[self.index] += 1;
    self.rps += 1;
};