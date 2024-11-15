export const natsWrapper = {
  client: {
    publish: jest
      .fn()
      .mockImplementation(
        (subject: string, data: string, callback: () => void) => {
          callback();
        }
      ),
    // publish: (subject: string, data: string, callback: () => void) => {
    //   callback();
    // }
  },
};
