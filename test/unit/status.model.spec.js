'use strict';


/* dependencies */
const path = require('path');
const { expect } = require('chai');


/* declarations */
const Status =
  require(path.join(__dirname, '..', '..', 'lib', 'status.model'));


describe('Status', function () {

  describe('Statics', function () {

    it('should expose model name as constant', function () {
      expect(Status.MODEL_NAME).to.exist;
      expect(Status.MODEL_NAME).to.be.equal('Status');
    });

    it('should expose autopulate as options', function () {
      expect(Status.OPTION_AUTOPOPULATE).to.exist;
      expect(Status.OPTION_AUTOPOPULATE)
        .to.be.eql({
          select: { name: 1, color: 1 },
          maxDepth: 1
        });
    });

    it('should expose default locale `en` when not set', function () {
      expect(Status.DEFAULT_LOCALE).to.exist;
      expect(Status.DEFAULT_LOCALE).to.equal('en');
    });

  });
});