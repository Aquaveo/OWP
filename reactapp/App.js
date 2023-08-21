import { Route } from 'react-router-dom';

import ErrorBoundary from 'components/error/ErrorBoundary';
import Layout from 'components/layout/Layout';
import Loader from 'components/loader/Loader';

import Home2 from 'views/home/Home';
import LearnReact from 'views/learn/LearnReact';
import PlotView from 'views/plot/Plot';
import Home from 'views/home_page/Home';

import 'App.scss';

function App() {
  const PATH_HOME = '/',
        PATH_PLOT = '/plot/',
        PATH_OWP = '/OWP/',
        PATH_LEARN = '/learn/';
  return (
    <>
      <ErrorBoundary>
          <Loader>
            <Layout 
              navLinks={[
                {title: 'Home', to: PATH_HOME, eventKey: 'link-home'},
                {title: 'OWP', to: PATH_OWP, eventKey: 'link-owp'},
                {title: 'Plot', to: PATH_PLOT, eventKey: 'link-plot'},
                {title: 'Learn React', to: PATH_LEARN, eventKey: 'link-learn'},
              ]}
              routes={[
                <Route path={PATH_HOME} element={<Home2 />} key='route-home' />,
                <Route path={PATH_OWP} element={<Home />} key='route-home' />,
                <Route path={PATH_PLOT} element={<PlotView />} key='route-plot' />,
                <Route path={PATH_LEARN} element={<LearnReact />} key='route-learn' />,
              ]}
            />
          </Loader>
      </ErrorBoundary>
    </>
  );
}

export default App;