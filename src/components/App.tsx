import utils from '../utils';
import Home from './Home';
import Dashboard from './dashboard/App';

const App = async ({ name }: { name: string }) => {
  return (
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no, minimal-ui, viewport-fit=cover"/>
        <meta name="mobile-web-app-capable" content="yes"/>
        <meta name="apple-mobile-web-app-capable" content="yes"/>
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"/>
        <meta name="format-detection" content="telephone=no"/>
        <meta name="msapplication-tap-highlight" content="no"/>
        <title>{utils.getTitle()}</title>
      </head>
      <body>
        {/* Start the development here */}
        {utils.getComponentEndpoint() === '/dashboard' ?
          <Dashboard/> :
          <Home/>
        }
      </body>
    </html>
  );
};

export default App;
