import { ClientCounter } from './ClientCounter.js';
import { ServerPing } from './ServerPing/index.js';
import { ServerBox } from './Box.js';
import { ServerProvider } from './ServerAction/Server.js';
import { ClientActionsConsumer } from './ServerAction/Client.js';
import AppExpo from '../../App.jsx';
import utils from '../utils';

const App = async ({ name }: { name: string }) => {
  console.log(utils.getRequest());
  return (
    <html>
      <head>
        <title>Waku example</title>
      </head>
      <body>
        <AppExpo/>
        <ServerBox>
          <p data-testid="app-name">{JSON.stringify(await require('fs').promises.readdir('./'))}</p>
          <ClientCounter />
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
