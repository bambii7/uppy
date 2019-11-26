const Core = require('@uppy/core')
const AwsS3 = require('./')

const file = {
  meta: {
    name: 'foo.jpg',
    type: 'image/jpg'
  }
}

describe('AwsS3', () => {
  it('Registers AwsS3 upload plugin', () => {
    const core = new Core()
    core.use(AwsS3)
    const pluginNames = core.plugins.uploader.map((plugin) => plugin.constructor.name)

    expect(pluginNames).toContain('AwsS3')
  })

  it('calls i18nInit when constructed', () => {
    const i18nInit = jest.fn()
    AwsS3.prototype.i18nInit = i18nInit
    const core = new Core()
    core.use(AwsS3)

    expect(i18nInit).toHaveBeenCalled()
  })

  describe('getUploadParameters', () => {
    it('Throws an error if configured without companionUrl', () => {
      const core = new Core()
      core.use(AwsS3)
      const awsS3 = core.getPlugin('AwsS3')

      expect(awsS3.opts.getUploadParameters).toThrow()
    })

    it('Does not throw an error with campanionUrl configured', () => {
      const core = new Core()
      core.use(AwsS3, { companionUrl: 'https://uppy-companion.myapp.com/' })
      const awsS3 = core.getPlugin('AwsS3')

      expect(() => awsS3.opts.getUploadParameters(file)).not.toThrow()
    })

    it('Does not throw an error with campanionUrl configured', () => {
      const core = new Core()
      core.use(AwsS3, { companionUrl: 'https://uppy-companion.myapp.com/' })
      const awsS3 = core.getPlugin('AwsS3')
      const uploadParams = awsS3.opts.getUploadParameters(file)

      expect(uploadParams).toBeInstanceOf(Promise)
    })
  })

  describe('validateParameters', () => {
    it('throws an error with invalid params', () => {
      const invalidParams = {
        url: [''],
        methods: '',
        fields: {}
      }
      const fn = () => AwsS3.prototype.validateParameters.call(this, file, invalidParams)

      expect(fn).toThrow()
    })

    it('throws an error with invalid params', () => {
      const validParams = {
        url: '',
        methods: {},
        fields: {}
      }
      const fn = () => AwsS3.prototype.validateParameters.call(this, file, validParams)

      expect(fn).not.toThrow()
    })

    it('returns the param object when valid', () => {
      const params = {
        url: '',
        methods: {},
        fields: {}
      }
      const validParams = AwsS3.prototype.validateParameters.call(this, file, params)

      expect(validParams).toStrictEqual(params)
    })
  })
})
