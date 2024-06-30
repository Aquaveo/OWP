import { Route } from 'react-router-dom';
import ErrorBoundary from 'components/error/ErrorBoundary';
import Layout from 'components/layout/Layout';
import Loader from 'components/loader/Loader';
import OWPView from 'views/OwpView';
import 'App.scss';



function App() {
  const PATH_HOME = '/',
        PATH_INFO = '/Information/';
  return (
    <>
      <ErrorBoundary>
          <Loader>
              <Layout 
                navLinks={[
                  {title: 'OWP Application', to: PATH_HOME, eventKey: 'link-home'},
                  {title: 'Information', to: PATH_INFO, eventKey: 'link-learn'},
                ]}
                routes={[
                  <Route path={PATH_HOME} element={<OWPView />} key='route-home' />,
                ]}
              />
          </Loader>
      </ErrorBoundary>
    </>
  );
}

export default App;


