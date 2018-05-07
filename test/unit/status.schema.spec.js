'use strict';


/* dependencies */
const path = require('path');
const { expect } = require('chai');


/* declarations */
const Status =
  require(path.join(__dirname, '..', '..', 'lib', 'status.model'));


describe('Status', function () {

  describe('Schema', function () {

    it('should have jurisdiction field', function () {

      const jurisdiction = Status.schema.tree.jurisdiction;
      const instance = Status.schema.paths.jurisdiction.instance;

      expect(instance).to.be.equal('ObjectID');
      expect(jurisdiction).to.exist;
      expect(jurisdiction).to.be.an('object');
      expect(jurisdiction.type).to.be.a('function');
      expect(jurisdiction.type.name).to.be.equal('ObjectId');
      expect(jurisdiction.index).to.be.true;
      expect(jurisdiction.exists).to.be.true;
      expect(jurisdiction.autoset).to.be.true;
      expect(jurisdiction.autopopulate).to.exist;

    });

    it('should have name field', function () {

      const name = Status.schema.tree.name;
      const instance = Status.schema.paths.name.instance;

      expect(instance).to.be.equal('String');
      expect(name).to.exist;
      expect(name).to.be.an('object');
      expect(name.type).to.be.a('function');
      expect(name.type.name).to.be.equal('String');
      expect(name.required).to.be.true;
      expect(name.trim).to.be.true;
      expect(name.index).to.be.true;
      expect(name.searchable).to.be.true;

    });

    it('should have weight field', function () {

      const weight = Status.schema.tree.weight;
      const instance = Status.schema.paths.weight.instance;

      expect(instance).to.be.equal('Number');
      expect(weight).to.exist;
      expect(weight).to.be.an('object');
      expect(weight.type).to.be.a('function');
      expect(weight.type.name).to.be.equal('Number');
      expect(weight.index).to.be.true;
      expect(weight.default).to.exist;

    });

    it('should have color field', function () {

      const color = Status.schema.tree.color;
      const instance = Status.schema.paths.color.instance;

      expect(instance).to.be.equal('String');
      expect(color).to.exist;
      expect(color).to.be.an('object');
      expect(color.type).to.be.a('function');
      expect(color.type.name).to.be.equal('String');
      expect(color.trim).to.be.true;
      expect(color.default).to.be.exist;

    });

  });

});