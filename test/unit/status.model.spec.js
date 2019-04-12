'use strict';


/* dependencies */
const path = require('path');
const { expect } = require('chai');


/* declarations */
const Status =
  require(path.join(__dirname, '..', '..', 'lib', 'status.model'));


describe('Status', () => {

  describe('Statics', () => {

    it('should expose model name as constant', () => {
      expect(Status.MODEL_NAME).to.exist;
      expect(Status.MODEL_NAME).to.be.equal('Status');
    });

    it('should expose autopulate as options', () => {
      expect(Status.OPTION_AUTOPOPULATE).to.exist;
      expect(Status.OPTION_AUTOPOPULATE)
        .to.be.eql({
          select: { name: 1, color: 1 },
          maxDepth: 1
        });
    });

    it('should expose default locale `en` when not set', () => {
      expect(Status.DEFAULT_LOCALE).to.exist;
      expect(Status.DEFAULT_LOCALE).to.equal('en');
    });

  });
});
