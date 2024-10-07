import utils from '../utils';

console.log(utils);

const App = async ({ name }: { name: string }) => {
  console.log(process.env.solu_middleware_path);
  return (
    <html>
      <head>
        <title>Waku example</title>
      </head>
      <body>
        {/* Start the development here */}
      </body>
    </html>
  );
};

export default App;
