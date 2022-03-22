class Reader {
  constructor(source) {
    this.source = source;
    this.idx = 0;
  }
  next() {
    this.idx = this.idx + 1;
    return this.source[this.idx];
  }
  peekAhead(val = 1) {
    // Peek Ahead will return the next char in the source, WITHOUT changing our current index.
    return this.source[this.idx + val];
  }
  peekBack() {
    // Peek Back will return the last char in the source, WITHOUT changing our current index.
    return this.source[this.idx -1];
  }
  MatchAhead(charToMatch) {
    let count = 1;
    let originalString = charToMatch;

    while(this.peekAhead() === charToMatch) {
      count++;
      originalString += this.char;
      this.next();
    }

    return { count: count, originalString: originalString };
  }
  hasChar(closingChar, stops) {
    let index = 1;

    while(this.peekAhead(index) != closingChar) {
      // this will continue to move ahead in the document, as long as the character it encounters is not equal to the closing character
      if (typeof stops === 'object') {
        if (stops.includes(this.peekAhead(index))) {
          // we have found a stop character, and should break off the check
          return false;
        }
      }
      index++;
    }
    return true;
  }
  get char() {
    return this.source[this.idx];
  }
  get getIdx() {
    return this.idx;
  }
  get docLength() {
    return this.source.length;
  }
}

module.exports = {
  Reader,
};
