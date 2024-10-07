import utils from '../utils';
import Home from './Home';
import Dashboard from './dashboard/App';

const App = async ({ name }: { name: string }) => {
  return (
    <html>
      <head>
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
