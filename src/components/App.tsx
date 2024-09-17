import { ClientCounter } from './ClientCounter.js';
import { ServerPing } from './ServerPing/index.js';
import { ServerBox } from './Box.js';
import { ServerProvider } from './ServerAction/Server.js';
import { ClientActionsConsumer } from './ServerAction/Client.js';
import AppExpo from '../../App.jsx';
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
        <AppExpo/>
        <ServerBox>
          <p data-testid="app-name">{JSON.stringify(await require('fs').promises.readdir('./'))}</p>
          {utils.getComponentEndpoint() === '/' && <ClientCounter />}
          <ServerPing />
          <ServerProvider>
            <ClientActionsConsumer />
          </ServerProvider>
        </ServerBox>
      </body>
    </html>
  );
};

export default App;
