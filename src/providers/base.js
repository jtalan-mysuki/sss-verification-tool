/**
 * Abstract base class for LLM vision providers.
 * All providers must implement `verifyImage(imageBase64, mimeType)`.
 */
export class BaseProvider {
  constructor(config) {
    if (new.target === BaseProvider) {
      throw new Error('BaseProvider is abstract and cannot be instantiated directly.');
    }
    this.config = config;
  }

  /**
   * @param {string} imageBase64 - Base64-encoded image data
   * @param {string} mimeType - MIME type of the image
   * @returns {Promise<VerificationResult>}
   */
  async verifyImage(_imageBase64, _mimeType) {
    throw new Error('verifyImage() must be implemented by the subclass.');
  }

  get name() {
    throw new Error('name getter must be implemented by the subclass.');
  }
}

/**
 * @typedef {Object} VerificationResult
 * @property {boolean} isSariSariStore
 * @property {number} confidence  - 0 to 1
 * @property {string} reasoning
 * @property {string[]} detectedFeatures
 * @property {boolean} isScreenshot
 * @property {string[]} screenshotIndicators
 * @property {boolean} isDownloadedFromInternet
 * @property {string[]} internetIndicators
 * @property {boolean|null} isRecentPhoto  - null when recency cannot be determined
 * @property {string} recencyEvidence
 * @property {string} provider
 * @property {string} model
 */
