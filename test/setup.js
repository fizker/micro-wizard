import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import fzkes from 'fzkes'

chai.use(fzkes)
global.fzkes = fzkes

chai.use(chaiAsPromised)

global.expect = chai.expect
chai.should()
