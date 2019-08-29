import { expect } from '@lykmapipo/mongoose-test-helpers';
import Status from '../../src/status.model';

describe('Status Statics', () => {
  it('should expose model name as constant', () => {
    expect(Status.MODEL_NAME).to.exist;
    expect(Status.MODEL_NAME).to.be.equal('Status');
  });

  it('should expose autopulate as options', () => {
    expect(Status.OPTION_AUTOPOPULATE).to.exist;
    expect(Status.OPTION_AUTOPOPULATE).to.be.eql({
      select: { name: 1, color: 1 },
      maxDepth: 1,
    });
  });

  it('should expose field select option', () => {
    expect(Status.OPTION_SELECT).to.exist;
    expect(Status.OPTION_SELECT).to.be.eql({ name: 1, color: 1 });
  });

  it('should expose autopulate as options', () => {
    expect(Status.OPTION_AUTOPOPULATE).to.exist;
    expect(Status.OPTION_AUTOPOPULATE).to.be.eql({
      select: { name: 1, color: 1 },
      maxDepth: 1,
    });
  });
});
