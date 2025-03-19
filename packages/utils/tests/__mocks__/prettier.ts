module.exports = {
  __esModule: true,
  format: jest.fn().mockImplementation(async (content) => {
    return Promise.resolve(`prettified:${content}`);
  }),
};
