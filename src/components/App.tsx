import { ClientCounter } from './ClientCounter.js';
import { ServerPing } from './ServerPing/index.js';
import { ServerBox } from './Box.js';
import { ServerProvider } from './ServerAction/Server.js';
import { ClientActionsConsumer } from './ServerAction/Client.js';
import AppExpo from '../../App.jsx';

console.log(AppExpo);

const App = async ({ name }: { name: string }) => {
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

module.exports = App;
