'use strict'

const exp = require('chai').expect

describe('User module', () => {
  describe('"up"', () => {
    it('should export a function', () => {
      exp(() => 3).to.be.a('function')
    })
  })
})
