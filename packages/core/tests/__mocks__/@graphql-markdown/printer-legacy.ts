export default class Printer {
  init = jest.fn((...args: any) => {});
  printHeader = jest.fn();
  printDescription = jest.fn();
  printCode = jest.fn();
  printCustomDirectives = jest.fn();
  printCustomTags = jest.fn();
  printTypeMetadata = jest.fn();
  printRelations = jest.fn();
  printType = jest.fn();
}
